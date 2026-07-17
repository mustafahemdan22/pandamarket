require('dotenv').config({ path: '.env.local' });
const { ConvexHttpClient } = require('convex/browser');

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function generateAllImages() {
  console.log('Fetching all products...');
  const products = await convex.query('products:getAllProductsAdmin');
  
  const productsWithoutImages = products.filter(p => !p.imagePublicIds || p.imagePublicIds.length === 0);
  console.log(`Found ${productsWithoutImages.length} products without images out of ${products.length} total`);
  
  for (let i = 0; i < productsWithoutImages.length; i++) {
    const product = productsWithoutImages[i];
    console.log(`\n[${i + 1}/${productsWithoutImages.length}] Generating images for: ${product.nameEn} (${product.slug})`);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL || 'https://sincere-cormorant-681.convex.site'}/api/ai/generate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          categorySlug: product.categorySlug,
          productSlug: product.slug,
          nameEn: product.nameEn,
          descriptionEn: product.descriptionEn || '',
          brand: product.brand,
          unit: product.unit,
          count: 4
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`  ✓ Success: Generated ${data.publicIds?.length || 0} images`);
        console.log(`  Public IDs: ${data.publicIds?.join(', ') || 'none'}`);
      } else {
        console.error(`  ✗ Failed: ${data.error || 'Unknown error'}`);
      }
      
      // Small delay to avoid rate limits
      if (i < productsWithoutImages.length - 1) {
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }
  
  console.log('\n=== Generation Complete ===');
  const finalProducts = await convex.query('products:getAllProductsAdmin');
  const withImages = finalProducts.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0);
  console.log(`Products with images: ${withImages.length}/${finalProducts.length}`);
  
  for (const p of withImages) {
    console.log(`  - ${p.nameEn}: ${p.imagePublicIds.length} images`);
  }
}

generateAllImages().catch(console.error);