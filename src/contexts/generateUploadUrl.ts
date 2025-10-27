import { mutation } from "../../convex/_generated/server";

// دالة بتولد URL مؤقت لرفع الصورة على Convex storage
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
