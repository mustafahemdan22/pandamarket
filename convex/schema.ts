import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  images: defineTable({
    storageId: v.string(),
    title: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }),

  // 🛒 جدول المنتجات (محسّن)
  products: defineTable({
    name: v.string(),
    nameEn: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    image: v.string(),
    images: v.optional(v.array(v.string())), // ✅ صور متعددة
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
    createdAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_brand", ["brand"]),

  // ⭐ جدول المراجعات
  reviews: defineTable({
    productId: v.id("products"), // ✅ Reference للمنتج
    userId: v.string(),
    userName: v.string(),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    helpful: v.number(),
    verified: v.boolean(),
    createdAt: v.optional(v.number()),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"]),

  // 📦 جدول الطلبات
  orders: defineTable({
    orderNumber: v.string(),
    userId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    total: v.number(),
    subtotal: v.number(),
    deliveryFee: v.number(),
    discount: v.optional(v.number()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    deliveryDate: v.optional(v.string()),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    customerInfo: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    paymentMethod: v.string(),
    trackingNumber: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"])
    .index("by_user", ["userId"]),

  // 🎫 جدول الكوبونات
  coupons: defineTable({
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("fixed")),
    value: v.number(),
    minPurchase: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    usageCount: v.number(),
    active: v.boolean(),
    createdAt: v.optional(v.number()),
  }).index("by_code", ["code"]),

  // ❤️ جدول المفضلة
  wishlist: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    createdAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  // 🛒 جدول السلة (اختياري - لو عايز sync بين الأجهزة)
  cart: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
});
