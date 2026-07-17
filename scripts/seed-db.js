const { ConvexHttpClient } = require("convex/browser");
require('dotenv').config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const categories = [
  {"name": "ألبان ومنتجاتها", "nameEn": "Dairy & Eggs", "slug": "dairy"},
  {"name": "مشروبات", "nameEn": "Beverages", "slug": "beverages"},
  {"name": "أرز ومعكرونة", "nameEn": "Rice & Pasta", "slug": "rice"},
  {"name": "زيوت وسمن", "nameEn": "Oils & Ghee", "slug": "oils"},
  {"name": "بقوليات", "nameEn": "Legumes", "slug": "legumes"},
  {"name": "صلصات وتوابل", "nameEn": "Sauces & Spices", "slug": "sauces"},
  {"name": "وجبات خفيفة", "nameEn": "Snacks", "slug": "snacks"},
  {"name": "منظفات", "nameEn": "Cleaning", "slug": "cleaning"}
];

const products = [
  {"name": "حليب جهينة كامل الدسم 1 لتر", "nameEn": "Juhayna Full Cream Milk 1L", "slug": "juhayna-full-cream-milk-1l", "price": 45, "compareAtPrice": 50, "imagePublicId": "", "imagePublicIds": [], "category": "dairy", "brand": "Juhayna", "unit": "1 Liter", "description": "حليب طازج كامل الدسم", "descriptionEn": "Fresh full cream milk", "stock": 100, "discount": 10, "rating": 4.5, "reviews": 120},
  {"name": "جبنة مثلثات بوك 8 قطع", "nameEn": "Puck Triangle Cheese 8pcs", "slug": "puck-triangle-cheese-8pcs", "price": 85, "compareAtPrice": 95, "imagePublicId": "", "imagePublicIds": [], "category": "dairy", "brand": "Puck", "unit": "8 Pieces", "description": "جبنة مثلثات كريمية", "descriptionEn": "Creamy triangle cheese", "stock": 80, "discount": 10, "rating": 4.7, "reviews": 85},
  {"name": "زبادي مراعي طبيعي 4 حبات", "nameEn": "Almarai Natural Yogurt 4pcs", "slug": "almarai-natural-yogurt-4pcs", "price": 28, "compareAtPrice": 32, "imagePublicId": "", "imagePublicIds": [], "category": "dairy", "brand": "Almarai", "unit": "4 Cups", "description": "زبادي طبيعي طازج", "descriptionEn": "Fresh natural yogurt", "stock": 150, "discount": 12, "rating": 4.6, "reviews": 200},
  {"name": "كوكاكولا 1 لتر", "nameEn": "Coca Cola 1L", "slug": "coca-cola-1l", "price": 22, "compareAtPrice": 25, "imagePublicId": "", "imagePublicIds": [], "category": "beverages", "brand": "Coca Cola", "unit": "1 Liter", "description": "مشروب غازي منعش", "descriptionEn": "Refreshing soft drink", "stock": 200, "discount": 12, "rating": 4.8, "reviews": 500},
  {"name": "بيبسي 1.5 لتر", "nameEn": "Pepsi 1.5L", "slug": "pepsi-1-5l", "price": 25, "compareAtPrice": 28, "imagePublicId": "", "imagePublicIds": [], "category": "beverages", "brand": "Pepsi", "unit": "1.5 Liter", "description": "مشروب غازي بيبسي", "descriptionEn": "Pepsi soft drink", "stock": 180, "discount": 10, "rating": 4.7, "reviews": 450},
  {"name": "ماء حياة معدني 600 مل", "nameEn": "Hayat Mineral Water 600ml", "slug": "hayat-mineral-water-600ml", "price": 5, "compareAtPrice": 6, "imagePublicId": "", "imagePublicIds": [], "category": "beverages", "brand": "Hayat", "unit": "600ml", "description": "ماء معدني طبيعي", "descriptionEn": "Natural mineral water", "stock": 500, "discount": 16, "rating": 4.9, "reviews": 1000},
  {"name": "أرز الدوحة 5 كيلو", "nameEn": "Al Doha Rice 5kg", "slug": "al-doha-rice-5kg", "price": 85, "compareAtPrice": 95, "imagePublicId": "", "imagePublicIds": [], "category": "rice", "brand": "Al Doha", "unit": "5 kg", "description": "أرز بسمتي فاخر", "descriptionEn": "Premium basmati rice", "stock": 120, "discount": 10, "rating": 4.8, "reviews": 300},
  {"name": "مكرونة ريجينا 400 جم", "nameEn": "Regina Pasta 400g", "slug": "regina-pasta-400g", "price": 18, "compareAtPrice": 22, "imagePublicId": "", "imagePublicIds": [], "category": "rice", "brand": "Regina", "unit": "400g", "description": "مكرونة إيطالية أصلية", "descriptionEn": "Authentic Italian pasta", "stock": 200, "discount": 18, "rating": 4.6, "reviews": 180},
  {"name": "زيت كريستال 1.5 لتر", "nameEn": "Cristal Oil 1.5L", "slug": "cristal-oil-1-5l", "price": 95, "compareAtPrice": 110, "imagePublicId": "", "imagePublicIds": [], "category": "oils", "brand": "Cristal", "unit": "1.5 Liter", "description": "زيت عباد نقي", "descriptionEn": "Pure sunflower oil", "stock": 100, "discount": 13, "rating": 4.7, "reviews": 250},
  {"name": "سمنة حلوب 1 كيلو", "nameEn": "Halwani Ghee 1kg", "slug": "halwani-ghee-1kg", "price": 120, "compareAtPrice": 135, "imagePublicId": "", "imagePublicIds": [], "category": "oils", "brand": "Halwani", "unit": "1 kg", "description": "سمنة بلدي نقية", "descriptionEn": "Pure traditional ghee", "stock": 80, "discount": 11, "rating": 4.9, "reviews": 150},
  {"name": "فول مدمس كنوز 400 جم", "nameEn": "Kinooz Fava Beans 400g", "slug": "kinooz-fava-beans-400g", "price": 15, "compareAtPrice": 18, "imagePublicId": "", "imagePublicIds": [], "category": "legumes", "brand": "Kinooz", "unit": "400g", "description": "فول مدمس جاهز للأكل", "descriptionEn": "Ready-to-eat fava beans", "stock": 300, "discount": 16, "rating": 4.5, "reviews": 220},
  {"name": "عدس أصفر العافية 500 جم", "nameEn": "Al Afia Yellow Lentils 500g", "slug": "al-afia-yellow-lentils-500g", "price": 22, "compareAtPrice": 25, "imagePublicId": "", "imagePublicIds": [], "category": "legumes", "brand": "Al Afia", "unit": "500g", "description": "عدس أصفر عالي الجودة", "descriptionEn": "Premium yellow lentils", "stock": 250, "discount": 12, "rating": 4.6, "reviews": 180},
  {"name": "صلصة طماطم هاينز 397 جم", "nameEn": "Heinz Tomato Ketchup 397g", "slug": "heinz-tomato-ketchup-397g", "price": 45, "compareAtPrice": 52, "imagePublicId": "", "imagePublicIds": [], "category": "sauces", "brand": "Heinz", "unit": "397g", "description": "صلصة طماطم أصلية", "descriptionEn": "Original tomato ketchup", "stock": 150, "discount": 13, "rating": 4.8, "reviews": 350},
  {"name": "مايونيز هيلمانز 400 مل", "nameEn": "Hellmann's Mayonnaise 400ml", "slug": "hellmanns-mayonnaise-400ml", "price": 55, "compareAtPrice": 62, "imagePublicId": "", "imagePublicIds": [], "category": "sauces", "brand": "Hellmann's", "unit": "400ml", "description": "مايونيز كريمي غني", "descriptionEn": "Rich creamy mayonnaise", "stock": 120, "discount": 11, "rating": 4.7, "reviews": 200},
  {"name": "شيبسي تشيبس 150 جم", "nameEn": "Chipsy Chips 150g", "slug": "chipsy-chips-150g", "price": 20, "compareAtPrice": 25, "imagePublicId": "", "imagePublicIds": [], "category": "snacks", "brand": "Chipsy", "unit": "150g", "description": "بطاطس شيبسي مقرمشة", "descriptionEn": "Crispy Chipsy chips", "stock": 200, "discount": 20, "rating": 4.6, "reviews": 400},
  {"name": "بسكويت أوريو 154 جم", "nameEn": "Oreo Biscuits 154g", "slug": "oreo-biscuits-154g", "price": 30, "compareAtPrice": 35, "imagePublicId": "", "imagePublicIds": [], "category": "snacks", "brand": "Oreo", "unit": "154g", "description": "بسكويت أوريو بالشوكولاتة", "descriptionEn": "Chocolate Oreo biscuits", "stock": 180, "discount": 14, "rating": 4.9, "reviews": 600},
  {"name": "مسحوق غسيل تايد 2.5 كيلو", "nameEn": "Tide Detergent 2.5kg", "slug": "tide-detergent-2-5kg", "price": 180, "compareAtPrice": 200, "imagePublicId": "", "imagePublicIds": [], "category": "cleaning", "brand": "Tide", "unit": "2.5 kg", "description": "مسحوق غسيل قوي", "descriptionEn": "Powerful laundry detergent", "stock": 80, "discount": 10, "rating": 4.8, "reviews": 280},
  {"name": "سائل تنظيف فيري 900 مل", "nameEn": "Fairy Dish Liquid 900ml", "slug": "fairy-dish-liquid-900ml", "price": 65, "compareAtPrice": 75, "imagePublicId": "", "imagePublicIds": [], "category": "cleaning", "brand": "Fairy", "unit": "900ml", "description": "سائل تنظيف أطباق فعال", "descriptionEn": "Effective dish washing liquid", "stock": 150, "discount": 13, "rating": 4.7, "reviews": 220}
];

