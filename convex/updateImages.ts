import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateToLocalPaths = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    console.log("Found products inside Convex:", products.length);
    let count = 0;
    for (const product of products) {
      if (product.imagePublicId && product.imagePublicId.startsWith("pandamarket/")) {
        const newImagePublicIds = (product.imagePublicIds || []).map(id => id.startsWith("pandamarket/") ? "/" + id : id);
        await ctx.db.patch(product._id, {
          imagePublicId: "/" + product.imagePublicId,
          imagePublicIds: newImagePublicIds
        });
        count++;
      }
    }
    return count;
  },
});

export const updateImagesBatch = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.string(),
        imagePublicId: v.string(),
        imagePublicIds: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const u of args.updates) {
      const normalizedId = ctx.db.normalizeId("products", u.id);
      if (normalizedId) {
        await ctx.db.patch(normalizedId, {
          imagePublicId: u.imagePublicId,
          imagePublicIds: u.imagePublicIds,
          updatedAt: Date.now(),
        });
        count++;
      }
    }
    return count;
  },
});
