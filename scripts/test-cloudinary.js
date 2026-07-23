require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testAuth() {
  console.log('Testing Cloudinary Credentials:');
  console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret length:', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 0);

  try {
    const result = await cloudinary.api.ping();
    console.log('Ping Result:', result);
    
    // Also try to list folders to check admin API permissions
    const folders = await cloudinary.api.root_folders();
    console.log('Successfully connected to Cloudinary and fetched folders!');
  } catch (error) {
    console.error('Cloudinary API Error:', error);
  }
}

testAuth();