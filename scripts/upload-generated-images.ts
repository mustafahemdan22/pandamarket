import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: 'd:/next-react/pandamarket/.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const imagesToUpload = [
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/tomatoes_1kg_1785411833822.png',
    publicId: 'pandamarket/categories/produce/products/fresh-local-tomatoes-1kg/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/bananas_1kg_1785411843426.png',
    publicId: 'pandamarket/categories/produce/products/premium-local-bananas-1kg/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/juhayna_milk_1l_1785411854047.png',
    publicId: 'pandamarket/categories/dairy/products/juhayna-full-cream-milk-1l/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/chicken_breast_1kg_1785411864321.png',
    publicId: 'pandamarket/categories/meat/products/fresh-boneless-chicken-breast-1kg/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/minced_beef_500g_1785411873500.png',
    publicId: 'pandamarket/categories/meat/products/fresh-minced-beef-500g/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/doha_rice_5kg_1785411883080.png',
    publicId: 'pandamarket/categories/pantry/products/al-doha-egyptian-rice-5kg/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/cristal_oil_1_5l_1785411890982.png',
    publicId: 'pandamarket/categories/condiments/products/cristal-sunflower-oil-1-5l/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/oreo_154g_1785411902852.png',
    publicId: 'pandamarket/categories/snacks/products/oreo-chocolate-biscuits-154g/1'
  },
  {
    path: 'C:/Users/GRREN TEC/.gemini/antigravity-ide/brain/ce50ee5c-3024-4ca3-8348-dc296ed01716/coca_cola_1l_1785411913446.png',
    publicId: 'pandamarket/categories/beverages/products/coca-cola-1l/1'
  }
];

async function run() {
  for (const img of imagesToUpload) {
    try {
      console.log(`Uploading ${img.publicId}...`);
      await cloudinary.uploader.upload(img.path, {
        public_id: img.publicId,
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
      });
      console.log(`✅ Success`);
    } catch (err) {
      console.error(`❌ Failed`, err);
    }
  }
}

run();
