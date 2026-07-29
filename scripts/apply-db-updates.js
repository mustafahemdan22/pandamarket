const { ConvexHttpClient } = require('convex/browser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function main() {
  console.log("==================================================");
  console.log("     APPLYING CLOUDINARY PUBLIC IDS TO CONVEX DB   ");
  console.log("==================================================");

  const categories = await convex.query('products:getCategories', {});
  console.log(`Retrieved ${categories.length} categories.`);

  let totalProducts = 0;
  const updates = [];

  for (const cat of categories) {
    const products = await convex.query('products:getProductsByCategorySlug', { categorySlug: cat.slug });
    totalProducts += products.length;

    for (const prod of products) {
      const publicId = `pandamarket/categories/${cat.slug}/products/${prod.slug}/1`;
      updates.push({
        id: prod._id,
        imagePublicId: publicId,
        imagePublicIds: [publicId]
      });
    }
  }

  console.log(`Prepared Cloudinary DB updates for ${updates.length} products.`);

  const BATCH_SIZE = 25;
  let updatedTotal = 0;

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);
    try {
      const count = await convex.mutation('updateImages:updateImagesBatch', { updates: batch });
      updatedTotal += count;
      console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(updates.length / BATCH_SIZE)}: updated ${count} products`);
    } catch (err) {
      console.error(`  ✗ Batch update error: ${err.message}`);
    }
  }

  console.log("\n==================================================");
  console.log(`  SUCCESS! Updated ${updatedTotal}/${updates.length} products in Convex.`);
  console.log("==================================================");
}

main().catch(console.error);
