require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { ConvexHttpClient } = require('convex/browser');
const cloudinary = require('cloudinary').v2;
const catalog = require('../canonical-catalog.json');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
console.log('Convex URL:', convexUrl);
const convex = new ConvexHttpClient(convexUrl);

async function generateImage(prompt, seed) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=2000&height=2000&nologo=true&seed=${seed}`;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeoutId);
      if (res.status === 429) {
        const waitTime = (attempt + 1) * 10000;
        console.log(`    Rate limited, waiting ${waitTime/1000}s before retry...`);
        await sleep(waitTime);
        continue;
      }
      if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 1000) throw new Error('Invalid image data');
      return buffer;
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError' || e.message?.includes('abort')) {
        const waitTime = (attempt + 1) * 5000;
        console.log(`    Timeout, waiting ${waitTime/1000}s before retry...`);
        await sleep(waitTime);
        continue;
      }
      if (attempt === 2) throw e;
      await sleep(5000);
    }
  }
  throw new Error('Failed after 3 attempts');
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

function buildPrompt(nameEn, descriptionEn, brand, unit, categorySlug, view) {
  const viewDescriptions = {
    1: 'Centered front-facing straight view showing the complete product packaging.',
    2: 'Forty-five degree angle view showing front and side perspective.',
    3: 'Side profile view showing package depth and label detail.',
  };
  return `A premium ultra-realistic commercial eCommerce catalog photo of a grocery product. Product: ${brand} - ${nameEn} (${descriptionEn || nameEn}, ${unit}). Clean professional supermarket catalog quality. 8k resolution, crisp focus, studio lighting, soft natural shadows, pure white background. ${viewDescriptions[view] || viewDescriptions[1]}`;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('='.repeat(60));
  console.log('STEP 1: Seeding catalog via resetAndSeedCanonical mutation');
  console.log('='.repeat(60));

  // Strip extraneous fields not in mutation args (e.g., imagePrompt)
  const sanitizedProducts = catalog.products.map(p => ({
    name: p.name,
    nameEn: p.nameEn,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    unit: p.unit,
    description: p.description,
    descriptionEn: p.descriptionEn,
    stock: p.stock,
    discount: p.discount,
    rating: p.rating,
    reviews: p.reviews,
    readinessStatus: p.readinessStatus || 'active_sellable',
    isFulfillable: p.isFulfillable !== undefined ? p.isFulfillable : true,
    imagePublicId: p.imagePublicId || '',
    imagePublicIds: p.imagePublicIds || [],
    imageSecureUrls: p.imageSecureUrls || [],
  }));
  const sanitizedCatalog = { categories: catalog.categories, products: sanitizedProducts };

  try {
    const result = await convex.mutation('seed:resetAndSeedCanonical', sanitizedCatalog);
    console.log('Seed result:', JSON.stringify(result, null, 2));
    console.log(`Inserted ${result.insertedProducts} products across ${result.insertedCategories} categories`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    if (err.data) console.error('Data:', JSON.stringify(err.data));
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('STEP 2: Fetching all products from Convex');
  console.log('='.repeat(60));

  let products;
  try {
    products = await convex.query('products:getAllProductsAdmin');
    console.log(`Total products in DB: ${products.length}`);
  } catch (err) {
    console.error('Failed to fetch products:', err.message);
    process.exit(1);
  }

  // All products need real Cloudinary images generated (they have path strings but no actual uploaded images)
  const productsNeedingImages = products;
  console.log(`Products needing images: ${productsNeedingImages.length} / ${products.length}`);

  if (productsNeedingImages.length === 0) {
    console.log('All products already have images. Done!');
    process.exit(0);
  }

  console.log('\n' + '='.repeat(60));
  console.log('STEP 3: Generating and uploading images');
  console.log('='.repeat(60));

  // Process in batches of 2 to avoid rate limits
  const BATCH_SIZE = 2;
  const IMAGES_PER_PRODUCT = 1;
  const totalBatches = Math.ceil(productsNeedingImages.length / BATCH_SIZE);
  let successCount = 0;
  let failCount = 0;

  for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
    const start = batchIdx * BATCH_SIZE;
    const batch = productsNeedingImages.slice(start, start + BATCH_SIZE);
    console.log(`\n--- Batch ${batchIdx + 1}/${totalBatches} (products ${start + 1}-${start + batch.length}) ---`);

    const promises = batch.map(async (product) => {
      const productSlug = product.slug;
      const catSlug = product.categorySlug || 'grocery';
      const nameEn = product.nameEn || product.name;
      const descriptionEn = product.descriptionEn || '';
      const brand = product.brand || 'Generic';
      const unit = product.unit || '1 unit';

      const seedBase = Math.abs(
        productSlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) || 12345;

      const imagePublicIds = [];

      for (let imgIdx = 0; imgIdx < IMAGES_PER_PRODUCT; imgIdx++) {
        const viewNum = imgIdx + 1;
        const prompt = buildPrompt(nameEn, descriptionEn, brand, unit, catSlug, viewNum);
        const seed = seedBase + imgIdx * 100;
        const publicId = `pandamarket/categories/${catSlug}/products/${productSlug}/${viewNum}`;

        try {
          console.log(`  Generating image ${viewNum}/${IMAGES_PER_PRODUCT} for ${nameEn}...`);
          const buffer = await generateImage(prompt, seed);
          const result = await uploadToCloudinary(buffer, publicId);
          console.log(`  ✓ Image ${viewNum} uploaded: ${result.public_id}`);
          imagePublicIds.push(result.public_id);
        } catch (err) {
          console.error(`  ✗ Image ${viewNum} failed: ${err.message}`);
        }

        // Small delay between images for same product
        if (imgIdx < IMAGES_PER_PRODUCT - 1) {
          await sleep(3000);
        }
      }

      if (imagePublicIds.length > 0) {
        try {
          await convex.mutation('seed:updateProductImages', {
            id: product._id,
            imagePublicId: imagePublicIds[0],
            imagePublicIds: imagePublicIds,
          });
          console.log(`  ✓ Product ${nameEn} updated with ${imagePublicIds.length} images`);
          successCount++;
        } catch (err) {
          console.error(`  ✗ Failed to update product ${nameEn}: ${err.message}`);
          failCount++;
        }
      } else {
        console.error(`  ✗ No images generated for ${nameEn}`);
        failCount++;
      }
    });

    await Promise.all(promises);
    console.log(`  Batch complete. Running total: ${successCount} success, ${failCount} failed`);

    // Delay between batches
    if (batchIdx < totalBatches - 1) {
      console.log('  Waiting 8 seconds before next batch...');
      await sleep(8000);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('STEP 4: Verification');
  console.log('='.repeat(60));

  try {
    const finalProducts = await convex.query('products:getAllProductsAdmin');
    const withImages = finalProducts.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0);
    const withoutImages = finalProducts.filter(p => !p.imagePublicIds || p.imagePublicIds.length === 0 || p.imagePublicIds.every(id => !id));

    console.log(`Total products: ${finalProducts.length}`);
    console.log(`With images: ${withImages.length}`);
    console.log(`Without images: ${withoutImages.length}`);

    if (withoutImages.length > 0) {
      console.log('\nProducts needing images:');
      for (const p of withoutImages) {
        console.log(`  - ${p.nameEn} (${p.slug})`);
      }
    }

    console.log('\n=== DONE ===');
  } catch (err) {
    console.error('Verification failed:', err.message);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
