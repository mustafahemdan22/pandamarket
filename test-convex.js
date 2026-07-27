const { ConvexHttpClient } = require("convex/browser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function testQuery() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  console.log("Convex URL:", url);
  const client = new ConvexHttpClient(url);
  
  const slugs = ["produce", "meat", "dairy", "bakery", "pantry", "condiments", "snacks", "beverages", "cleaning", "personal-care", "baby-care", "frozen"];
  
  for (const slug of slugs) {
    try {
      const result = await client.query("products:getProductsByCategorySlug", { categorySlug: slug });
      console.log(`✅ ${slug}: ${result.length} products`);
    } catch (err) {
      console.error(`❌ ${slug}: ERROR - ${err.message}`);
      if (err.data) console.error(`   data:`, err.data);
    }
  }
}

testQuery().catch(console.error);
