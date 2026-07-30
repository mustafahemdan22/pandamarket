import { ConvexHttpClient } from 'convex/browser';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const ALREADY_UPDATED = [
  'fresh-local-tomatoes-1kg',
  'premium-local-bananas-1kg',
  'juhayna-full-cream-milk-1l',
  'fresh-boneless-chicken-breast-1kg',
  'fresh-minced-beef-500g',
  'al-doha-egyptian-rice-5kg',
  'cristal-sunflower-oil-1-5l',
  'oreo-chocolate-biscuits-154g',
  'coca-cola-1l',
  'fresh-corn-4-ears',
  'fresh-white-eggplant-1-kg',
  'fresh-yellow-watermelon-1-piece',
  'fresh-juice-lemons-1-kg'
];

async function fetchProductsWithRetry(retries = 3): Promise<any[]> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Fetching products from Convex (attempt ${i + 1}/${retries})...`);
      return await client.query('products:getProducts' as any, { limit: 500 });
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return [];
}

async function run() {
  try {
    const products = await fetchProductsWithRetry();
    console.log(`Found ${products.length} products.`);

    const remainingProducts = products.filter((p: any) => !ALREADY_UPDATED.includes(p.slug));
    console.log(`Remaining products to update: ${remainingProducts.length}`);

    let successCount = 0;
    let failCount = 0;
    let lockId = 1;

    const queue = [...remainingProducts];
    const total = queue.length;

    // Concurrency limit
    const CONCURRENCY = 10;
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const product = queue.shift();
        if (!product) break;
        if (!product.imagePublicId) continue;

        const currentLockId = lockId++;
        const index = total - queue.length;
        console.log(`[${index}/${total}] Searching image for: ${product.nameEn}...`);
        
        try {
          const keywords = product.nameEn
            .replace(/[^a-zA-Z ]/g, '')
            .split(' ')
            .filter((w: string) => w.length > 2)
            .slice(0, 2)
            .join(',');
            
          const imageUrl = `https://loremflickr.com/500/500/${keywords}?lock=${currentLockId}`;
          
          await cloudinary.uploader.upload(imageUrl, {
            public_id: product.imagePublicId,
            resource_type: 'image',
            overwrite: true,
            invalidate: true,
          });
          
          console.log(`✅ Success: ${product.slug}`);
          successCount++;
        } catch (err: any) {
          console.error(`❌ Error for ${product.slug}:`, err.message || err);
          failCount++;
        }
      }
    });

    await Promise.all(workers);

    console.log('\n--- Script Finished ---');
    console.log(`Successfully Updated: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

run();
