import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    password: v.string(),
  },
  handler: async ({ db }, args) => {
    const existing = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      throw new Error("User already exists");
    }

    const userId = await db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });

    return { success: true, userId };
  },
});
