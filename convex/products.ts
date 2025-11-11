import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ✅ إضافة منتج جديد
export const addProduct = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    image: v.string(),
    images: v.optional(v.array(v.string())),
    category: v.string(),
    brand: v.string(),
    unit: v.string(),
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    stock: v.optional(v.number()),
    discount: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
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

// ✅ جلب منتج بالـ ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ✅ جلب منتجات حسب الفئة
export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

// ✅ جلب منتجات حسب العلامة التجارية
export const getProductsByBrand = query({
  args: { brand: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_brand", (q) => q.eq("brand", args.brand))
      .order("desc")
      .collect();
  },
});

// ✅ البحث في المنتجات
export const searchProducts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    
    const searchLower = args.searchTerm.toLowerCase();
    
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.nameEn.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.descriptionEn?.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  },
});

// ✅ تحديث منتج
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    image: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    brand: v.optional(v.string()),
    unit: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    stock: v.optional(v.number()),
    discount: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// ✅ حذف منتج
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// ✅ تحديث المخزون
export const updateStock = mutation({
  args: {
    id: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    const newStock = (product.stock || 0) + args.quantity;
    
    await ctx.db.patch(args.id, {
      stock: Math.max(0, newStock),
    });

    return newStock;
  },
});

// ✅ تحديث التقييم
export const updateRating = mutation({
  args: {
    id: v.id("products"),
    newRating: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    const currentRating = product.rating || 0;
    const currentReviews = product.reviews || 0;

    const totalRating = currentRating * currentReviews + args.newRating;
    const newReviewsCount = currentReviews + 1;
    const averageRating = totalRating / newReviewsCount;

    await ctx.db.patch(args.id, {
      rating: Math.round(averageRating * 10) / 10,
      reviews: newReviewsCount,
    });

    return averageRating;
  },
});

// ✅ جلب منتجات مع خصم
export const getDiscountedProducts = query({
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    
    return allProducts.filter(
      (product) => product.discount && product.discount > 0
    );
  },
});

// ✅ جلب أفضل المنتجات تقييماً
export const getTopRatedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    
    const sorted = allProducts
      .filter((p) => p.rating && p.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return sorted.slice(0, args.limit || 10);
  },
});

// ✅ جلب منتجات حسب السعر
export const getProductsByPriceRange = query({
  args: {
    minPrice: v.number(),
    maxPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    
    return allProducts.filter(
      (product) =>
        product.price >= args.minPrice && product.price <= args.maxPrice
    );
  },
});

// ✅ جلب المنتجات المتوفرة فقط
export const getAvailableProducts = query({
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    
    return allProducts.filter(
      (product) => !product.stock || product.stock > 0
    );
  },
});
