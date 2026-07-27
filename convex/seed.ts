import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedCategories = internalMutation({
  handler: async (ctx) => {
    const categories = [
      { name: "الخضروات والفواكه الطازجة", nameEn: "Fresh Produce", slug: "produce" },
      { name: "الألبان والبيض والجبن", nameEn: "Dairy, Eggs & Cheese", slug: "dairy" },
      { name: "اللحوم والدواجن", nameEn: "Meat & Poultry", slug: "meat" },
      { name: "الأغذية المجمدة", nameEn: "Frozen Foods", slug: "frozen" },
      { name: "الأرز والمكرونة والبقوليات", nameEn: "Pantry & Grains", slug: "pantry" },
      { name: "الزيوت والسمن والصلصات", nameEn: "Oils, Ghee & Spices", slug: "condiments" },
      { name: "الوجبات الخفيفة والحلويات", nameEn: "Snacks & Sweets", slug: "snacks" },
      { name: "المشروبات والعصائر", nameEn: "Beverages & Juices", slug: "beverages" },
      { name: "المنظفات والأدوات المنزلية", nameEn: "Household & Cleaning", slug: "cleaning" },
      { name: "العناية الشخصية", nameEn: "Personal Care", slug: "personal-care" },
      { name: "منتجات الأطفال", nameEn: "Baby Care", slug: "baby-care" },
      { name: "المخبوزات والخبز", nameEn: "Bakery & Bread", slug: "bakery" }
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

export const resetAndSeedCanonical = mutation({
  args: {
    categories: v.array(v.object({
      name: v.string(),
      nameEn: v.string(),
      slug: v.string(),
    })),
    products: v.array(v.object({
      name: v.string(),
      nameEn: v.string(),
      slug: v.string(),
      price: v.number(),
      compareAtPrice: v.optional(v.number()),
      category: v.string(),
      subcategory: v.optional(v.string()),
      brand: v.optional(v.string()),
      unit: v.optional(v.string()),
      description: v.optional(v.string()),
      descriptionEn: v.optional(v.string()),
      stock: v.optional(v.number()),
      discount: v.optional(v.number()),
      rating: v.optional(v.number()),
      reviews: v.optional(v.number()),
      readinessStatus: v.optional(v.string()),
      isFulfillable: v.optional(v.boolean()),
      imagePublicId: v.optional(v.string()),
      imagePublicIds: v.optional(v.array(v.string())),
      imageSecureUrls: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    // 1. Delete all existing products
    const existingProducts = await ctx.db.query("products").collect();
    for (const p of existingProducts) {
      await ctx.db.delete(p._id);
    }

    // 2. Delete all existing categories
    const existingCategories = await ctx.db.query("categories").collect();
    for (const c of existingCategories) {
      await ctx.db.delete(c._id);
    }

    // 3. Insert canonical categories and build slug -> _id map
    const categoryMap: Record<string, any> = {};
    let catOrder = 0;
    for (const cat of args.categories) {
      const catId = await ctx.db.insert("categories", {
        name: cat.name,
        nameEn: cat.nameEn,
        slug: cat.slug,
        active: true,
        sortOrder: catOrder++,
        createdAt: Date.now(),
      });
      categoryMap[cat.slug] = catId;
    }

    // 4. Insert canonical products
    let insertedProducts = 0;
    for (const prod of args.products) {
      const catId = categoryMap[prod.category];
      if (catId) {
        await ctx.db.insert("products", {
          name: prod.name,
          nameEn: prod.nameEn,
          slug: prod.slug,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice || prod.price,
          imagePublicId: prod.imagePublicId || "",
          imagePublicIds: prod.imagePublicIds || [],
          categoryId: catId,
          subcategory: prod.subcategory || "",
          brand: prod.brand || "",
          unit: prod.unit || "",
          description: prod.description || "",
          descriptionEn: prod.descriptionEn || "",
          stock: prod.stock ?? 100,
          discount: prod.discount ?? 0,
          rating: prod.rating ?? 4.8,
          reviews: prod.reviews ?? 100,
          isActive: true,
          readinessStatus: (prod.readinessStatus as any) || "active_sellable",
          isFulfillable: prod.isFulfillable ?? true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        insertedProducts++;
      }
    }

    return {
      deletedProducts: existingProducts.length,
      deletedCategories: existingCategories.length,
      insertedCategories: args.categories.length,
      insertedProducts: insertedProducts,
    };
  },
});
