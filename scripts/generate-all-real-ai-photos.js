const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function buildLocalImageMap() {
  const map = new Map();
  const searchRoots = [
    path.join(__dirname, '..', 'generated-images'),
    path.join(__dirname, '..', 'public', 'images'),
    path.join(__dirname, '..', 'public', 'pandamarket', 'categories')
  ];

  function addImage(slug, filePath) {
    if (!slug) return;
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = map.get(cleanSlug) || [];
    if (!existing.includes(filePath)) {
      existing.push(filePath);
      map.set(cleanSlug, existing);
    }
  }

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
      } else if (/\.(webp|png|jpg|jpeg)$/i.test(item.name)) {
        const parentDir = path.basename(dir);
        if (parentDir !== 'images' && parentDir !== 'categories' && parentDir !== 'products' && parentDir !== 'generated-images') {
          addImage(parentDir, fullPath);
        }
      }
    }
  }

  searchRoots.forEach(r => walk(r));
  return map;
}

// Fetch real product photo from Pollinations AI
async function fetchPollinationsImage(brand, nameEn, unit, seed = 1) {
  const cleanName = (nameEn || '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  const cleanBrand = (brand || '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  const prompt = `Premium ultra-realistic commercial studio product photo of ${cleanBrand} ${cleanName} ${unit || ''}. Bright clean white background, professional 8k grocery item photo, vibrant color, sharp focus.`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true&seed=${seed}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
      clearTimeout(timeout);

      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 5000) return buffer;
      }
      await sleep(1500 * attempt);
    } catch (e) {
      await sleep(1500 * attempt);
    }
  }
  return null;
}

// Upload buffer directly to Cloudinary
function uploadBufferToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { public_id: publicId, overwrite: true, invalidate: true, resource_type: 'image' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    ).end(buffer);
  });
}

// Upload file directly to Cloudinary
async function uploadFileToCloudinary(filePath, publicId) {
  return await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: 'image'
  });
}

async function main() {
  console.log("==================================================");
  console.log("  GENERATING REAL PRODUCT PHOTOS FOR ALL PRODUCTS ");
  console.log("==================================================");

  const localMap = buildLocalImageMap();
  const categories = await client.query('products:getCategories', {});
  console.log(`Found ${categories.length} categories.`);

  const consolidatedDir = path.join(__dirname, '..', 'public', 'pandamarket', 'categories');

  let successCount = 0;
  let totalProcessed = 0;

  for (const cat of categories) {
    const products = await client.query('products:getProductsByCategorySlug', { categorySlug: cat.slug });
    console.log(`\nProcessing '${cat.slug}' (${products.length} products)...`);

    // Run 3 parallel workers
    const CHUNK_SIZE = 3;
    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      const chunk = products.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(async (prod, idx) => {
          totalProcessed++;
          const prodSlug = prod.slug;
          const catSlug = cat.slug;
          const publicId = `pandamarket/categories/${catSlug}/products/${prodSlug}/1`;
          const targetProdDir = path.join(consolidatedDir, catSlug, 'products', prodSlug);
          ensureDirSync(targetProdDir);

          let localFiles = localMap.get(prodSlug) || localMap.get(prodSlug.replace(/-/g, '_')) || [];
          localFiles = localFiles.filter(f => fs.existsSync(f) && !f.endsWith('.svg'));

          try {
            if (localFiles.length > 0) {
              // Upload existing local image photo
              await uploadFileToCloudinary(localFiles[0], publicId);
              successCount++;
              console.log(`  ✓ (${totalProcessed}) Local Photo: ${prod.nameEn || prod.name}`);
            } else {
              // Check if we already generated a local JPG photo
              const localJpg = path.join(targetProdDir, '1.jpg');
              if (fs.existsSync(localJpg) && fs.statSync(localJpg).size > 5000) {
                await uploadFileToCloudinary(localJpg, publicId);
                successCount++;
                console.log(`  ✓ (${totalProcessed}) Existing AI Photo: ${prod.nameEn || prod.name}`);
              } else {
                // Generate fresh real product photo via Pollinations
                const imgBuffer = await fetchPollinationsImage(prod.brand, prod.nameEn || prod.name, prod.unit, i + idx + 1);
                if (imgBuffer) {
                  fs.writeFileSync(localJpg, imgBuffer);
                  await uploadBufferToCloudinary(imgBuffer, publicId);
                  successCount++;
                  console.log(`  ✓ (${totalProcessed}) AI Photo Generated: ${prod.nameEn || prod.name}`);
                } else {
                  console.warn(`  ! (${totalProcessed}) Pollinations timed out for: ${prod.nameEn || prod.name}`);
                }
              }
            }
          } catch (err) {
            console.error(`  ✗ (${totalProcessed}) Error on ${publicId}: ${err.message}`);
          }
        })
      );
    }
  }

  console.log("\n==================================================");
  console.log(`  COMPLETED! Real Photos Uploaded: ${successCount}/${totalProcessed}`);
  console.log("==================================================");
}

main().catch(console.error);
