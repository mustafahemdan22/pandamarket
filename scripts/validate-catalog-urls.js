const fs = require('fs');
const path = require('path');
const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function validateImages() {
  console.log("=== Image Validation Report ===");
  try {
    const products = await client.query("products:getProducts", { limit: 100 });
    console.log(`Total Products in Database: ${products.length}\n`);

    let successCount = 0;
    let missingCount = 0;

    for (const p of products) {
      if (p.imagePublicId.startsWith('/')) {
        const ext = p.imagePublicId.endsWith('.webp') ? '' : '.webp';
        const localPath = path.join(__dirname, '..', 'public', p.imagePublicId + ext);
        if (fs.existsSync(localPath)) {
          successCount++;
        } else {
          console.error(`[404 NOT FOUND] ${p.name} - ${p.imagePublicId}`);
          missingCount++;
        }
        
        // Also check arrays
        if (p.imagePublicIds) {
          for (const imgId of p.imagePublicIds) {
            const arrExt = imgId.endsWith('.webp') ? '' : '.webp';
            const arrLocalPath = path.join(__dirname, '..', 'public', imgId + arrExt);
            if (!fs.existsSync(arrLocalPath)) {
              console.error(`[404 NOT FOUND in Array] ${p.name} - ${imgId}`);
            }
          }
        }
      } else {
        console.warn(`[WARNING] Product uses external URL: ${p.imagePublicId}`);
      }
    }

    console.log(`\n=== Final Report ===`);
    console.log(`Products Validated: ${products.length}`);
    console.log(`Successful Image Links: ${successCount}`);
    console.log(`Failed Image Links: ${missingCount}`);
    
    if (missingCount === 0 && successCount > 0) {
      console.log(`SUCCESS: Zero incorrect or missing product images!`);
    }

  } catch (error) {
    console.error("Validation failed:", error);
  }
}

validateImages();
