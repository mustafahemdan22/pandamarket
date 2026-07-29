const { ConvexHttpClient } = require("convex/browser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function inspectProducts() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  console.log("Convex URL:", url);
  const client = new ConvexHttpClient(url);

  // We can query products for produce or bakery
  try {
    const products = await client.query("products:getProductsByCategorySlug", { categorySlug: "produce" });
    console.log(`Found ${products.length} products in 'produce'`);
    if (products.length > 0) {
      console.log("Sample product 0:", JSON.stringify(products[0], null, 2));
    }
  } catch (err) {
    console.error("Error querying produce:", err);
  }

  try {
    const allProducts = await client.query("products:getProducts", {});
    console.log(`Total products returned by getProducts: ${allProducts ? allProducts.length : 'none'}`);
    if (allProducts && allProducts.length > 0) {
      console.log("First 5 products imagePublicIds:");
      allProducts.slice(0, 5).forEach((p, idx) => {
        console.log(`[${idx}] ${p.nameEn || p.name}: imagePublicId="${p.imagePublicId}", imagePublicIds=${JSON.stringify(p.imagePublicIds)}, image="${p.image}"`);
      });
    }
  } catch (err) {
    console.error("Error querying getProducts:", err);
  }
}

inspectProducts();
