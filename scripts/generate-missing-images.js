require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { ConvexHttpClient } = require('convex/browser');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const BATCH_SIZE = 2;
const DELAY_BETWEEN_PRODUCTS = 5000;
const DELAY_BETWEEN_BATCHES = 15000;

function buildPrompt(nameEn, descriptionEn, brand, unit) {
  return `Premium ultra-realistic commercial product photo of ${brand} ${nameEn} (${descriptionEn || nameEn}, ${unit}). Clean white background, professional ecommerce studio shot, 8k quality, soft lighting, centered front view.`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function generatePollinationsImage(prompt, seed) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=2000&height=2000&nologo=true&seed=${seed}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeoutId);

      if (res.status === 429) {
        const waitTime = Math.min((attempt + 1) * 15000, 60000);
        console.log(`    Rate limited (attempt ${attempt + 1}/5), waiting ${waitTime / 1000}s...`);
        await sleep(waitTime);
        continue;
      }

      if (!res.ok) {
        const waitTime = Math.min((attempt + 1) * 10000, 45000);
        console.log(`    HTTP ${res.status} (attempt ${attempt + 1}/5), waiting ${waitTime / 1000}s...`);
        await sleep(waitTime);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 1000) {
        console.log(`    Invalid image data (attempt ${attempt + 1}/5), retrying...`);
        await sleep(5000);
        continue;
      }
      return buffer;
    } catch (e) {
      clearTimeout(timeoutId);
      const waitTime = Math.min((attempt + 1) * 10000, 45000);
      console.log(`    Error: ${e.message} (attempt ${attempt + 1}/5), waiting ${waitTime / 1000}s...`);
      await sleep(waitTime);
    }
  }
  throw new Error('Failed after 5 attempts');
}

function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: 'image',
        transformation: [
          { width: 2000, height: 2000, crop: 'limit' },
          { quality: 'auto:best' },
          { format: 'auto' },
        ],
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, secure_url: result.secure_url });
      }
    ).end(buffer);
  });
}

async function main() {
  console.log('Fetching all products from Convex...');
  const products = await convex.query('products:getAllProductsAdmin');
  console.log(`Total products: ${products.length}`);

  // Find products that need images (have public IDs but images may not exist on Cloudinary)
  const productsToProcess = products.filter(p =>
    p.imagePublicId && p.imagePublicId.length > 0
  );

  // For efficiency, randomly sample and test a few to see how many actually need regeneration
  console.log('Checking which products need image generation...');

  // Process all products - the script will skip ones that already exist on Cloudinary
  const totalToProcess = productsToProcess.length;
  console.log(`Products to process: ${totalToProcess}`);

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < productsToProcess.length; i++) {
    const product = productsToProcess[i];
    const nameEn = product.nameEn || product.name;
    const catSlug = product.categorySlug || 'grocery';
    const productSlug = product.slug;
    const descriptionEn = product.descriptionEn || '';
    const brand = product.brand || 'Generic';
    const unit = product.unit || '1 unit';

    const seedBase = Math.abs(
      productSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) || 12345;

    const publicId = `pandamarket/categories/${catSlug}/products/${productSlug}/1`;

    process.stdout.write(`[${i + 1}/${totalToProcess}] ${nameEn}... `);

    // Check if image already exists on Cloudinary
    try {
      await cloudinary.api.resource(publicId);
      console.log('exists ✓ (skip)');
      skipCount++;
      continue;
    } catch (e) {
      // Image doesn't exist, need to generate
    }

    const prompt = buildPrompt(nameEn, descriptionEn, brand, unit);
    const seed = seedBase;

    try {
      const buffer = await generatePollinationsImage(prompt, seed);
      const result = await uploadToCloudinary(buffer, publicId);
      await convex.mutation('seed:updateProductImages', {
        id: product._id,
        imagePublicId: result.public_id,
        imagePublicIds: [result.public_id],
      });
      console.log('generated ✓');
      successCount++;
    } catch (err) {
      console.log(`FAILED ✗ ${err.message}`);
      failCount++;
    }

    // Delay between products
    if (i < productsToProcess.length - 1) {
      await sleep(DELAY_BETWEEN_PRODUCTS);
    }

    // Extra delay every BATCH_SIZE products
    if ((i + 1) % BATCH_SIZE === 0 && i < productsToProcess.length - 1) {
      console.log(`  [Progress: ${successCount} generated, ${skipCount} skipped, ${failCount} failed]`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  console.log('\n=== Done ===');
  console.log(`Generated: ${successCount}`);
  console.log(`Skipped (already exist): ${skipCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total processed: ${successCount + skipCount + failCount}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
