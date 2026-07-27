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

async function generatePollinationsImage(prompt, seed) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=2000&height=2000&nologo=true&seed=${seed}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeoutId);
    if (res.status === 429) {
      throw new Error('RATE_LIMITED');
    }
    if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) throw new Error('Invalid image data');
    return buffer;
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
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

function buildPrompt(nameEn, descriptionEn, brand, unit) {
  return `Premium ultra-realistic commercial product photo of ${brand} ${nameEn} (${descriptionEn || nameEn}, ${unit}). Clean white background, professional ecommerce studio shot, 8k quality, soft lighting, centered front view.`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Fetching all products from Convex...');
  const products = await convex.query('products:getAllProductsAdmin');
  console.log(`Total products: ${products.length}`);

  // Regenerate images for all products (seed had path strings but no actual Cloudinary images)
  const productsToProcess = products;
  console.log(`Products needing image generation: ${productsToProcess.length}`);

  if (productsToProcess.length === 0) {
    console.log('All products already have valid Cloudinary images. Done!');
    return;
  }

  let successCount = 0;
  let failCount = 0;

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
    const prompt = buildPrompt(nameEn, descriptionEn, brand, unit);
    const seed = seedBase;

    process.stdout.write(`[${i + 1}/${productsToProcess.length}] ${nameEn}... `);

    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        const buffer = await generatePollinationsImage(prompt, seed);
        const result = await uploadToCloudinary(buffer, publicId);
        await convex.mutation('seed:updateProductImages', {
          id: product._id,
          imagePublicId: result.public_id,
          imagePublicIds: [result.public_id],
        });
        console.log(`✓`);
        successCount++;
        success = true;
      } catch (err) {
        retries--;
        if (err.message === 'RATE_LIMITED') {
          const waitTime = (4 - retries) * 5000;
          console.log(`(rate limited, waiting ${waitTime / 1000}s...`);
          await sleep(waitTime);
        } else {
          console.log(`✗ ${err.message}`);
          if (retries > 0) {
            console.log(`  Retrying... (${retries} left)`);
            await sleep(3000);
          } else {
            failCount++;
            success = true; // Skip after retries exhausted
          }
        }
      }
    }

    // Wait between products to avoid rate limiting
    if (i < productsToProcess.length - 1) {
      await sleep(4000);
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);

  // Verify from Convex
  const finalProducts = await convex.query('products:getAllProductsAdmin');
  const withImages = finalProducts.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0);
  console.log(`\nConvex records - Products with images: ${withImages.length}/${finalProducts.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
