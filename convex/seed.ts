import { internalMutation } from "./_generated/server";

export const seedCategories = internalMutation({
  handler: async (ctx) => {
    const categories = [
      {"name": "الألبان والبيض", "nameEn": "Dairy & Eggs", "slug": "dairy"},
      {"name": "المشروبات", "nameEn": "Beverages", "slug": "beverages"},
      {"name": "الخضروات والفواكه الطازجة", "nameEn": "Fresh Produce", "slug": "produce"},
      {"name": "المخبوزات والخبز", "nameEn": "Bakery & Bread", "slug": "bakery"},
      {"name": "الأرز والمكرونة والبقوليات", "nameEn": "Pantry & Grains", "slug": "pantry"},
      {"name": "الزيوت والصلصات والتوابل", "nameEn": "Oils, Sauces & Spices", "slug": "condiments"},
      {"name": "الوجبات الخفيفة والحلويات", "nameEn": "Snacks & Sweets", "slug": "snacks"},
      {"name": "العناية والمنظفات المنزلية", "nameEn": "Household & Cleaning", "slug": "cleaning"}
    ];
    let inserted = 0;
    for (const cat of categories) {
      const exists = await ctx.db.query("categories").withIndex("by_slug", q => q.eq("slug", cat.slug)).first();
      if (!exists) {
        await ctx.db.insert("categories", {
          name: cat.name,
          nameEn: cat.nameEn,
          slug: cat.slug,
          active: true,
          sortOrder: inserted,
          createdAt: Date.now()
        });
        inserted++;
      }
    }
    return inserted;
  }
});

export const seedProducts = internalMutation({
  handler: async (ctx) => {
    const products = [
      {
        "name": "حليب جهينة كامل الدسم 1 لتر",
        "nameEn": "Juhayna Full Cream Milk 1L",
        "slug": "juhayna-full-cream-milk-1l",
        "price": 45,
        "compareAtPrice": 50,
        "category": "dairy",
        "brand": "Juhayna",
        "unit": "1 Liter",
        "description": "حليب طازج كامل الدسم",
        "descriptionEn": "Fresh full cream milk",
        "stock": 100,
        "discount": 10,
        "rating": 4.5,
        "reviews": 120
      },
      {
        "name": "كوكاكولا 1 لتر",
        "nameEn": "Coca Cola 1L",
        "slug": "coca-cola-1l",
        "price": 22,
        "compareAtPrice": 25,
        "category": "beverages",
        "brand": "Coca Cola",
        "unit": "1 Liter",
        "description": "مشروب غازي منعش",
        "descriptionEn": "Refreshing soft drink",
        "stock": 200,
        "discount": 12,
        "rating": 4.8,
        "reviews": 500
      },
      {
        "name": "أرز الدوحة 5 كيلو",
        "nameEn": "Al Doha Rice 5kg",
        "slug": "al-doha-rice-5kg",
        "price": 85,
        "compareAtPrice": 95,
        "category": "pantry",
        "brand": "Al Doha",
        "unit": "5 kg",
        "description": "أرز بسمتي فاخر",
        "descriptionEn": "Premium basmati rice",
        "stock": 120,
        "discount": 10,
        "rating": 4.8,
        "reviews": 300
      },
      {
        "name": "زيت كريستال 1.5 لتر",
        "nameEn": "Cristal Oil 1.5L",
        "slug": "cristal-oil-1-5l",
        "price": 95,
        "compareAtPrice": 110,
        "category": "condiments",
        "brand": "Cristal",
        "unit": "1.5 Liter",
        "description": "زيت عباد نقي",
        "descriptionEn": "Pure sunflower oil",
        "stock": 100,
        "discount": 13,
        "rating": 4.7,
        "reviews": 250
      },
      {
        "name": "بسكويت أوريو 154 جم",
        "nameEn": "Oreo Biscuits 154g",
        "slug": "oreo-biscuits-154g",
        "price": 30,
        "compareAtPrice": 35,
        "category": "snacks",
        "brand": "Oreo",
        "unit": "154g",
        "description": "بسكويت أوريو بالشوكولاتة",
        "descriptionEn": "Chocolate Oreo biscuits",
        "stock": 180,
        "discount": 14,
        "rating": 4.9,
        "reviews": 600
      },
      {
        "name": "سائل تنظيف فيري 900 مل",
        "nameEn": "Fairy Dish Liquid 900ml",
        "slug": "fairy-dish-liquid-900ml",
        "price": 65,
        "compareAtPrice": 75,
        "category": "cleaning",
        "brand": "Fairy",
        "unit": "900ml",
        "description": "سائل تنظيف أطباق فعال",
        "descriptionEn": "Effective dish washing liquid",
        "stock": 150,
        "discount": 13,
        "rating": 4.7,
        "reviews": 220
      }
    ];

    let inserted = 0;
    for (const prod of products) {
      const exists = await ctx.db.query("products").withIndex("by_slug", q => q.eq("slug", prod.slug)).first();
      if (!exists) {
        const category = await ctx.db.query("categories").withIndex("by_slug", q => q.eq("slug", prod.category)).first();
        if (category) {
          await ctx.db.insert("products", {
            name: prod.name,
            nameEn: prod.nameEn,
            slug: prod.slug,
            price: prod.price,
            compareAtPrice: prod.compareAtPrice,
            imagePublicId: "",
            imagePublicIds: [],
            categoryId: category._id,
            brand: prod.brand,
            unit: prod.unit,
            description: prod.description,
            descriptionEn: prod.descriptionEn,
            stock: prod.stock,
            discount: prod.discount,
            rating: prod.rating,
            reviews: prod.reviews,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          inserted++;
        }
      }
    }
    return inserted;
  }
});
