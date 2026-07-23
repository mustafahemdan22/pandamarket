const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function fixKinooz() {
  const dir = path.join(__dirname, '..', 'public', 'pandamarket', 'categories', 'pantry', 'products', 'kinooz-fava-beans-400g');
  for (const img of ['1.webp', '2.webp']) {
    const file = path.join(dir, img);
    const publicId = `pandamarket/categories/pantry/products/kinooz-fava-beans-400g/${path.parse(img).name}`;
    console.log(`Re-uploading ${img} -> ${publicId}...`);
    try {
      const res = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        overwrite: true,
        invalidate: true
      });
      console.log(`Success: ${res.secure_url}`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }
}

fixKinooz();
