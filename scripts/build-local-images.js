const fs = require('fs');
const path = require('path');

const OLD_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const NEW_IMAGES_DIR = path.join(__dirname, '..', 'public', 'pandamarket', 'categories');

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

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyLocalImages() {
  console.log('=== Copying images to new local taxonomy ===\n');
  if (!fs.existsSync(OLD_IMAGES_DIR)) {
    console.error('Old images dir not found');
    return;
  }

  const categories = fs.readdirSync(OLD_IMAGES_DIR);
  let totalCopied = 0;

  for (const legacyCat of categories) {
    const categoryPath = path.join(OLD_IMAGES_DIR, legacyCat);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const newCategorySlug = categoryMap[legacyCat] || legacyCat;
    
    const products = fs.readdirSync(categoryPath);
    for (const productSlug of products) {
      const productPath = path.join(categoryPath, productSlug);
      if (!fs.statSync(productPath).isDirectory()) continue;

      const files = fs.readdirSync(productPath).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
      for (const file of files) {
        // We save them as .webp mostly.
        const destDir = path.join(NEW_IMAGES_DIR, newCategorySlug, 'products', productSlug);
        ensureDirSync(destDir);
        
        const sourcePath = path.join(productPath, file);
        // Save without extension locally? Next.js Image needs extension, or at least a file. 
        // We will keep the extension, e.g., 1.webp
        const destPath = path.join(destDir, file);

        try {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied: ${legacyCat}/${productSlug}/${file} -> ${newCategorySlug}/products/${productSlug}/${file}`);
          totalCopied++;
        } catch (error) {
          console.error(`Failed: ${error.message}`);
        }
      }
    }
  }
  console.log(`\nCopied ${totalCopied} images.`);
}

copyLocalImages();
