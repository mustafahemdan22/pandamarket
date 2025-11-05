import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ✅ إضافة منتج جديد
export const addProduct = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    category: v.string(),
    image: v.string(),
    stock: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

// ✅ جلب كل المنتجات
export const getProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});
