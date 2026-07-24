'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiPieChart, FiTrendingUp, FiDownload, FiDollarSign, FiShoppingBag, FiPackage, FiLoader } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

export default function AdminAnalyticsPage() {
  const { language } = useLanguage();
  const data = useQuery((api.products as any).getAnalyticsReportData) as any;

  const handleExportCSV = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Orders,${data.totalOrders}\n`
      + `Total Revenue,${data.totalRevenue}\n`
      + `Total Products,${data.totalProducts}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pandamarket_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics CSV report exported successfully!');
  };

  if (data === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Generating Performance Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {language === 'ar' ? 'التحليلات والتقارير المالية' : 'Analytics & Business Intelligence'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {language === 'ar' ? 'تقارير أداء المتجر، المبيعات حسب الفئة، وحركة المنتجات' : 'Comprehensive store performance metrics and category distributions.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <FiDownload className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ar' ? 'تصدير تقرير CSV' : 'Export CSV Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Gross Sales</span>
          <div className="text-2xl font-mono font-bold text-emerald-400">${data.totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Orders Processed</span>
          <div className="text-2xl font-mono font-bold text-white">{data.totalOrders}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase">Active Products</span>
          <div className="text-2xl font-mono font-bold text-purple-400">{data.totalProducts}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base">Category Sales Breakdown</h3>
        <div className="space-y-3">
          {data.categoryDistribution.map((cat: any) => {
            const pct = data.totalRevenue > 0 ? (cat.value / data.totalRevenue) * 100 : 0;
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{cat.name}</span>
                  <span className="text-emerald-400 font-mono">${cat.value.toFixed(2)} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${Math.max(pct, 5)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
