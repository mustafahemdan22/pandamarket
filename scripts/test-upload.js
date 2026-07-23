const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function testUpload() {
  console.log("=== Testing Cloudinary Upload ===");
  console.log(`Using Cloud Name: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  console.log(`Using API Key: ${process.env.CLOUDINARY_API_KEY}`);
  
  // Create a dummy text file to upload as raw, or base64 image
  const dummyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  
  try {
    console.log("Uploading dummy image...");
    const result = await cloudinary.uploader.upload(dummyImage, {
      public_id: 'pandamarket/test/dummy-image',
      overwrite: true,
    });
    
    console.log("Upload Success!");
    console.log(`Public ID: ${result.public_id}`);
    console.log(`Secure URL: ${result.secure_url}`);
    return true;
  } catch (error) {
    console.error("\nUpload Failed!");
    console.error(`Error Code: ${error.http_code}`);
    console.error(`Message: ${error.message}`);
    return false;
  }
}

testUpload();
