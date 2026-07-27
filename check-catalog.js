const { ConvexHttpClient } = require("convex/browser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function check() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const client = new ConvexHttpClient(url);
  try {
    const categories = await client.query("products:getCategories", {});
    console.log(`Found ${categories.length} categories in Convex:`);
    for (const cat of categories) {
      const prods = await client.query("products:getProductsByCategorySlug", { categorySlug: cat.slug });
      console.log(`- Category: [${cat.name} / ${cat.nameEn}] (slug: '${cat.slug}', id: ${cat._id}) -> ${prods.length} products found`);
      if (prods.length === 0) {
        console.log(`  WARNING: 0 products found for slug '${cat.slug}'!`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
check();
