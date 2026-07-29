const { ConvexHttpClient } = require('convex/browser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function testSingle() {
  try {
    const products = await convex.query('products:getProductsByCategorySlug', { categorySlug: 'produce' });
    console.log("Sample product ID:", products[0]._id);
    const result = await convex.mutation('updateImages:updateImagesBatch', {
      updates: [
        {
          id: products[0]._id,
          imagePublicId: "pandamarket/categories/produce/products/fresh-corn-4-ears/1",
          imagePublicIds: ["pandamarket/categories/produce/products/fresh-corn-4-ears/1"]
        }
      ]
    });
    console.log("Result:", result);
  } catch (e) {
    console.error("Error details:", e);
    if (e.data) console.error("Error data:", e.data);
  }
}

testSingle();
