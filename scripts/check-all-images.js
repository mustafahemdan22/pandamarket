const fs = require('fs');
const path = require('path');
const seedData = require('../seed-data.json');

console.log("=== Auditing Image Assets for Catalog Products ===");

const generatedDir = path.join(__dirname, '..', 'generated-images');
const publicDir = path.join(__dirname, '..', 'public', 'images');
const productsDir = path.join(publicDir, 'products');

let foundCount = 0;
let missingCount = 0;

seedData.products.forEach((prod, i) => {
  let found = false;
  let location = "";

  // Check generated-images
  const genCatDir = path.join(generatedDir, prod.category, prod.slug);
  if (fs.existsSync(genCatDir)) {
    const files = fs.readdirSync(genCatDir).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
    if (files.length > 0) {
      found = true;
      location = `generated-images/${prod.category}/${prod.slug} (${files.length} imgs)`;
    }
  }

  // Check public/images/products
  if (!found && fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(f => f.includes(prod.slug.split('-')[0]) || f.includes(prod.slug.replace(/-/g, '_').substring(0, 10)));
    if (files.length > 0) {
      found = true;
      location = `public/images/products/${files[0]}`;
    }
  }

  // Check public/images/category/slug
  const pubCatDir = path.join(publicDir, prod.category, prod.slug);
  if (!found && fs.existsSync(pubCatDir)) {
    const files = fs.readdirSync(pubCatDir).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
    if (files.length > 0) {
      found = true;
      location = `public/images/${prod.category}/${prod.slug} (${files.length} imgs)`;
    }
  }

  if (found) {
    foundCount++;
    console.log(`[✓] ${prod.slug}: ${location}`);
  } else {
    missingCount++;
    console.log(`[✗] ${prod.slug}: MISSING`);
  }
});

console.log(`\nSummary: ${foundCount} found, ${missingCount} missing.`);
