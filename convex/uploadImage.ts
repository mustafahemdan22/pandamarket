import { mutation } from "../convex/_generated/server";
import { v } from "convex/values";

export const uploadImage = mutation({
  args: {
    storageId: v.string(),
    title: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const imageId = await ctx.db.insert("images", { // ✅ "images" موجود دلوقتي
      storageId: args.storageId,
      title: args.title ?? "",
      uploadedBy: args.uploadedBy ?? "",
      createdAt: Date.now(),
    });

    return { success: true, imageId };
  },
});
