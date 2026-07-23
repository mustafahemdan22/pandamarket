require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function checkUsage() {
  try {
    const result = await cloudinary.api.usage();
    console.log('Usage:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Usage Error:', error);
  }
}

checkUsage();
