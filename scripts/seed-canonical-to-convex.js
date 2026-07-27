const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });
const fs = require('fs');
const path = require('path');

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function runSeed() {
  console.log("=== Seeding Canonical Catalog to Live Convex Database ===");
  const catalogPath = path.join(__dirname, '..', 'canonical-catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error("canonical-catalog.json not found!");
    process.exit(1);
  }
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  console.log(`Loaded ${catalog.categories.length} categories and ${catalog.products.length} products from canonical-catalog.json.`);

  try {
    const result = await client.mutation("seed:resetAndSeedCanonical", catalog);
    console.log("\n✓ Seeding Successful!");
    console.log(`  Deleted old products: ${result.deletedProducts}`);
    console.log(`  Deleted old categories: ${result.deletedCategories}`);
    console.log(`  Inserted new categories: ${result.insertedCategories}`);
    console.log(`  Inserted new products: ${result.insertedProducts}`);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

runSeed();
