import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./auth";

export const createOrder = mutation({
  args: {
    idempotencyKey: v.optional(v.string()),
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
    deliverySlot: v.optional(
      v.object({
        date: v.string(),
        timeWindow: v.string(),
      })
    ),
    substitutionPreference: v.optional(
      v.union(
        v.literal("substitute_similar"),
        v.literal("call_customer"),
        v.literal("do_not_substitute")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Canonical Identity Resolution via Convex ctx.auth.getUserIdentity()
    const identity = await ctx.auth.getUserIdentity();
    const canonicalUserId = identity ? identity.subject : args.userId;

    // 1. Idempotency Check: Prevent duplicate order creation
    if (args.idempotencyKey) {
      const existingOrder = await ctx.db
        .query("orders")
        .withIndex("by_idempotency", (q) => q.eq("idempotencyKey", args.idempotencyKey!))
        .first();

      if (existingOrder) {
        return {
          orderId: existingOrder._id,
          orderNumber: existingOrder.orderNumber,
          total: existingOrder.total,
          isDuplicate: true,
        };
      }
    }

    let subtotal = 0;
    const validatedItems = [];

    // 2. Server-side Price, Readiness & Stock Revalidation
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Readiness contract check
      const readiness = product.readinessStatus || (product.isActive ? "active_sellable" : "draft_hidden");
      if (readiness !== "active_sellable") {
        throw new Error(`Product "${product.nameEn}" is not available for purchase (Status: ${readiness})`);
      }

      // Fulfillability contract check
      if (product.isFulfillable === false) {
        throw new Error(`Product "${product.nameEn}" is temporarily unfulfillable`);
      }

      // Stock check & oversell protection
      if (product.stock !== undefined && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.nameEn}". Available: ${product.stock}, Requested: ${item.quantity}`);
      }

      // Calculate subtotal from trusted DB prices only (ignore client prices)
      const itemPrice = product.price;
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        productId: product._id,
        productName: product.nameEn,
        productNameAr: product.name,
        imagePublicId: product.imagePublicId,
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

    // Unified delivery fee calculation: Free over 200, otherwise 20 EGP/SAR
    const deliveryFee = subtotal >= 200 ? 0 : 20;
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
      idempotencyKey: args.idempotencyKey,
      userId: canonicalUserId,
      items: validatedItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: "pending",
      deliverySlot: args.deliverySlot,
      substitutionPreference: args.substitutionPreference,
      shippingAddress: args.shippingAddress,
      customerInfo: args.customerInfo,
      paymentMethod: args.paymentMethod,
      createdAt: Date.now(),
    });

    return { orderId, orderNumber, total, isDuplicate: false };
  },
});

export const getOrderById = query({
  args: { id: v.union(v.id("orders"), v.string()) },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("orders", args.id);
    if (!normalizedId) return null;
    return await ctx.db.get(normalizedId);
  },
});

export const getOrdersByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const targetUserId = identity ? identity.subject : args.userId;

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId))
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
          (o.orderNumber || "").toLowerCase().includes(searchLower) ||
          (o.customerInfo?.firstName || "").toLowerCase().includes(searchLower) ||
          (o.customerInfo?.lastName || "").toLowerCase().includes(searchLower) ||
          (o.customerInfo?.email || "").toLowerCase().includes(searchLower)
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

export const getAllCustomersAdmin = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    const customersMap = new Map();

    for (const order of orders) {
      if (!order.customerInfo || !order.customerInfo.email) continue;
      const email = order.customerInfo.email;
      if (!customersMap.has(email)) {
        customersMap.set(email, {
          firstName: order.customerInfo.firstName || "Unknown",
          lastName: order.customerInfo.lastName || "User",
          email: email,
          phone: order.customerInfo.phone || "N/A",
          city: order.shippingAddress?.city || "Unknown",
          orderCount: 0,
          totalSpent: 0,
          status: "active",
        });
      }
      const customer = customersMap.get(email);
      customer.orderCount += 1;
      customer.totalSpent += order.total || 0;
      if (customer.orderCount >= 3) {
        customer.status = "frequent";
      }
    }

    let customersArray = Array.from(customersMap.values());
    if (args.search) {
      const s = args.search.toLowerCase();
      customersArray = customersArray.filter(
        c => c.firstName.toLowerCase().includes(s) || 
             c.lastName.toLowerCase().includes(s) || 
             c.email.toLowerCase().includes(s) || 
             c.city.toLowerCase().includes(s)
      );
    }
    return customersArray;
  },
});

