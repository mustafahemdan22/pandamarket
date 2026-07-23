const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function runCheck() {
  console.log("Fetching products...");
  try {
    const products = await client.query("products:getProducts", {});
    console.log("Total products fetched via API:", products.length);
    if (products.length > 0) {
      console.log("First product imagePublicId:", products[0].imagePublicId);
    }
  } catch (error) {
    console.error("Query failed:", error);
  }
}

runCheck();
