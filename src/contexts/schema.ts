import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    storageId: v.string(),
    title: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
    createdAt: v.optional(v.number()), // ✅ رقم بدل string
  }),

  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.optional(v.number()), // ✅ خليها نفس النظام
  }),
});
