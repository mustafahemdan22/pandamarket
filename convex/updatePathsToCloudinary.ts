import { mutation } from "./_generated/server";

export const stripLocalPrefix = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let count = 0;

    for (const product of products) {
      let modified = false;
      let newMainId = product.imagePublicId;
      let newImageArray = [...(product.imagePublicIds || [])];

      if (newMainId && newMainId.startsWith("/")) {
        newMainId = newMainId.substring(1);
        // Strip .webp if present
        if (newMainId.endsWith(".webp")) {
          newMainId = newMainId.replace(/\.webp$/, "");
        }
        modified = true;
      }

      newImageArray = newImageArray.map(id => {
        let cleanId = id;
        if (cleanId.startsWith("/")) {
          cleanId = cleanId.substring(1);
        }
        if (cleanId.endsWith(".webp")) {
          cleanId = cleanId.replace(/\.webp$/, "");
        }
        if (cleanId !== id) modified = true;
        return cleanId;
      });

      if (modified) {
        await ctx.db.patch(product._id, {
          imagePublicId: newMainId,
          imagePublicIds: newImageArray,
          updatedAt: Date.now()
        });
        count++;
      }
    }
    return count;
  },
});
