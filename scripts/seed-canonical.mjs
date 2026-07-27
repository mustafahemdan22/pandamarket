import 'dotenv/config';
import { ConvexHttpClient } from "convex/browser";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const catalog = require('../canonical-catalog.json');

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

console.log("Seeding canonical catalog...");
console.log(`Categories: ${catalog.categories.length}`);
console.log(`Products: ${catalog.products.length}`);

try {
  const result = await client.mutation("seed:resetAndSeedCanonical", catalog);
  console.log("Result:", JSON.stringify(result, null, 2));
} catch (err) {
  console.error("Error:", err.message);
  if (err.data) console.error("Data:", JSON.stringify(err.data));
  process.exit(1);
}

const products = await client.query("products:getAllProductsAdmin");
console.log(`\nVerification: ${products.length} products in DB`);
