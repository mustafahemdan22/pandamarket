const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function testUpload() {
  const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const publicId = "pandamarket/categories/produce/products/fresh-corn-4-ears/1";

  try {
    const res = await cloudinary.uploader.upload(dummyBase64, {
      public_id: publicId,
      overwrite: true,
      invalidate: true
    });
    console.log("Upload Success!");
    console.log("public_id:", res.public_id);
    console.log("secure_url:", res.secure_url);
    console.log("format:", res.format);
  } catch (err) {
    console.error("Upload Error:", err);
  }
}

testUpload();
