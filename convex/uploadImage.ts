import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const uploadImage = mutation({
  args: {
    storageId: v.string(),
    title: v.string(),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.insert("images", {
      storageId: args.storageId,
      title: args.title,
      uploadedBy: args.uploadedBy,
      createdAt: Date.now(),
    });
  },
});
