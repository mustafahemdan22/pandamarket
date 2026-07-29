const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Function to collect all local images in a map: prodSlug -> array of absolute file paths
function collectAllLocalImages() {
  const imageMap = new Map(); // slug -> filePaths[]

  const searchDirs = [
    path.join(__dirname, "..", "generated-images"),
    path.join(__dirname, "..", "public", "images"),
    path.join(__dirname, "..", "public", "pandamarket", "categories")
  ];

  function addImage(slug, filePath) {
    if (!slug) return;
    const existing = imageMap.get(slug) || [];
    if (!existing.includes(filePath)) {
      existing.push(filePath);
      imageMap.set(slug, existing);
    }
  }

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(webp|png|jpg|jpeg)$/i.test(entry.name)) {
        // Parent folder might be product slug or parent's parent
        const parentDirName = path.basename(dir);
        if (parentDirName !== "images" && parentDirName !== "categories" && parentDirName !== "products" && parentDirName !== "generated-images") {
          addImage(parentDirName, fullPath);
        }
      }
    }
  }

  searchDirs.forEach(d => walk(d));
  return imageMap;
}

async function audit() {
  const localImageMap = collectAllLocalImages();
  console.log(`Discovered local image sets for ${localImageMap.size} product slugs.`);

  const categories = await client.query("products:getCategories", {});
  console.log(`Found ${categories.length} categories in Convex.`);

  let totalProducts = 0;
  let productsWithLocalImages = 0;
  let productsMissingLocalImages = 0;

  const missingList = [];

  for (const cat of categories) {
    const products = await client.query("products:getProductsByCategorySlug", { categorySlug: cat.slug });
    totalProducts += products.length;

    for (const prod of products) {
      const localFiles = localImageMap.get(prod.slug) || localImageMap.get(prod.slug.replace(/-/g, "_")) || [];
      if (localFiles.length > 0) {
        productsWithLocalImages++;
      } else {
        productsMissingLocalImages++;
        missingList.push({ category: cat.slug, slug: prod.slug, name: prod.nameEn || prod.name });
      }
    }
  }

  console.log("\n--- AUDIT SUMMARY ---");
  console.log(`Total Products in Convex: ${totalProducts}`);
  console.log(`Products with Local Images found: ${productsWithLocalImages}`);
  console.log(`Products Missing Local Images: ${productsMissingLocalImages}`);

  if (missingList.length > 0) {
    console.log("\nSample missing products (first 10):");
    missingList.slice(0, 10).forEach(m => console.log(` - [${m.category}] ${m.slug} (${m.name})`));
  }
}

audit().catch(console.error);
