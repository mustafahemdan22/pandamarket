require('dotenv').config({ path: '.env.local' });
const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OUTPUT_DIR = path.join(__dirname, '..', 'generated-images');
const REPORT_FILE = path.join(__dirname, '..', 'generation-report.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const CATEGORY_PROMPTS = {
  dairy: {
    base: `Premium Egyptian supermarket dairy product photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft diffused studio lighting with subtle natural shadow. Professional food photography quality. Clean minimalist packaging, matte or semi-gloss finish. No text artifacts, no watermarks, no logo distortions. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front-facing straight-on view of dairy product package. Clean carton, bottle, or tub design with subtle brand color accents. Show realistic condensation droplets for chilled products. Professional retail packaging photography.`,
    angle: `45-degree three-quarter angle view showing front label and side profile. Dairy package dimensionality visible. Soft highlight on edges. Commercial e-commerce angle shot.`,
    side: `Side profile view showing package depth and nutritional label area. Clean barcode zone. Realistic packaging thickness.`,
    back: `Rear view showing ingredient list and nutrition facts panel area. Clean regulatory label layout. Professional back-of-pack photography.`,
    detail: `Extreme close-up macro of packaging material texture. Paperboard fiber, plastic cap threads, foil seal detail, or condensation droplets. Premium material quality showcase.`,
  },

  beverages: {
    base: `Premium Egyptian supermarket beverage photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional drink photography. Realistic condensation, liquid visibility through transparent sections. Clean label design, no copyrighted artwork. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front-facing view of beverage bottle or can. Clear liquid visible through transparent areas showing realistic color (cola amber, juice orange, water clear). Condensation droplets on cold surface. Professional label facing camera.`,
    angle: `45-degree angle showing bottle curvature and label wrap-around. Liquid catch light. Three-dimensional bottle form. Commercial angle shot.`,
    side: `Side profile showing bottle silhouette, neck, and cap. Liquid level visible. Clean side label or embossed branding area.`,
    back: `Rear view showing nutrition label and ingredient panel on bottle. Barcode area. Clean regulatory information layout.`,
    detail: `Macro close-up of condensation droplets, cap threads, tamper seal, or liquid meniscus. Premium packaging detail.`,
  },

  oils: {
    base: `Premium Egyptian supermarket cooking oil photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional liquid product photography. Golden/amber liquid visible in transparent bottle. Clean label design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front-facing view of oil bottle (PET or glass). Golden liquid visible with light refraction. Clear label area. Tamper-evident cap. Professional front label presentation.`,
    angle: `45-degree angle showing bottle shoulder, neck, and liquid color. Label wrap-around visible. Light catching liquid transparency.`,
    side: `Side profile showing full bottle silhouette, handle (if applicable), and liquid level. Embossed measurement marks visible.`,
    back: `Rear view showing nutrition facts, ingredient list, and usage instructions. Barcode placement. Clean back label.`,
    detail: `Macro of oil viscosity - slow pour simulation frozen in time, or cap seal detail, or golden liquid texture close-up.`,
  },

  rice: {
    base: `Premium Egyptian supermarket rice/grain photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional dry goods photography. Transparent or windowed bag showing premium long-grain rice. Clean packaging design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of premium rice bag (5kg/10kg). Clear window showing individual rice grains. Brand color accents. Weight badge. Clean typography layout.`,
    angle: `45-degree angle showing bag volume and side gusset. Window transparency showing grain quality. Three-dimensional bag form.`,
    side: `Side profile showing bag thickness, side seal, and nutritional panel. Standing pouch stability.`,
    back: `Rear view showing cooking instructions, origin info, and barcode. Clean regulatory layout.`,
    detail: `Macro close-up of individual rice grains through window - grain length, translucency, premium quality. Or bag material texture.`,
  },

  pasta: {
    base: `Premium Egyptian supermarket pasta photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional dry goods photography. Box or bag with window showing premium pasta shapes. Clean packaging. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of pasta box or bag. Die-cut window showing pasta shapes (penne, spaghetti, fusilli). Golden durum wheat color visible. Brand design.`,
    angle: `45-degree angle showing box depth or bag volume. Window transparency. Three-dimensional package form.`,
    side: `Side profile showing nutrition panel, cooking time, and barcode. Box flap or bag seal detail.`,
    back: `Rear view with recipe suggestion, cooking instructions, and ingredient list. Clean layout.`,
    detail: `Macro of pasta texture through window - surface ridges, bronze die-cut texture, golden semolina color.`,
  },

  legumes: {
    base: `Premium Egyptian supermarket legumes/pulses photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional dry goods photography. Clear bag or box window showing premium beans/lentils. Clean packaging. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of legume package. Window showing whole beans/lentils - uniform size, rich color (red lentils, white beans, brown chickpeas). Weight and variety badge.`,
    angle: `45-degree angle showing package volume. Window clarity showing product quality. Three-dimensional form.`,
    side: `Side profile showing seal, nutrition panel, soaking/cooking instructions.`,
    back: `Rear view with preparation guide, origin, barcode. Clean regulatory layout.`,
    detail: `Macro of individual legumes - skin texture, hilum detail, color uniformity. Premium grade showcase.`,
  },

  sauces: {
    base: `Premium Egyptian supermarket sauce/condiment photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional jar/bottle photography. Viscous product visible in glass jar or squeeze bottle. Clean label design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of sauce jar or bottle. Rich product color visible (tomato red, mayo white, mustard yellow). Clean label facing camera. Tamper seal on cap.`,
    angle: `45-degree angle showing jar shoulder/bottle curve and label wrap. Product viscosity suggested by light catch. Three-dimensional form.`,
    side: `Side profile showing fill level, ingredient panel, barcode. Jar threads or bottle profile.`,
    back: `Rear view with nutrition facts, allergens, storage instructions. Clean back label.`,
    detail: `Macro of product texture - tomato sauce viscosity, mayo creaminess, or cap seal detail. Premium texture showcase.`,
  },

  snacks: {
    base: `Premium Egyptian supermarket snacks photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional snack packaging photography. Metallic/foil bag with window or illustrated product. Clean design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of snack bag (chips, biscuits, nuts). Metallic foil finish with matte accents. Window showing product (chips in stack, biscuits in row, whole nuts). Flavor badge.`,
    angle: `45-degree angle showing bag volume and gusseted bottom. Foil reflectivity. Three-dimensional pillow bag form.`,
    side: `Side profile showing seal, nutrition panel, barcode, flavor callout. Bag thickness.`,
    back: `Rear view with ingredients, allergens, promotional area. Clean layout.`,
    detail: `Macro of product through window - chip ridges, biscuit layers, nut skin texture. Or foil material close-up.`,
  },

  canned: {
    base: `Premium Egyptian supermarket canned food photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional tin can photography. Cylindrical metal can with lithographed label. Clean design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of standard food can (400g/800g). Full wrap label facing camera. Easy-open tab or ring pull visible. Brand and variety clear.`,
    angle: `45-degree angle showing can curvature and label wrap. Top lid detail with easy-open mechanism. Three-dimensional cylinder.`,
    side: `Side profile showing can height, seam line, and label continuity. Barcode on side.`,
    back: `Rear view (rotated) showing nutrition panel, ingredients, and batch code area. Clean regulatory layout.`,
    detail: `Macro of can lid - easy-open ring, score line, hermetic seal detail. Or label print texture.`,
  },

  frozen: {
    base: `Premium Egyptian supermarket frozen food photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional frozen packaging photography. Cardboard box or poly bag with frost/ice crystal accents. Product visible through window. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of frozen food box/bag. Window showing product (fries, vegetables, chicken pieces). Frost pattern on package edges. "Frozen Fresh" badge.`,
    angle: `45-degree angle showing package volume. Window clarity. Frost texture on edges. Three-dimensional form.`,
    side: `Side profile showing cooking instructions (oven/air fryer), nutrition, barcode. Box flap tuck or bag seal.`,
    back: `Rear view with detailed cooking methods, ingredients, storage temp (-18°C). Clean layout.`,
    detail: `Macro of ice crystal texture on package, or individual frozen piece detail (fry cross-section, vegetable IQF separation).`,
  },

  'personal-care': {
    base: `Premium Egyptian supermarket personal care photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional beauty/care product photography. Bottles, tubes, jars with premium finishes (matte, gloss, soft-touch). Clean label design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of shampoo bottle, body wash, toothpaste tube, or soap bar. Pump/dispenser detail. Label facing camera. Volume badge (400ml, 100ml).`,
    angle: `45-degree angle showing bottle curve, pump mechanism, or tube cap. Label wrap. Three-dimensional form with premium highlights.`,
    side: `Side profile showing ingredient list, usage instructions, barcode. Bottle silhouette or tube crimp.`,
    back: `Rear view with full ingredient deck, warnings, manufacturer info. Clean regulatory layout.`,
    detail: `Macro of dispenser pump mechanism, tube nozzle, cap threads, or product texture (gel viscosity, cream richness).`,
  },

  cleaning: {
    base: `Premium Egyptian supermarket cleaning/household photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional household product photography. Spray bottles, jugs, trigger sprayers with ergonomic design. Clean functional labeling. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of trigger spray bottle, detergent jug, or dish liquid bottle. Clear liquid visible with color tint (blue, green, yellow). Trigger/sprayer detail. Volume (1L, 500ml, 2.5kg).`,
    angle: `45-degree angle showing bottle ergonomics, handle (on jugs), trigger mechanism. Label wrap. Three-dimensional form.`,
    side: `Side profile showing measurement marks (on jugs), usage directions, barcode. Bottle silhouette.`,
    back: `Rear view with safety warnings, ingredients, dilution ratios, barcode. Clean regulatory layout.`,
    detail: `Macro of trigger sprayer mechanism, cap seal, pour spout, or liquid meniscus in transparent section.`,
  },

  fruits: {
    base: `Premium Egyptian supermarket fresh fruit photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft natural studio lighting with subtle shadow. Professional produce photography. Whole fresh fruits with natural skin texture, bloom, stem/leaf details. No packaging - loose premium produce. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of premium fruit (apple, orange, banana bunch, mango). Natural skin texture - wax bloom on apples, pore detail on oranges, curvature on bananas. Stem and calyx intact.`,
    angle: `45-degree angle showing fruit three-dimensionality. Natural highlight on curve. Multiple fruit arrangement for bunch items.`,
    side: `Side profile showing fruit shape profile, stem attachment, natural asymmetry.`,
    back: `Rear view (rotated) showing calyx/stem area, natural skin variation, any leaf remnants.`,
    detail: `Extreme macro of skin texture - apple lenticels, orange oil glands, banana skin ridges, mango blush gradient. Premium freshness indicator.`,
  },

  vegetables: {
    base: `Premium Egyptian supermarket fresh vegetable photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft natural studio lighting with subtle shadow. Professional produce photography. Whole fresh vegetables with crisp texture, vibrant color, root/stem details. No packaging - loose premium produce. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of premium vegetable (tomato vine, cucumber, onion, pepper). Natural skin sheen - tomato gloss, cucumber ridges, onion papery skin, pepper smoothness. Stem/calyx intact.`,
    angle: `45-degree angle showing vegetable form and texture. Natural highlights on curves. Vine tomatoes on truss arrangement.`,
    side: `Side profile showing vegetable silhouette, stem/root attachment, natural proportions.`,
    back: `Rear view showing blossom end, stem scar, natural color variation.`,
    detail: `Extreme macro of surface texture - tomato skin cells, cucumber spines/trichomes, onion skin layers, pepper wax bloom. Freshness showcase.`,
  },

  meat: {
    base: `Premium Egyptian supermarket fresh meat photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle shadow. Professional butcher photography. Raw meat cuts with natural marbling, fresh color (bright cherry red for beef, pink for lamb), natural fat cap. On white butcher paper or tray. No packaging graphics. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of premium meat cut (ribeye, tenderloin, lamb chops, minced). Natural marbling visible. Fresh oxygenated color. Butcher paper wrap or absorbent pad tray.`,
    angle: `45-degree angle showing cut thickness, marbling distribution, fat cap. Three-dimensional cut profile.`,
    side: `Side profile showing cut height, bone-in detail (if applicable), fat layer.`,
    back: `Rear view showing opposite side marbling, bone cross-section, or mince texture.`,
    detail: `Macro of muscle fiber grain, intramuscular fat marbling, fat-meat interface. Freshness and grade indicator.`,
  },

  poultry: {
    base: `Premium Egyptian supermarket fresh poultry photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle shadow. Professional butcher photography. Raw chicken pieces or whole bird with natural skin texture, pale pink flesh. On white tray with absorbent pad. No packaging graphics. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of chicken pieces (breast, thigh, drumstick, whole). Natural skin pores visible. Pale pink flesh through skin. Tray presentation.`,
    angle: `45-degree angle showing piece thickness, skin contour, joint articulation. Three-dimensional form.`,
    side: `Side profile showing piece profile, bone structure (bone-in), skin coverage.`,
    back: `Rear view showing back of piece, bone cross-section, skin texture.`,
    detail: `Macro of skin pore texture, muscle fiber direction, bone marrow exposure (bone-in). Freshness indicator.`,
  },

  seafood: {
    base: `Premium Egyptian supermarket fresh seafood photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle shadow. Professional fishmonger photography. Whole fish or fillets with natural slime layer, clear eyes (whole), vibrant gills, firm flesh. On crushed ice or white tray. No packaging graphics. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
    front: `Front view of whole fish (sea bass, tilapia, salmon fillet). Clear bright eyes, red gills, intact scales. Natural slime sheen. Ice bed presentation.`,
    angle: `45-degree angle showing body profile, lateral line, fin detail. Three-dimensional form on ice.`,
    side: `Side profile showing fish thickness, head profile, tail. Fillet cross-section showing flesh layers.`,
    back: `Rear view showing dorsal fin, scale pattern, tail fork.`,
    detail: `Macro of scale texture, eye clarity, gill filament color, flesh flake structure. Ultimate freshness showcase.`,
  },
};

const DEFAULT_PROMPT = {
  base: `Premium Egyptian supermarket product photography. Ultra-realistic commercial catalog shot. Pure white seamless background (#FFFFFF), soft studio lighting with subtle natural shadow. Professional packaging photography. Clean minimalist design. 8K resolution, sharp focus, photorealistic. Product isolated, centered composition.`,
  front: `Front-facing straight-on view showing full package design.`,
  angle: `45-degree three-quarter angle view showing front and side profile.`,
  side: `Side profile view showing package depth.`,
  back: `Rear view showing back label details.`,
  detail: `Macro close-up of packaging material texture and premium details.`,
};

function getCategoryKey(categorySlug) {
  const mapping = {
    'dairy': 'dairy',
    'beverages': 'beverages',
    'oils': 'oils',
    'rice': 'rice',
    'pasta': 'pasta',
    'legumes': 'legumes',
    'sauces': 'sauces',
    'snacks': 'snacks',
    'canned': 'canned',
    'frozen': 'frozen',
    'personal-care': 'personal-care',
    'cleaning': 'cleaning',
    'fruits': 'fruits',
    'vegetables': 'vegetables',
    'meat': 'meat',
    'poultry': 'poultry',
    'seafood': 'seafood',
  };
  return mapping[categorySlug] || 'default';
}

function buildPromptForView(viewName, nameEn, descriptionEn, brand, unit, categorySlug) {
  const catKey = getCategoryKey(categorySlug);
  const prompts = CATEGORY_PROMPTS[catKey] || DEFAULT_PROMPT;
  
  const base = prompts.base;
  const viewPrompt = prompts[viewName] || prompts.front;
  
  const productInfo = `${brand} ${nameEn} (${descriptionEn || nameEn}, ${unit})`;
  
  const negativePrompt = `No text, no logos, no watermarks, no barcodes, no QR codes, no branding, no copyrighted artwork, no real brand names, no trademark symbols, no nutritional labels with real text, blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, watermark, signature, text, title, username, error, glitch, noise, grain, lowres, jpeg artifacts, oversaturated, undersaturated, harsh shadows, blown highlights, cluttered background, colored background, reflection of studio equipment`;
  
  return `${base} ${viewPrompt} Product: ${productInfo}. Original generic packaging design only. ${negativePrompt}`;
}

async function generateImageBuffer(prompt, seed) {
  if (REPLICATE_API_TOKEN) {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "05359a647d7a691e704177d611ee6bde4e7b419a5c4d0a3d460dec6987f2fa8a",
          input: {
            prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 90,
          }
        })
      });

      if (response.ok) {
        let prediction = await response.json();
        const predictionId = prediction.id;
        let status = prediction.status;
        let attempts = 0;
        
        while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled' && attempts < 30) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` }
          });
          if (pollResponse.ok) {
            prediction = await pollResponse.json();
            status = prediction.status;
          }
          attempts++;
        }

        if (status === 'succeeded') {
          const imageUrl = prediction.output[0];
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) {
            return Buffer.from(await imgRes.arrayBuffer());
          }
        }
      }
    } catch (e) {
      console.error("  Replicate failed, trying next provider:", e.message);
    }
  }

  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const b64Data = data.data[0].b64_json;
        return Buffer.from(b64Data, 'base64');
      }
    } catch (e) {
      console.error("  OpenAI failed, trying next provider:", e.message);
    }
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=2000&height=2000&nologo=true&seed=${seed}&enhance=true`;
  console.log(`  Using Pollinations AI (Flux)...`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  const res = await fetch(pollinationsUrl, { 
    signal: controller.signal,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  clearTimeout(timeoutId);
  
  console.log(`  Pollinations response: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`  Pollinations error: ${errorText.substring(0, 200)}`);
    throw new Error(`AI generation failed (Pollinations: ${res.status} ${res.statusText})`);
  }
  
  const buffer = Buffer.from(await res.arrayBuffer());
  console.log(`  Image size: ${buffer.length} bytes`);
  if (buffer.length < 1000) {
    const text = buffer.toString('utf8').substring(0, 200);
    console.error(`  Invalid image data: ${text}`);
    throw new Error('AI generation failed - invalid image data');
  }
  return buffer;
}

