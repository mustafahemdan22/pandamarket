require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

console.log('Testing Cloudinary REST API...');
console.log('Cloud Name:', CLOUD_NAME);
console.log('API Key:', API_KEY);

const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

function generateSignature(params, secret) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  const hash = crypto.createHash('sha1').update(sorted + secret).digest('hex');
  return hash;
}

async function testRestUpload() {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    public_id: 'test/pandamarket-rest-test',
    folder: 'pandamarket/test',
    timestamp: timestamp.toString(),
    api_key: API_KEY,
  };
  
  const signature = generateSignature(params, API_SECRET);
  params.signature = signature;
  
  const formData = new FormData();
  formData.append('file', new Blob([testBuffer]), 'test.png');
  Object.entries(params).forEach(([k, v]) => formData.append(k, v));
  
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await res.json();
    console.log('Response status:', res.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testRestUpload();