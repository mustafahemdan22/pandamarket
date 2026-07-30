import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary environment variables in .env.local');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const TARGET_DIR = path.join(PUBLIC_DIR, 'pandamarket');

// Recursively get all files in a directory
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return arrayOfFiles;
  }
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadToCloudinary(filePath: string, publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

async function runMigration() {
  console.log(`Scanning for images in ${TARGET_DIR}...`);
  const files = getAllFiles(TARGET_DIR);
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} images to upload.`);

  let successCount = 0;
  let failCount = 0;

  for (const filePath of imageFiles) {
    // Relative path to public directory
    const relativePath = path.relative(PUBLIC_DIR, filePath);
    // Replace backslashes with forward slashes for URLs/Public IDs
    let publicId = relativePath.replace(/\\/g, '/');
    // Remove extension
    const ext = path.extname(publicId);
    publicId = publicId.substring(0, publicId.length - ext.length);

    console.log(`Uploading: ${publicId}...`);
    try {
      await uploadToCloudinary(filePath, publicId);
      successCount++;
      console.log(`✅ Success: ${publicId}`);
    } catch (err: any) {
      console.error(`❌ Failed: ${publicId}`, err.message || err);
      failCount++;
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`Total Images Found: ${imageFiles.length}`);
  console.log(`Successfully Uploaded: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

runMigration().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
