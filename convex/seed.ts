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