async function generateImagesForProduct(product) {
  const views = ['front', 'angle', 'side', 'detail'];
  const publicIds = [];
  const localFiles = [];
  
  const seedBase = Math.abs(
    product.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) || 12345;

  const catKey = getCategoryKey(product.categorySlug);
  console.log(`  Category prompt: ${catKey}`);

  for (let i = 0; i < views.length; i++) {
    const view = views[i];
    const prompt = buildPromptForView(view, product.nameEn, product.descriptionEn || '', product.brand, product.unit, product.categorySlug);
    const seed = seedBase + i * 100;
    
    console.log(`  [${i+1}/4] Generating ${view} view (${catKey})...`);
    const buffer = await generateImageBuffer(prompt, seed);
    
    const publicId = `pandamarket/categories/${product.categorySlug}/products/${product.slug}/${i + 1}`;
    const folder = `pandamarket/categories/${product.categorySlug}/products/${product.slug}`;
    
    const categoryDir = path.join(OUTPUT_DIR, product.categorySlug, product.slug);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const localFileName = `${i + 1}.webp`;
    const localFilePath = path.join(categoryDir, localFileName);
    fs.writeFileSync(localFilePath, buffer);
    
    publicIds.push(publicId);
    localFiles.push({
      publicId,
      localPath: localFilePath,
      view,
      size: buffer.length
    });
    
    console.log(`  ✓ Saved locally: ${localFilePath} (${buffer.length} bytes)`);
    console.log(`  Cloudinary Public ID: ${publicId}`);
  }
  
  return { publicIds, localFiles };
}

