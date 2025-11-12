// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), // ربط مع Clerk
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  orders: defineTable({
    userId: v.string(), // clerkId من المستخدم
    orderNumber: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        productDescription: v.string(),
        productCategory: v.string(),
        quantity: v.number(),
        price: v.number(),
        unitPrice: v.number(),
      })
    ),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
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
    deliveryDate: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_userId_and_status", ["userId", "status"]),

  images: defineTable({
    storageId: v.string(),
    title: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
  })
    .index("by_uploadedBy", ["uploadedBy"]),
});