async function seed() {
  console.log('Seeding categories...');
  const categoryMap = new Map();
  
  for (const cat of categories) {
    const result = await client.mutation('products:addCategory', {
      name: cat.name,
      nameEn: cat.nameEn,
      slug: cat.slug,
      active: true,
      sortOrder: 0
    });
    categoryMap.set(cat.slug, result);
    console.log(`Created category: ${cat.nameEn} (${cat.slug}) -> ${result}`);
  }

  console.log('Seeding products...');
  let count = 0;
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.category);
    if (!categoryId) {
      console.log(`Category not found for ${prod.category}`);
      continue;
    }
    
    try {
      await client.mutation('products:addProduct', {
        name: prod.name,
        nameEn: prod.nameEn,
        slug: prod.slug,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        imagePublicId: prod.imagePublicId,
        imagePublicIds: prod.imagePublicIds,
        categoryId: categoryId,
        brand: prod.brand,
        unit: prod.unit,
        description: prod.description,
        descriptionEn: prod.descriptionEn,
        stock: prod.stock,
        discount: prod.discount,
        rating: prod.rating,
        reviews: prod.reviews,
        isActive: true
      });
      console.log(`Created product: ${prod.nameEn} (${prod.slug})`);
      count++;
    } catch (e) {
      console.error(`Failed to create ${prod.nameEn}:`, e.message);
    }
  }
  
  console.log(`\nSeeded ${count} products successfully!`);
}

seed().catch(console.error);