async function generateAllImages() {
  console.log('=== Bulk AI Image Generation for Product Catalog ===\n');
  console.log('Fetching all products from Convex...');
  
  const products = await convex.query('products:getAllProductsAdmin');
  console.log(`Found ${products.length} total products`);
  
  const productsWithoutImages = products.filter(p => !p.imagePublicIds || p.imagePublicIds.length === 0);
  console.log(`Products needing images: ${productsWithoutImages.length}\n`);
  
  const report = {
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    productsNeedingImages: productsWithoutImages.length,
    results: [],
    summary: { success: 0, failed: 0 }
  };
  
  for (let i = 0; i < productsWithoutImages.length; i++) {
    const product = productsWithoutImages[i];
    console.log(`\n[${i + 1}/${productsWithoutImages.length}] Processing: ${product.nameEn}`);
    console.log(`  Category: ${product.categorySlug} | Slug: ${product.slug}`);
    
    try {
      const { publicIds, localFiles } = await generateImagesForProduct(product);
      
      console.log(`  Updating Convex database...`);
      await convex.mutation('products:updateProduct', {
        id: product._id,
        imagePublicId: publicIds[0],
        imagePublicIds: publicIds,
      });
      
      const result = {
        productId: product._id,
        productName: product.nameEn,
        slug: product.slug,
        category: product.categorySlug,
        status: 'success',
        publicIds,
        localFiles,
        imageCount: publicIds.length
      };
      
      report.results.push(result);
      report.summary.success++;
      
      console.log(`  ✓ SUCCESS: ${product.nameEn} - ${publicIds.length} images generated`);
      console.log(`  Convex updated with public IDs`);
      
    } catch (error) {
      const result = {
        productId: product._id,
        productName: product.nameEn,
        slug: product.slug,
        category: product.categorySlug,
        status: 'failed',
        error: error.message,
        publicIds: [],
        localFiles: [],
        imageCount: 0
      };
      
      report.results.push(result);
      report.summary.failed++;
      
      console.error(`  ✗ FAILED: ${product.nameEn} - ${error.message}`);
    }
    
    if (i < productsWithoutImages.length - 1) {
      console.log(`  Waiting 3s before next product...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  
  console.log('\n=== GENERATION COMPLETE ===');
  console.log(`Successful: ${report.summary.success}`);
  console.log(`Failed: ${report.summary.failed}`);
  console.log(`\nReport saved to: ${REPORT_FILE}`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
  console.log(`\nFolder structure matches Cloudinary:`);
  console.log(`  pandamarket/categories/{category}/products/{slug}/{1-4}.webp`);
  
  console.log('\n=== NEXT STEPS ===');
  console.log('1. Upload generated images to Cloudinary using the exact public IDs shown');
  console.log('2. Cloudinary folder structure: pandamarket/categories/{category}/products/{slug}/');
  console.log('3. Each product has 4 images: 1 (front), 2 (angle), 3 (side), 4 (detail)');
  console.log('4. Convex database already updated with public IDs');
  console.log('5. Use Cloudinary CLI or web UI for bulk upload:');
  console.log(`   cloudinary upload "${OUTPUT_DIR}/**/*.webp" --folder=pandamarket --use-filename=true --unique-filename=false`);
  
  const finalProducts = await convex.query('products:getAllProductsAdmin');
  const withImages = finalProducts.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0);
  console.log(`\nTotal products with images in Convex: ${withImages.length}/${finalProducts.length}`);
  
  for (const p of withImages) {
    console.log(`  - ${p.nameEn}: ${p.imagePublicIds.length} images`);
    for (const pid of p.imagePublicIds) {
      console.log(`    ${pid}`);
    }
  }
}

generateAllImages().catch(console.error);