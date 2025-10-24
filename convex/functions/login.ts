import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async ({ db }, { email, password }) => {
    // البحث عن المستخدم بالإيميل
    const user = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // التحقق من كلمة المرور (بما إنك مش عامل تشفير حاليًا)
    if (user.password !== password) {
      throw new Error("Invalid password");
    }

    // لو كله تمام
    return {
      success: true,
      message: "Login successful",
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },
});
