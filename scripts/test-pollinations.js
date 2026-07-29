const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function testPollinations() {
  const nameEn = "Fresh Red Tomatoes 1 kg";
  const brand = "Fresh Farm";
  const prompt = `Premium ultra-realistic commercial studio product photo of ${brand} ${nameEn}. Clean white background, professional ecommerce shot, 8k quality, centered front view.`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true`;

  console.log("Fetching AI image from Pollinations:", url);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    console.log(`Received ${buffer.length} bytes.`);

    const publicId = "pandamarket/categories/produce/products/fresh-red-tomatoes-1-kg/1";
    const uploadRes = await cloudinary.uploader.upload_stream(
      { public_id: publicId, overwrite: true, invalidate: true, resource_type: 'image' },
      (err, result) => {
        if (err) console.error("Upload Error:", err);
        else console.log("Cloudinary Upload Success:", result.secure_url);
      }
    ).end(buffer);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testPollinations();
