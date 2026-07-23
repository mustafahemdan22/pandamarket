require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

const categoryMap = {
  'bakery': 'bakery',
  'beverages': 'beverages',
  'cleaning': 'cleaning',
  'dairy': 'dairy-eggs',
  'dry-grocery': 'pantry',
  'fruits': 'vegetables-fruits',
  'grocery': 'pantry',
  'legumes': 'pantry',
  'oils': 'pantry',
  'pantry': 'pantry',
  'produce': 'vegetables-fruits',
  'rice': 'pantry',
  'sauces': 'pantry',
  'snacks': 'snacks-sweets',
  'spices': 'pantry',
  'vegetables': 'vegetables-fruits',
};

function uploadToCloudinary(localPath, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, secure_url: result.secure_url });
      }
    );
  });
}

async function uploadAllImages() {
  console.log('=== Uploading Legacy Local Images to Cloudinary ===\n');
  const categories = fs.readdirSync(IMAGES_DIR);

  for (const legacyCat of categories) {
    const categoryPath = path.join(IMAGES_DIR, legacyCat);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const newCategorySlug = categoryMap[legacyCat] || legacyCat;
    
    const products = fs.readdirSync(categoryPath);
    for (const productSlug of products) {
      const productPath = path.join(categoryPath, productSlug);
      if (!fs.statSync(productPath).isDirectory()) continue;

      const files = fs.readdirSync(productPath).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
      for (const file of files) {
        const index = file.replace(/\.(webp|png|jpg)$/, '');
        const localPath = path.join(productPath, file);
        const publicId = `pandamarket/categories/${newCategorySlug}/products/${productSlug}/${index}`;

        try {
          console.log(`Uploading: ${legacyCat}/${productSlug}/${file} -> ${publicId}`);
          await uploadToCloudinary(localPath, publicId);
          console.log(`  ✓ Success`);
        } catch (error) {
          console.error(`  ✗ Failed: ${error.message}`);
        }
      }
    }
  }
  console.log('Done!');
}

uploadAllImages().catch(console.error);
