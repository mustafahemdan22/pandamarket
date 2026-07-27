require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { ConvexHttpClient } = require('convex/browser');
const catalog = require('../canonical-catalog.json');

async function seed() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  console.log('URL:', url);
  const client = new ConvexHttpClient(url);

  console.log('Categories:', catalog.categories.length);
  console.log('Products:', catalog.products.length);

  const result = await client.mutation('seed:resetAndSeedCanonical', catalog);
  console.log('Result:', JSON.stringify(result, null, 2));

  const products = await client.query('products:getAllProductsAdmin');
  console.log('Total products after seed:', products.length);
}

seed().catch(err => { console.error(err); process.exit(1); });
