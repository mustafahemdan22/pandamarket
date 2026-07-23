import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    userId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    customerInfo: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    paymentMethod: v.string(),
    couponCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let subtotal = 0;
    const validatedItems = [];

    // Server-side Price & Stock Validation (Protection against Client Manipulation)
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (!product.isActive) {
        throw new Error(`Product ${product.nameEn} is no longer available`);
      }

      // Check stock
      if (product.stock !== undefined && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.nameEn}. Available: ${product.stock}`);
      }

      // Calculate subtotal from trusted DB prices
      const itemPrice = product.price;
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        productId: product._id,
        productName: product.nameEn,
        quantity: item.quantity,
        price: itemPrice,
      });

      // Deduct inventory atomically
      if (product.stock !== undefined) {
        await ctx.db.patch(product._id, {
          stock: product.stock - item.quantity,
          updatedAt: Date.now(),
        });
      }
    }

    // Fixed delivery fee calculation server-side
    const deliveryFee = subtotal > 500 ? 0 : 30;
    let discount = 0;

    // Validate Coupon Server-side
    if (args.couponCode) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", args.couponCode!))
        .first();

      if (coupon && coupon.active) {
        if (coupon.type === "percentage") {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        } else {
          discount = coupon.value;
        }

        // Increment coupon usage
        await ctx.db.patch(coupon._id, {
          usageCount: coupon.usageCount + 1,
        });
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);
    const orderNumber = `PANDA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      userId: args.userId,
      items: validatedItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: "pending",
      shippingAddress: args.shippingAddress,
      customerInfo: args.customerInfo,
      paymentMethod: args.paymentMethod,
      createdAt: Date.now(),
    });

    return { orderId, orderNumber, total };
  },
});

export const getOrderById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getOrdersByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
