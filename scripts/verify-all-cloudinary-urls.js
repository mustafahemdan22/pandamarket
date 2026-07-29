const https = require('https');
const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr';

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ statusCode: res.statusCode, contentType: res.headers['content-type'] });
    }).on('error', (e) => resolve({ statusCode: 500, error: e.message }));
  });
}

async function verify() {
  console.log("==================================================");
  console.log("        VERIFYING CLOUDINARY PRODUCT IMAGES       ");
  console.log("==================================================");

  const categories = await client.query('products:getCategories', {});
  let successCount = 0;
  let failCount = 0;

  for (const cat of categories) {
    const products = await client.query('products:getProductsByCategorySlug', { categorySlug: cat.slug, limit: 3 });
    for (const prod of products) {
      const publicId = `pandamarket/categories/${cat.slug}/products/${prod.slug}/1`;
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,q_auto,f_auto/${publicId}`;

      const res = await checkUrl(url);
      if (res.statusCode === 200) {
        successCount++;
        console.log(`  ✓ HTTP 200 OK [${cat.slug}] ${prod.slug} -> ${res.contentType}`);
      } else {
        failCount++;
        console.error(`  ✗ HTTP ${res.statusCode} FAIL [${cat.slug}] ${prod.slug}`);
      }
    }
  }

  console.log("\n==================================================");
  console.log(`Validation Results: ${successCount} PASSED (HTTP 200), ${failCount} FAILED`);
  console.log("==================================================");
}

verify().catch(console.error);
