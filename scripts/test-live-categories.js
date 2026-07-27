const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function runAudit() {
  console.log("=== Auditing Live Convex Database ===");
  try {
    const categories = await client.query("products:getCategories", {});
    console.log(`\nTotal Categories in DB: ${categories.length}`);
    for (const cat of categories) {
      const prods = await client.query("products:getProductsByCategorySlug", { categorySlug: cat.slug });
      console.log(`  [${cat.slug}] ${cat.nameEn} (${cat.name}) -> ${prods.length} products`);
      if (prods.length > 0) {
        prods.forEach(p => {
          console.log(`    - ${p.slug} | img: ${p.imagePublicId}`);
        });
      }
    }
  } catch (err) {
    console.error("Audit failed:", err);
  }
}

runAudit();
