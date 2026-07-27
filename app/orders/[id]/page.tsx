"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiTruck, FiCreditCard, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiHelpCircle, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageProvider";
import toast from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrders } from "@/contexts/OrderProvider";
import { buildImageUrl } from "@/lib/cloudinary";

const orderStatusTranslations: Record<string, { ar: string; en: string; color: string; icon: React.ReactNode }> = {
  pending: { ar: "قيد الانتظار", en: "Pending", color: "bg-yellow-100 text-yellow-800", icon: <FiHelpCircle className="w-4 h-4" /> },
  confirmed: { ar: "مؤكد", en: "Confirmed", color: "bg-blue-100 text-blue-800", icon: <FiCheckCircle className="w-4 h-4" /> },
  processing: { ar: "قيد التجهيز", en: "Processing", color: "bg-purple-100 text-purple-800", icon: <FiLoader className="w-4 h-4 animate-spin" /> },
  shipped: { ar: "تم الشحن", en: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: <FiTruck className="w-4 h-4" /> },
  delivered: { ar: "تم التوصيل", en: "Delivered", color: "bg-green-100 text-green-800", icon: <FiCheckCircle className="w-4 h-4 fill-current" /> },
  cancelled: { ar: "ملغي", en: "Cancelled", color: "bg-red-100 text-red-800", icon: <FiXCircle className="w-4 h-4" /> },
};

const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

interface OrderItem {
  productName: string;
  productNameAr?: string;
  productNameEn?: string;
  quantity: number;
  price: number;
  imagePublicId?: string;
  product?: any;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Order {
  id?: string;
  _id?: string;
  orderNumber: string;
  status: (typeof statusOrder)[number];
  createdAt?: number;
  orderDate?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  deliverySlot?: {
    date: string;
    timeWindow: string;
  };
  substitutionPreference?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = (params?.id || "") as string;
  const { language, isRTL } = useLanguage();
  const { orders: localOrders } = useOrders();

  const dbOrder = useQuery(
    api.orders.getOrderById,
    id ? { id } : "skip"
  );

  const order: Order | null = useMemo(() => {
    if (dbOrder !== undefined && dbOrder !== null) {
      return dbOrder as any;
    }
    if (dbOrder === null || dbOrder === undefined) {
      const found = localOrders.find(
        (o: any) => o.id === id || o._id === id || o.orderNumber === id
      );
      if (found) {
        return {
          ...found,
          createdAt: found.orderDate ? new Date(found.orderDate).getTime() : Date.now(),
          discount: 0,
        } as any;
      }
    }
    return null;
  }, [dbOrder, localOrders, id]);

  const isLoading = dbOrder === undefined && !localOrders.some((o: any) => o.id === id || o._id === id || o.orderNumber === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-6xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "الطلب غير موجود" : "Order Not Found"}
          </h1>
          <Link
            href="/orders"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            {isRTL ? (
              <>
                {language === "ar" ? "العودة للطلبات" : "Back to Orders"}
                <FiArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </>
            ) : (
              <>
                <FiArrowLeft className="w-5 h-5 mr-2" />
                {language === "ar" ? "العودة للطلبات" : "Back to Orders"}
              </>
            )}
          </Link>
        </div>
      </div>
    );
  }

  const status = orderStatusTranslations[order.status] || orderStatusTranslations.pending;
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const productName = language === "ar" ? "productName" : "productNameEn";

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2) + (language === "ar" ? " ج.م" : " EGP");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-4"
            >
              <FiArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""} mr-2`} />
              {language === "ar" ? "العودة للطلبات" : "Back to Orders"}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "تفاصيل الطلب" : "Order Details"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              #{order.orderNumber}
            </p>
          </div>

          <div className={`px-4 py-2 rounded-full font-semibold ${status.color} flex items-center gap-2`}>
            {status.icon}
            <span>{language === "ar" ? status.ar : status.en}</span>
          </div>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === "ar" ? "تتبع حالة الطلب" : "Order Status Timeline"}
              </h2>
            </div>
            <div className="px-6 py-4 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-6">
                {statusOrder.map((statusKey, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const statusInfo = orderStatusTranslations[statusKey];

                  return (
                    <div key={statusKey} className="relative flex items-start gap-4">
                      <div className={`relative flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : isCurrent
                          ? "bg-blue-500 border-blue-500 ring-4 ring-blue-500/20"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}>
                        {isCompleted ? (
                          <FiCheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          statusInfo.icon
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-medium ${isCompleted || isCurrent ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                          {language === "ar" ? statusInfo.ar : statusInfo.en}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {language === "ar" ? "الحالة الحالية" : "Current status"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === "ar" ? "منتجات الطلب" : "Order Items"}
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {order.items.map((item: OrderItem, index: number) => {
                const nameEn = item.productNameEn || item.productName || item.product?.nameEn || "Item";
                const nameAr = item.productNameAr || item.product?.name || item.productName || nameEn;
                const displayName = language === "ar" ? nameAr : nameEn;
                const imgId = item.imagePublicId || item.product?.image || item.product?.imagePublicId || "";
                const imgResult = buildImageUrl(imgId, { width: 200, height: 200, crop: "fill" });
                const imgSrc = imgResult.primary || imgResult.fallback || "/images/image-missing.svg";

                return (
                  <div key={index} className="px-6 py-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                      <Image
                        src={imgSrc}
                        alt={displayName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {displayName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === "ar" ? "الكمية:" : "Qty:"} {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === "ar" ? "ملخص الدفع" : "Payment Summary"}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
                  <span>{formatPrice(order.deliveryFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{language === "ar" ? "الخصم" : "Discount"}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-green-600" />
                {language === "ar" ? "عنوان التوصيل" : "Shipping Address"}
              </h2>
              <address className="text-gray-600 dark:text-gray-400 not-italic space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.customerInfo.phone}</p>
                <p>{order.customerInfo.email}</p>
              </address>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-green-600" />
                {language === "ar" ? "طريقة الدفع" : "Payment Method"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {order.paymentMethod.replace(/_/g, " ")}
              </p>
            </div>

            {/* Delivery Slot */}
            {order.deliverySlot && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-green-600" />
                  {language === "ar" ? "موعد التوصيل المحدد" : "Delivery Slot"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {order.deliverySlot.date === 'Today' ? (language === 'ar' ? 'اليوم' : 'Today') : (order.deliverySlot.date === 'Tomorrow' ? (language === 'ar' ? 'غداً' : 'Tomorrow') : order.deliverySlot.date)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {language === "ar" ? "الفترة الزمنية: " : "Time Window: "} {order.deliverySlot.timeWindow}
                </p>
              </div>
            )}

            {/* Substitution Preference */}
            {order.substitutionPreference && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5 text-green-600" />
                  {language === "ar" ? "تفضيل البدائل عند نفاد المخزون" : "Substitution Preference"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {order.substitutionPreference === 'substitute_similar'
                    ? (language === 'ar' ? 'استبدال بمنتج مشابه' : 'Substitute with similar product')
                    : order.substitutionPreference === 'call_customer'
                    ? (language === 'ar' ? 'الاتصال بي أولاً' : 'Call me first')
                    : (language === 'ar' ? 'عدم الاستبدال' : 'Do not substitute')}
                </p>
              </div>
            )}

            {/* Order Date */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-green-600" />
                {language === "ar" ? "تاريخ الطلب" : "Order Date"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {order.createdAt ? formatDate(order.createdAt) : (order.orderDate ? order.orderDate : "")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}