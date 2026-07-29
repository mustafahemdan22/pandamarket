const fs = require('fs');
const path = require('path');
const https = require('https');
const cloudinary = require('cloudinary').v2;
const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// 1. Gather all existing local image files on disk into a map
function buildLocalImageMap() {
  const map = new Map(); // slug -> file paths array

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

// 2. Generate fallback image SVG
function createFallbackImage(prodName) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0fdf4"/>
        <stop offset="100%" stop-color="#e5e7eb"/>
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg)"/>
    <circle cx="400" cy="350" r="120" fill="#10b981" opacity="0.1"/>
    <text x="400" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="72" text-anchor="middle">🐼</text>
    <text x="400" y="470" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="bold" fill="#065f46" text-anchor="middle">${prodName.replace(/[<>&"]/g, '')}</text>
    <text x="400" y="510" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#6b7280" text-anchor="middle">PandaMarket Fresh Guaranteed</text>
  </svg>`;
  return Buffer.from(svg);
}

// 3. Upload to Cloudinary helper with retries
async function uploadFileToCloudinary(filePath, publicId) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image'
      });
      return res;
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(1000 * attempt);
    }
  }
}

async function main() {
  console.log("==================================================");
  console.log("   CONSOLIDATING & UPLOADING ALL IMAGES TO CLOUDINARY");
  console.log("==================================================");

  const localImageMap = buildLocalImageMap();
  console.log(`[1/5] Found local image sets for ${localImageMap.size} product slugs on disk.`);

  const categories = await convex.query('products:getCategories', {});
  console.log(`[2/5] Retrieved ${categories.length} categories from Convex.`);

  const consolidatedDir = path.join(__dirname, '..', 'public', 'pandamarket', 'categories');
  ensureDirSync(consolidatedDir);

  // Upload Category Banners
  console.log("\n[3/5] Consolidating & uploading category banners...");
  for (const cat of categories) {
    const catBannerPath = path.join(__dirname, '..', 'public', 'images', cat.slug, 'banner.png');
    const genBannerPath = path.join(__dirname, '..', 'generated-images', 'categories', cat.slug, 'banner.png');
    const bannerFile = fs.existsSync(catBannerPath) ? catBannerPath : (fs.existsSync(genBannerPath) ? genBannerPath : null);

    if (bannerFile) {
      const publicId = `pandamarket/categories/${cat.slug}/banner`;
      try {
        await uploadFileToCloudinary(bannerFile, publicId);
        console.log(`  ✓ Banner uploaded: ${cat.slug} -> ${publicId}`);
      } catch (err) {
        console.warn(`  ! Banner upload failed for ${cat.slug}: ${err.message}`);
      }
    }
  }

  // Process Products across all categories
  console.log("\n[4/5] Processing products...");
  const dbUpdates = [];
  let totalUploaded = 0;

  for (const cat of categories) {
    const products = await convex.query('products:getProductsByCategorySlug', { categorySlug: cat.slug });
    console.log(`\nProcessing category '${cat.slug}' (${products.length} products)...`);

    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      const prodSlug = prod.slug;
      const catSlug = cat.slug;

      const targetProdDir = path.join(consolidatedDir, catSlug, 'products', prodSlug);
      ensureDirSync(targetProdDir);

      let localFiles = localImageMap.get(prodSlug) || localImageMap.get(prodSlug.replace(/-/g, '_')) || [];
      localFiles = localFiles.filter(f => fs.existsSync(f));

      // If no image exists, generate fallback SVG locally
      if (localFiles.length === 0) {
        const svgBuffer = createFallbackImage(prod.nameEn || prod.name);
        const destSvg = path.join(targetProdDir, '1.svg');
        fs.writeFileSync(destSvg, svgBuffer);
        localFiles = [destSvg];
      } else {
        // Copy existing local files into target consolidated directory
        const copiedFiles = [];
        localFiles.forEach((srcFile, idx) => {
          const ext = path.extname(srcFile) || '.webp';
          const destPath = path.join(targetProdDir, `${idx + 1}${ext}`);
          try {
            fs.copyFileSync(srcFile, destPath);
            copiedFiles.push(destPath);
          } catch (e) {
            copiedFiles.push(srcFile);
          }
        });
        localFiles = copiedFiles;
      }

      // Upload to Cloudinary
      const uploadedPublicIds = [];
      for (let idx = 0; idx < localFiles.length; idx++) {
        const fileToUpload = localFiles[idx];
        const publicId = `pandamarket/categories/${catSlug}/products/${prodSlug}/${idx + 1}`;

        try {
          await uploadFileToCloudinary(fileToUpload, publicId);
          uploadedPublicIds.push(publicId);
          totalUploaded++;
        } catch (uploadErr) {
          console.error(`    ✗ Upload failed for ${publicId}: ${uploadErr.message}`);
        }
      }

      if (uploadedPublicIds.length > 0) {
        dbUpdates.push({
          id: prod._id,
          imagePublicId: uploadedPublicIds[0],
          imagePublicIds: uploadedPublicIds
        });
      }

      if ((i + 1) % 10 === 0 || i === products.length - 1) {
        console.log(`  Processed ${i + 1}/${products.length} products in ${cat.slug}`);
      }
    }
  }

  // 5. Update Convex Database in batches
  console.log(`\n[5/5] Updating ${dbUpdates.length} products in Convex database...`);
  const BATCH_SIZE = 50;
  let updatedCount = 0;

  for (let i = 0; i < dbUpdates.length; i += BATCH_SIZE) {
    const batch = dbUpdates.slice(i, i + BATCH_SIZE);
    try {
      const resCount = await convex.mutation('updateImages:updateImagesBatch', { updates: batch });
      updatedCount += resCount;
      console.log(`  ✓ Updated batch ${Math.floor(i / BATCH_SIZE) + 1} (${resCount} products)`);
    } catch (dbErr) {
      console.error(`  ✗ Batch update failed: ${dbErr.message}`);
    }
  }

  console.log("\n==================================================");
  console.log("             MIGRATION COMPLETED SUCCESS          ");
  console.log("==================================================");
  console.log(`Total Images Uploaded to Cloudinary: ${totalUploaded}`);
  console.log(`Total Products Updated in Convex:   ${updatedCount}`);
}

main().catch(err => {
  console.error("Migration script failed:", err);
  process.exit(1);
});
