require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');
const { ConvexHttpClient } = require('convex/browser');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const IMAGES_DIR = path.join(__dirname, '..', 'generated-images');

function uploadToCloudinary(localPath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        transformation: [
          { width: 2000, height: 2000, crop: 'limit' },
          { quality: 'auto:best' },
          { format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, secure_url: result.secure_url });
      }
    );
  });
}

async function uploadAllImages() {
  console.log('=== Uploading Generated Images to Cloudinary ===\n');
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('Generated images directory not found:', IMAGES_DIR);
    return;
  }

  const categories = fs.readdirSync(IMAGES_DIR);
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const category of categories) {
    const categoryPath = path.join(IMAGES_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    // Upload Category Banner if present
    const bannerPng = path.join(categoryPath, 'banner.png');
    const bannerWebp = path.join(categoryPath, 'banner.webp');
    const bannerPath = fs.existsSync(bannerPng) ? bannerPng : (fs.existsSync(bannerWebp) ? bannerWebp : null);
    if (bannerPath) {
      const bannerPublicId = `pandamarket/categories/${category}/banner`;
      try {
        const result = await uploadToCloudinary(bannerPath, bannerPublicId);
        console.log(`\n  [Banner] ✓ ${category} -> ${result.secure_url}`);
        totalUploaded++;
      } catch (error) {
        console.error(`  [Banner] ✗ ${category} banner failed: ${error.message}`);
        totalFailed++;
      }
    }
    
    const products = fs.readdirSync(categoryPath).filter(f => fs.statSync(path.join(categoryPath, f)).isDirectory());
    if (products.length > 0) {
      console.log(`\nCategory: ${category} (${products.length} products)`);
    }

    for (const productSlug of products) {
      const productPath = path.join(categoryPath, productSlug);
      if (!fs.statSync(productPath).isDirectory()) continue;

      const files = fs.readdirSync(productPath).filter(f => f.endsWith('.webp') || f.endsWith('.png')).sort((a, b) => {
        const numA = parseInt(a.replace(/\.(webp|png)$/, '')) || 0;
        const numB = parseInt(b.replace(/\.(webp|png)$/, '')) || 0;
        return numA - numB;
      });

      console.log(`  ${productSlug}: ${files.length} images`);

      for (const file of files) {
        const index = file.replace(/\.(webp|png)$/, '');
        const localPath = path.join(productPath, file);
        const publicId = `pandamarket/categories/${category}/products/${productSlug}/${index}`;

        try {
          const result = await uploadToCloudinary(localPath, publicId);
          console.log(`    ✓ ${index} -> ${result.secure_url}`);
          totalUploaded++;
        } catch (error) {
          console.error(`    ✗ ${index} failed: ${error.message}`);
          totalFailed++;
        }
      }
    }
  }

  console.log('\n=== UPLOAD COMPLETE ===');
  console.log(`Uploaded: ${totalUploaded}`);
  console.log(`Failed: ${totalFailed}`);

  // Verify in Convex
  console.log('\nVerifying Convex records...');
  const products = await convex.query('products:getAllProductsAdmin');
  const withImages = products.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0);
  console.log(`Products with images in Convex: ${withImages.length}/${products.length}`);
}

uploadAllImages().catch(console.error);