const { ConvexHttpClient } = require('convex/browser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function checkIds() {
  const categories = await client.query('products:getCategories', {});
  let total = 0;
  const sampleIds = [];

  for (const cat of categories) {
    const products = await client.query('products:getProductsByCategorySlug', { categorySlug: cat.slug });
    total += products.length;
    products.forEach(p => {
      if (sampleIds.length < 10) {
        sampleIds.push({ slug: p.slug, imagePublicId: p.imagePublicId, imagePublicIds: p.imagePublicIds });
      }
    });
  }

  console.log(`Total Products checked across categories: ${total}`);
  console.log("Sample product imagePublicIds (first 10):");
  sampleIds.forEach(s => console.log(` - ${s.slug}: imagePublicId="${s.imagePublicId}" imagePublicIds=${JSON.stringify(s.imagePublicIds)}`));
}

checkIds();
