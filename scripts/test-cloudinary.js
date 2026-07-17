require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log('Cloudinary Config:');
console.log('  Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
console.log('  API Key:', process.env.CLOUDINARY_API_KEY);
console.log('  API Secret:', process.env.CLOUDINARY_API_SECRET ? '[SET]' : '[MISSING]');

const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

async function testUpload() {
  try {
    console.log('\nTesting upload...');
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id: 'test/pandamarket-test',
          folder: 'pandamarket/test',
          resource_type: 'image',
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(testBuffer);
    });
    console.log('Upload successful!');
    console.log('  Public ID:', result.public_id);
    console.log('  URL:', result.secure_url);
  } catch (error) {
    console.error('Upload failed:', error.message);
    console.error('Full error:', error);
  }
}

testUpload();