import { mutation } from "./_generated/server";

const categoryMap: Record<string, string> = {
  'bakery': 'bakery',
  'beverages': 'beverages',
  'cleaning': 'cleaning',
  'dairy': 'dairy-eggs',
  'dry-grocery': 'pantry',
  'fruits': 'vegetables-fruits',
  'grocery': 'pantry',
  'legumes': 'pantry',
  'oils': 'pantry',
  'pantry': 'pantry',
  'produce': 'vegetables-fruits',
  'rice': 'pantry',
  'sauces': 'pantry',
  'snacks': 'snacks-sweets',
  'spices': 'pantry',
  'vegetables': 'vegetables-fruits',
};

export const fixPaths = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let count = 0;
    
    for (const product of products) {
      if (product.imagePublicId && product.imagePublicId.startsWith("/")) {
        // e.g. /pandamarket/categories/sauces/products/heinz/1
        const parts = product.imagePublicId.split('/');
        if (parts.length >= 5 && parts[2] === 'categories') {
          const oldCat = parts[3];
          const newCat = categoryMap[oldCat];
          if (newCat && newCat !== oldCat) {
            parts[3] = newCat;
            const newImagePublicId = parts.join('/');
            
            const newImagePublicIds = (product.imagePublicIds || []).map(id => {
              const pParts = id.split('/');
              if (pParts.length >= 5 && pParts[2] === 'categories') {
                pParts[3] = categoryMap[pParts[3]] || pParts[3];
                return pParts.join('/');
              }
              return id;
            });

            await ctx.db.patch(product._id, {
              imagePublicId: newImagePublicId,
              imagePublicIds: newImagePublicIds
            });
            count++;
          }
        }
      }
    }
    return count;
  },
});
