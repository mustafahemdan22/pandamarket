const { ConvexHttpClient } = require("convex/browser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function test() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  console.log("Convex URL:", url);
  const client = new ConvexHttpClient(url);
  try {
    const res = await client.query("products:getProductsByCategorySlug", { categorySlug: "produce" });
    console.log("Success! Found products:", res.length);
    if (res.length > 0) {
      console.log("First product sample:", JSON.stringify(res[0], null, 2));
    }
  } catch (err) {
    console.error("Error executing query:", err);
  }
}
test();
