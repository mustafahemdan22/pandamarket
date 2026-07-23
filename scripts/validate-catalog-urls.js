const https = require('https');
const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr';

function checkUrlHttp(urlStr, retries = 1) {
  return new Promise((resolve) => {
    https.get(urlStr, async (res) => {
      if (res.statusCode === 500 && retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        const retryCode = await checkUrlHttp(urlStr, retries - 1);
        resolve(retryCode);
      } else {
        resolve(res.statusCode || 500);
      }
    }).on('error', () => {
      resolve(500);
    });
  });
}

async function validateAllCatalogImages() {
  console.log("=================================================");
  console.log("    FINAL PRODUCTION CLOUDINARY CATALOG AUDIT    ");
  console.log("=================================================");

  try {
    const products = await client.query("products:getProducts", { limit: 100 });
    console.log(`\nTotal Products Queried from Convex DB: ${products.length}\n`);

    let totalImagesChecked = 0;
    let successful200s = 0;
    let failedUrls = 0;
    const brokenReferences = [];

    for (const p of products) {
      const mainPublicId = p.imagePublicId;
      const allPublicIds = p.imagePublicIds || [mainPublicId];

      console.log(`Product: "${p.nameEn}" (Slug: ${p.slug})`);
      console.log(`  - Primary Public ID: ${mainPublicId}`);

      for (let i = 0; i < allPublicIds.length; i++) {
        const id = allPublicIds[i];
        totalImagesChecked++;

        // Construct Cloudinary URL with transformations
        const url = `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,q_auto/${id}.jpg`;
        const statusCode = await checkUrlHttp(url);

        if (statusCode >= 200 && statusCode < 400) {
          successful200s++;
        } else {
          failedUrls++;
          brokenReferences.push({
            product: p.nameEn,
            publicId: id,
            url,
            statusCode
          });
          console.error(`  ✗ [HTTP ${statusCode}] Failed: ${url}`);
        }
      }
    }

    console.log("\n=================================================");
    console.log("          FINAL MIGRATION VALIDATION             ");
    console.log("=================================================");
    console.log(`Total Products Verified        : ${products.length}`);
    console.log(`Total Cloudinary Assets Tested : ${totalImagesChecked}`);
    console.log(`HTTP 200 OK Successes          : ${successful200s}`);
    console.log(`HTTP Failures / Broken Links   : ${failedUrls}`);

    if (failedUrls === 0 && successful200s > 0) {
      console.log("\nSUCCESS: 100% of product images are being served from Cloudinary with HTTP 200 OK!");
    } else {
      console.error("\nFAILURES DETECTED in Cloudinary asset delivery!");
      console.error(JSON.stringify(brokenReferences, null, 2));
    }

  } catch (err) {
    console.error("Validation error:", err);
  }
}

validateAllCatalogImages();
