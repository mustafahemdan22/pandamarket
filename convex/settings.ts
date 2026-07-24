import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requirePermission } from "./auth";

export const getStoreSettings = query({
  handler: async (ctx) => {
    return {
      storeName: "PandaMarket Supermarket",
      storeNameAr: "باندا ماركت سوبر ماركت",
      supportEmail: "support@pandamarket.com",
      supportPhone: "+20 100 000 0000",
      currency: "EGP",
      freeDeliveryThreshold: 500,
      standardDeliveryFee: 30,
      taxRatePercent: 14,
      defaultLanguage: "ar",
      enableAiGeneration: true,
      maintenanceMode: false,
    };
  },
});
