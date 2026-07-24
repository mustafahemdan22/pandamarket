import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./auth";

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

// ===== ADMIN ORDER OPERATIONS =====

export const getAllOrdersAdmin = query({
  args: {
    status: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("orders").order("desc").collect();

    if (args.status && args.status !== "all") {
      orders = orders.filter((o) => o.status === args.status);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchLower) ||
          o.customerInfo.firstName.toLowerCase().includes(searchLower) ||
          o.customerInfo.lastName.toLowerCase().includes(searchLower) ||
          o.customerInfo.email.toLowerCase().includes(searchLower)
      );
    }

    return orders;
  },
});

export const updateOrderStatusAdmin = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "orders");
    const updates: Record<string, any> = { status: args.status };
    if (args.trackingNumber !== undefined) {
      updates.trackingNumber = args.trackingNumber;
    }
    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const cancelOrderAdmin = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "orders");
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");

    // Restore inventory if not already cancelled
    if (order.status !== "cancelled") {
      for (const item of order.items) {
        const product = await ctx.db.get(item.productId);
        if (product && product.stock !== undefined) {
          await ctx.db.patch(product._id, {
            stock: product.stock + item.quantity,
            updatedAt: Date.now(),
          });
        }
      }
      await ctx.db.patch(args.id, { status: "cancelled" });
    }
    return args.id;
  },
});
