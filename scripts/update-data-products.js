const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'canonical-catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const lines = [
  "import { Product } from '../store/cartSlice';",
  "",
  "export const sampleProducts: Product[] = ["
];

catalog.products.forEach((p, index) => {
  const prodObj = {
    id: p.slug,
    name: p.name,
    nameEn: p.nameEn,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.imageSecureUrls ? p.imageSecureUrls[0] : `/images/products/${p.slug}.png`,
    imagePublicId: p.imagePublicId,
    imagePublicIds: p.imagePublicIds,
    category: p.category,
    subcategory: p.subcategory || p.category,
    description: p.description,
    descriptionEn: p.descriptionEn,
    brand: p.brand || "Pandamarket",
    stock: p.stock || 100,
    unit: p.unit || "1 pc",
    discount: p.discount || 0,
    rating: p.rating || 4.8,
    reviews: p.reviews || 100,
    readinessStatus: "active_sellable",
    isFulfillable: true
  };
  
  const jsonStr = JSON.stringify(prodObj, null, 4).replace(/^/gm, '    ');
  lines.push(`${jsonStr}${index < catalog.products.length - 1 ? ',' : ''}`);
});

lines.push("];");
lines.push("");
lines.push("export const getProductById = (id: string): Product | undefined => {");
lines.push("  return sampleProducts.find((p) => p.id === id);");
lines.push("};");
lines.push("");
lines.push("export const getProductsByCategory = (category: string): Product[] => {");
lines.push("  return sampleProducts.filter((p) => p.category === category);");
lines.push("};");
lines.push("");

const outputPath = path.join(__dirname, '..', 'data', 'products.ts');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`✓ Successfully updated data/products.ts with ${catalog.products.length} canonical products!`);
