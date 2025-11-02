import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async ({ db }, { email, password }) => {
    const user = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    return {
      success: true,
      message: "Login successful",
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },
});
