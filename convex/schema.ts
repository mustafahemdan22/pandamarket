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

  // 🛒 جدول المنتجات
  products: defineTable({
    name: v.string(),
    price: v.number(),
    image: v.string(), // هنا ممكن نحط لينك أو storageId
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  }),
});
