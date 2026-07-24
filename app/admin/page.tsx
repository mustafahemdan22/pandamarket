'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiFolder, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiCpu, 
  FiImage, 
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
  FiLoader,
  FiPieChart,
  FiDollarSign
} from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function AdminDashboardOverview() {
  const { language } = useLanguage();
  const stats = useQuery((api.products as any).getAdminOverviewStats) as any;

  if (stats === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">
          {language === 'ar' ? 'جاري تحميل مقاييس اللوحة...' : 'Loading Executive Operational KPIs...'}
        </p>
      </div>
    );
  }

  const kpiCards = [
    {
      title: language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtitle: language === 'ar' ? 'المبيعات الإجمالية المحققة' : 'Cumulative Order Gross Revenue',
      icon: FiDollarSign,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      title: language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: stats.totalOrders.toString(),
      subtitle: `${stats.pendingOrders} ${language === 'ar' ? 'قيد الانتظار' : 'pending processing'}`,
      icon: FiShoppingBag,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    },
    {
      title: language === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog',
      value: stats.totalProducts.toString(),
      subtitle: `${stats.totalCategories} ${language === 'ar' ? 'فئات نشطة' : 'active categories'}`,
      icon: FiPackage,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
    {
      title: language === 'ar' ? 'تنبيهات المخزون' : 'Inventory Alerts',
      value: (stats.lowStockCount + stats.outOfStockCount).toString(),
      subtitle: `${stats.outOfStockCount} ${language === 'ar' ? 'نفذت الكمية' : 'out of stock'}`,
      icon: FiAlertTriangle,
      color: stats.outOfStockCount > 0 
        ? 'from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30'
        : 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  const quickModules = [
    { name: language === 'ar' ? 'إدارة المنتجات' : 'Products', href: '/admin/products', icon: FiPackage, color: 'text-blue-400' },
    { name: language === 'ar' ? 'إدارة الفئات' : 'Categories', href: '/admin/categories', icon: FiFolder, color: 'text-emerald-400' },
    { name: language === 'ar' ? 'إدارة الطلبات' : 'Orders', href: '/admin/orders', icon: FiShoppingBag, color: 'text-amber-400' },
    { name: language === 'ar' ? 'التحكم بالمخزون' : 'Inventory', href: '/admin/inventory', icon: FiTrendingUp, color: 'text-purple-400' },
    { name: language === 'ar' ? 'سجل العملاء' : 'Customers', href: '/admin/customers', icon: FiUsers, color: 'text-cyan-400' },
    { name: language === 'ar' ? 'مكتبة الوسائط' : 'Media Manager', href: '/admin/images', icon: FiImage, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
            <span>LIVE OPERATIONAL METRICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ar' ? 'مرحباً بك في لوحة تحكم باندا ماركت' : 'PandaMarket Operational Dashboard'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {language === 'ar'
              ? 'نظام المركز القيادي لإدارة المنتجات، الطلبات، المخزون، والتحليلات البرمجية المباشرة.'
              : 'Real-time commerce operations control panel. Monitor store performance, process customer orders, and manage inventory.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse z-10">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
          >
            {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors border border-slate-700"
          >
            {language === 'ar' ? 'عرض الطلبات' : 'View Orders'}
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-slate-900 border ${card.color.split(' ')[2]} rounded-2xl p-5 space-y-3 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color.split(' ')[0]} ${card.color.split(' ')[1]}`}>
                  <Icon className={`w-5 h-5 ${card.color.split(' ')[2]}`} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                {card.value}
              </div>
              <div className="text-xs text-slate-400">{card.subtitle}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Operational Highlights Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center space-x-2 rtl:space-x-reverse">
              <FiShoppingBag className="text-emerald-400 w-5 h-5" />
              <span>{language === 'ar' ? 'أحدث طلبات العملاء' : 'Recent Customer Orders'}</span>
            </h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-emerald-400 hover:underline">
              {language === 'ar' ? 'عرض الكل' : 'View All Orders'}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs text-slate-300">
              <thead className="text-slate-500 uppercase border-b border-slate-800 text-[10px] font-bold">
                <tr>
                  <th className="py-2.5">{language === 'ar' ? 'رقم الطلب' : 'Order #'}</th>
                  <th className="py-2.5">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="py-2.5">{language === 'ar' ? 'الإجمالي' : 'Total'}</th>
                  <th className="py-2.5">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      {language === 'ar' ? 'لا توجد طلبات حديثة في الوقت الحالي' : 'No recent orders yet.'}
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-mono text-emerald-400 font-semibold">{order.orderNumber}</td>
                      <td className="py-3 text-white font-medium">{order.customerName}</td>
                      <td className="py-3 font-mono">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                          order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Nav Modules Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">
            {language === 'ar' ? 'الوظائف السريعة' : 'Quick Navigation'}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {quickModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={idx}
                  href={mod.href}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-xl flex flex-col items-center justify-center text-center space-y-2 transition-all hover:scale-[1.02]"
                >
                  <Icon className={`w-6 h-6 ${mod.color}`} />
                  <span className="text-xs font-semibold text-slate-200">{mod.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
