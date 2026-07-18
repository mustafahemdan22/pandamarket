import { mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const generateUploadUrl = mutation(async (ctx) => {
  await requireAdmin(ctx);
  return await ctx.storage.generateUploadUrl();
});
