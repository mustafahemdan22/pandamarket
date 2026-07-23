import { mutation } from "./_generated/server";

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
