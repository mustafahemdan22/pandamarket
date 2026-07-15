import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {
    categories: v.array(
      v.object({
        name: v.string(),
        nameEn: v.string(),
        slug: v.string(),
      })
    ),
    products: v.array(
      v.object({
        name: v.string(),
        nameEn: v.string(),
        slug: v.string(),
        price: v.number(),
        compareAtPrice: v.optional(v.number()),
        imagePublicId: v.string(),
        imagePublicIds: v.array(v.string()),
        category: v.string(), // Category slug
        brand: v.string(),
        unit: v.string(),
        description: v.optional(v.string()),
        descriptionEn: v.optional(v.string()),
        stock: v.optional(v.number()),
        discount: v.optional(v.number()),
        rating: v.optional(v.number()),
        reviews: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const categoryMap = new Map<string, any>();

    // 1. Seed Categories
    for (const cat of args.categories) {
      // Check if category already exists
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .first();

      if (existing) {
        categoryMap.set(cat.slug, existing._id);
      } else {
        const id = await ctx.db.insert("categories", {
          name: cat.name,
          nameEn: cat.nameEn,
          slug: cat.slug,
          active: true,
          createdAt: Date.now(),
        });
        categoryMap.set(cat.slug, id);
      }
    }

    // 2. Seed Products
    let count = 0;
    for (const prod of args.products) {
      // Check if product already exists by slug
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", prod.slug))
        .first();

      if (!existing) {
        const categoryId = categoryMap.get(prod.category);
        if (categoryId) {
          await ctx.db.insert("products", {
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
            rating: prod.rating || 0,
            reviews: prod.reviews || 0,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          count++;
        }
      }
    }

    return { seededProducts: count };
  },
});
