import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./auth";

// ===== CATEGORIES =====

export const getCategories = query({
  handler: async (ctx) => {
    const cats = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
    return cats.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },
});

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();
    return categories[0] || null;
  },
});

export const getCategoryById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addCategory = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    imagePublicId: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "categories");
    const id = await ctx.db.insert("categories", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    imagePublicId: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "categories");
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "categories");
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// ===== PRODUCTS =====

export const addProduct = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    slug: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    imagePublicId: v.string(),
    imagePublicIds: v.array(v.string()),
    categoryId: v.id("categories"),
    brand: v.string(),
    unit: v.string(),
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    stock: v.optional(v.number()),
    discount: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "products");
    const id = await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const getProducts = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    brand: v.optional(v.string()),
    searchTerm: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    inStock: v.optional(v.boolean()),
    onSale: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    sortBy: v.optional(v.union(
      v.literal("newest"),
      v.literal("price_asc"),
      v.literal("price_desc"),
      v.literal("rating"),
      v.literal("discount"),
      v.literal("popular")
    )),
  },
  handler: async (ctx, args) => {
    let queryBuilder = ctx.db.query("products").withIndex("by_active", (q) => q.eq("isActive", true));

    if (args.categoryId) {
      queryBuilder = queryBuilder.filter((q) => q.eq(q.field("categoryId"), args.categoryId!));
    }
    if (args.brand) {
      queryBuilder = queryBuilder.filter((q) => q.eq(q.field("brand"), args.brand!));
    }
    if (args.inStock) {
      queryBuilder = queryBuilder.filter((q) =>
        q.or(q.eq(q.field("stock"), undefined), q.gt(q.field("stock"), 0))
      );
    }
    if (args.onSale) {
      queryBuilder = queryBuilder.filter((q) =>
        q.and(q.neq(q.field("discount"), undefined), q.gt(q.field("discount"), 0))
      );
    }
    if (args.minPrice !== undefined) {
      queryBuilder = queryBuilder.filter((q) => q.gte(q.field("price"), args.minPrice!));
    }
    if (args.maxPrice !== undefined) {
      queryBuilder = queryBuilder.filter((q) => q.lte(q.field("price"), args.maxPrice!));
    }
    const sortBy = args.sortBy || "newest";

    // In Convex, order() returns an OrderedQuery which doesn't support filter() or limit().
    // So we apply order() at the very end when collecting, and perform rating/discount filters first.
    if (sortBy === "rating") {
      queryBuilder = queryBuilder.filter((q) => q.gt(q.field("rating"), 0));
    } else if (sortBy === "discount") {
      queryBuilder = queryBuilder.filter((q) =>
        q.and(q.neq(q.field("discount"), undefined), q.gt(q.field("discount"), 0))
      );
    }

    let products = await queryBuilder.order("desc").collect();

    // Apply search filter in memory since Convex filters don't support substrings (contains)
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.nameEn.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.descriptionEn?.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower)
      );
    }

    // Sort in-memory for price or other fields where needed
    if (sortBy === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "discount") {
      products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    const limit = args.limit || 20;

    if (args.cursor) {
      const cursorIndex = products.findIndex((p) => p._id.toString() === args.cursor);
      if (cursorIndex !== -1) {
        products = products.slice(cursorIndex + 1);
      }
    }

    return products.slice(0, limit);
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();
    return products[0] || null;
  },
});

export const getProductsByCategory = query({
  args: { categoryId: v.id("categories"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 20);
  },
});

export const getProductsByBrand = query({
  args: { brand: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_brand", (q) => q.eq("brand", args.brand))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 20);
  },
});

export const searchProducts = query({
  args: { searchTerm: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const searchLower = args.searchTerm.toLowerCase();
    const allProducts = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.nameEn.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.descriptionEn?.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower)
      )
      .slice(0, args.limit || 20);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    slug: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    imagePublicId: v.optional(v.string()),
    imagePublicIds: v.optional(v.array(v.string())),
    categoryId: v.optional(v.id("categories")),
    brand: v.optional(v.string()),
    unit: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    stock: v.optional(v.number()),
    discount: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "products");
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return id;
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "products");
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const updateStock = mutation({
  args: {
    id: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "products");
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    const newStock = (product.stock || 0) + args.quantity;
    await ctx.db.patch(args.id, { stock: Math.max(0, newStock), updatedAt: Date.now() });
    return newStock;
  },
});

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
      updatedAt: Date.now(),
    });

    return averageRating;
  },
});

export const getDiscountedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_discount", (q) => q.gt("discount", 0))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 20);
    return products;
  },
});

export const getTopRatedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_rating", (q) => q.gt("rating", 0))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 10);
    return products;
  },
});

export const getNewestProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 20);
  },
});

export const getFeaturedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.or(
        q.gt(q.field("rating"), 4),
        q.and(q.neq(q.field("discount"), undefined), q.gt(q.field("discount"), 15))
      ))
      .order("desc")
      .take(args.limit || 8);
  },
});

export const getProductsByPriceRange = query({
  args: {
    minPrice: v.number(),
    maxPrice: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.gte(q.field("price"), args.minPrice))
      .filter((q) => q.lte(q.field("price"), args.maxPrice))
      .order("asc")
      .take(args.limit || 20);
    return products;
  },
});

export const getAvailableProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.or(q.eq(q.field("stock"), undefined), q.gt(q.field("stock"), 0)))
      .order("desc")
      .take(args.limit || 20);
  },
});

export const getRelatedProducts = query({
  args: {
    productId: v.id("products"),
    categoryId: v.id("categories"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.neq(q.field("_id"), args.productId)
        )
      )
      .order("desc")
      .take(args.limit || 4);
  },
});

export const getAllProductsAdmin = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").order("desc").collect();
    const productsWithCategory = [];
    for (const product of products) {
      const category = await ctx.db.get(product.categoryId);
      productsWithCategory.push({
        ...product,
        categorySlug: category?.slug || "",
        categoryName: category?.nameEn || "",
      });
    }
    return productsWithCategory;
  },
});

export const getAllCategoriesAdmin = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});