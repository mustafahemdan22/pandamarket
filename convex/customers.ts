import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAllCustomersAdmin = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").collect();
    
    // Group order metrics by customer email
    const customerMap: Record<
      string,
      {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        city: string;
        orderCount: number;
        totalSpent: number;
        lastOrderDate: number;
        status: "active" | "frequent" | "inactive";
      }
    > = {};

    for (const order of orders) {
      const email = order.customerInfo.email.toLowerCase();
      if (!customerMap[email]) {
        customerMap[email] = {
          email,
          firstName: order.customerInfo.firstName,
          lastName: order.customerInfo.lastName,
          phone: order.customerInfo.phone,
          city: order.shippingAddress.city,
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt || Date.now(),
          status: "active",
        };
      }

      customerMap[email].orderCount += 1;
      customerMap[email].totalSpent += order.total || 0;
      if ((order.createdAt || 0) > customerMap[email].lastOrderDate) {
        customerMap[email].lastOrderDate = order.createdAt || Date.now();
      }
    }

    let customers = Object.values(customerMap).map((c) => {
      let status: "active" | "frequent" | "inactive" = "active";
      if (c.orderCount >= 3) {
        status = "frequent";
      } else if (Date.now() - c.lastOrderDate > 30 * 24 * 60 * 60 * 1000) {
        status = "inactive";
      }
      return { ...c, status };
    });

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.city.toLowerCase().includes(searchLower)
      );
    }

    return customers;
  },
});
