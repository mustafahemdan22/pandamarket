import { query } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./auth";

export const getAdminOverviewStats = query({
  handler: async (ctx) => {
    // 1. Fetch Orders
    const orders = await ctx.db.query("orders").order("desc").collect();
    const totalOrders = orders.length;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    for (const order of orders) {
      totalRevenue += order.total || 0;
      if (order.status === "pending" || order.status === "processing") {
        pendingOrders++;
      } else if (order.status === "delivered" || order.status === "confirmed" || order.status === "shipped") {
        completedOrders++;
      }
    }

    // 2. Fetch Products
    const products = await ctx.db.query("products").collect();
    const totalProducts = products.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const prod of products) {
      const stock = prod.stock ?? 100;
      if (stock === 0) {
        outOfStockCount++;
      } else if (stock < 10) {
        lowStockCount++;
      }
    }

    // 3. Fetch Categories
    const categories = await ctx.db.query("categories").collect();
    const totalCategories = categories.length;

    // 4. Recent Orders (Last 6)
    const recentOrders = orders.slice(0, 6).map((o) => ({
      _id: o._id,
      orderNumber: o.orderNumber,
      customerName: `${o.customerInfo.firstName} ${o.customerInfo.lastName}`,
      total: o.total,
      status: o.status,
      itemCount: o.items.length,
      createdAt: o.createdAt || Date.now(),
    }));

    // 5. Top Selling / High Stock Products
    const topProducts = products
      .filter((p) => p.isActive)
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      .slice(0, 5)
      .map((p) => ({
        _id: p._id,
        nameEn: p.nameEn,
        name: p.name,
        price: p.price,
        stock: p.stock ?? 100,
        imagePublicId: p.imagePublicId,
      }));

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalProducts,
      totalCategories,
      lowStockCount,
      outOfStockCount,
      recentOrders,
      topProducts,
    };
  },
});

export const getAnalyticsReportData = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();
    const categories = await ctx.db.query("categories").collect();

    // Group sales by Category
    const categorySalesMap: Record<string, number> = {};
    for (const cat of categories) {
      categorySalesMap[cat.nameEn] = 0;
    }

    for (const order of orders) {
      for (const item of order.items) {
        const product = products.find((p) => p._id === item.productId);
        if (product) {
          const category = categories.find((c) => c._id === product.categoryId);
          const catName = category?.nameEn || "Other";
          categorySalesMap[catName] = (categorySalesMap[catName] || 0) + item.price * item.quantity;
        }
      }
    }

    const categoryDistribution = Object.entries(categorySalesMap).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      totalProducts: products.length,
      categoryDistribution,
      lowPerformingProducts: products
        .filter((p) => (p.stock ?? 0) > 50)
        .slice(0, 5)
        .map((p) => ({
          nameEn: p.nameEn,
          stock: p.stock ?? 0,
          price: p.price,
        })),
    };
  },
});
