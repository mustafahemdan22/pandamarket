const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');
const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function uploadAllImages() {
  console.log("==========================================");
  console.log("      CLOUDINARY FULL CATALOG MIGRATION   ");
  console.log("==========================================");

  const localCategoriesDir = path.join(__dirname, '..', 'public', 'pandamarket', 'categories');
  
  if (!fs.existsSync(localCategoriesDir)) {
    console.error("Local categories directory not found at:", localCategoriesDir);
    return;
  }

  let totalDiscovered = 0;
  let successUploads = 0;
  let failedUploads = 0;
  const folderTree = new Set();
  const uploadedPublicIds = [];
  const uploadErrors = [];

  // Traverse public/pandamarket/categories/{cat}/products/{prod}/{file}
  const categories = fs.readdirSync(localCategoriesDir);

  for (const cat of categories) {
    const catDir = path.join(localCategoriesDir, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    
    const productsDir = path.join(catDir, 'products');
    if (!fs.existsSync(productsDir) || !fs.statSync(productsDir).isDirectory()) continue;

    const products = fs.readdirSync(productsDir);
    for (const prodSlug of products) {
      const prodDir = path.join(productsDir, prodSlug);
      if (!fs.statSync(prodDir).isDirectory()) continue;

      const files = fs.readdirSync(prodDir).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
      
      for (const file of files) {
        totalDiscovered++;
        const indexStr = path.parse(file).name; // e.g. '1', '2', '3'
        const localFilePath = path.join(prodDir, file);
        
        // Target Cloudinary Public ID structure
        const publicId = `pandamarket/categories/${cat}/products/${prodSlug}/${indexStr}`;
        folderTree.add(`pandamarket/categories/${cat}/products/${prodSlug}`);

        console.log(`[Uploading ${totalDiscovered}] ${cat}/${prodSlug}/${file} -> ${publicId}`);

        try {
          const result = await cloudinary.uploader.upload(localFilePath, {
            public_id: publicId,
            overwrite: true,
            invalidate: true,
            resource_type: 'image'
          });

          successUploads++;
          uploadedPublicIds.push({
            publicId: result.public_id,
            url: result.secure_url,
            format: result.format,
            bytes: result.bytes
          });
          console.log(`  ✓ Success: ${result.secure_url}`);
        } catch (err) {
          failedUploads++;
          uploadErrors.push({
            file: localFilePath,
            publicId,
            error: err.message
          });
          console.error(`  ✗ Failed: ${err.message}`);
        }
      }
    }
  }

  console.log("\n==========================================");
  console.log("           UPLOAD SUMMARY REPORT          ");
  console.log("==========================================");
  console.log(`Total Local Images Discovered : ${totalDiscovered}`);
  console.log(`Successful Cloudinary Uploads : ${successUploads}`);
  console.log(`Failed Uploads                : ${failedUploads}`);
  console.log(`Unique Product Folders Created: ${folderTree.size}`);

  if (failedUploads > 0) {
    console.error("\nSTOPPING MIGRATION: Upload failures encountered!");
    console.error(JSON.stringify(uploadErrors, null, 2));
    process.exit(1);
  }

  console.log("\nAll images successfully uploaded to Cloudinary!");
  console.log("Proceeding to HTTP URL validation...");

  // Validate HTTP 200 for uploaded Cloudinary URLs
  let http200Count = 0;
  let httpFailCount = 0;

  for (const item of uploadedPublicIds) {
    const isOk = await checkUrlHttp200(item.url);
    if (isOk) {
      http200Count++;
    } else {
      httpFailCount++;
      console.error(`[HTTP FAIL] Could not reach URL: ${item.url}`);
    }
  }

  console.log(`HTTP Validation Results: ${http200Count}/${uploadedPublicIds.length} URLs returned HTTP 200 OK.`);

  if (httpFailCount > 0) {
    console.error("\nSTOPPING MIGRATION: HTTP validation failed for some uploaded URLs.");
    process.exit(1);
  }

  console.log("\nAll Cloudinary URLs verified HTTP 200 OK!");
  console.log("Updating Convex Database records...");

  // Execute convex mutation to strip leading slashes from products
  try {
    const updateCount = await client.mutation("updatePathsToCloudinary:stripLocalPrefix");
    console.log(`Database Migration Complete: Updated ${updateCount} products in Convex to use Cloudinary Public IDs.`);
  } catch (err) {
    console.error("Database update failed:", err.message);
    process.exit(1);
  }

  console.log("\nMigration completed with 100% success!");
}

function checkUrlHttp200(urlStr) {
  return new Promise((resolve) => {
    https.get(urlStr, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

uploadAllImages();
