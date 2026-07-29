const fs = require('fs');
const path = require('path');
const https = require('https');
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

// Base64 2x2 solid green PNG for instant crisp fallbacks
const GREEN_PNG_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAOSURBVBhXY2AYBAMAAAQAAYdF09wAAAAASUVORK5CYII=";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Gather all local image files across disk
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

async function uploadToCloudinary(fileOrData, publicId) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await cloudinary.uploader.upload(fileOrData, {
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
  console.log("    UPLOADING ALL 440 PRODUCTS TO CLOUDINARY     ");
  console.log("==================================================");

  const localMap = buildLocalImageMap();
  console.log(`Discovered local image sets for ${localMap.size} product slugs on disk.`);

  const categories = await client.query('products:getCategories', {});
  console.log(`Retrieved ${categories.length} categories from Convex.`);

  // Upload Banners
  console.log("\nUploading Category Banners...");
  for (const cat of categories) {
    const catBannerPath = path.join(__dirname, '..', 'public', 'images', cat.slug, 'banner.png');
    const genBannerPath = path.join(__dirname, '..', 'generated-images', 'categories', cat.slug, 'banner.png');
    const bannerFile = fs.existsSync(catBannerPath) ? catBannerPath : (fs.existsSync(genBannerPath) ? genBannerPath : null);

    const publicId = `pandamarket/categories/${cat.slug}/banner`;
    try {
      if (bannerFile) {
        await uploadToCloudinary(bannerFile, publicId);
      } else {
        await uploadToCloudinary(GREEN_PNG_BASE64, publicId);
      }
      console.log(`  ✓ Banner uploaded: ${cat.slug}`);
    } catch (e) {
      console.warn(`  ! Banner upload error (${cat.slug}): ${e.message}`);
    }
  }

  console.log("\nUploading Product Images...");
  let totalUploaded = 0;
  let totalProducts = 0;

  for (const cat of categories) {
    const products = await client.query('products:getProductsByCategorySlug', { categorySlug: cat.slug });
    console.log(`\nCategory '${cat.slug}' (${products.length} products):`);

    // Process concurrently in chunks of 5
    const CHUNK_SIZE = 5;
    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      const chunk = products.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(async (prod) => {
          totalProducts++;
          const prodSlug = prod.slug;
          const catSlug = cat.slug;

          let localFiles = localMap.get(prodSlug) || localMap.get(prodSlug.replace(/-/g, '_')) || [];
          // Filter out SVG files so Cloudinary only gets raster images (PNG, WebP, JPG)
          localFiles = localFiles.filter(f => fs.existsSync(f) && !f.endsWith('.svg'));

          const publicId = `pandamarket/categories/${catSlug}/products/${prodSlug}/1`;

          try {
            if (localFiles.length > 0) {
              await uploadToCloudinary(localFiles[0], publicId);
            } else {
              // Upload solid PNG fallback
              await uploadToCloudinary(GREEN_PNG_BASE64, publicId);
            }
            totalUploaded++;
          } catch (err) {
            console.error(`  ✗ Failed ${publicId}: ${err.message}`);
          }
        })
      );
      console.log(`  Processed ${Math.min(i + CHUNK_SIZE, products.length)}/${products.length}`);
    }
  }

  console.log("\n==================================================");
  console.log(`   SUCCESSFULLY UPLOADING ${totalUploaded}/${totalProducts} IMAGES TO CLOUDINARY`);
  console.log("==================================================");
}

main().catch(console.error);
