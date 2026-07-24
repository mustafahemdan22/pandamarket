'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiSettings, FiSave, FiGlobe, FiDollarSign, FiMail, FiPhone, FiTruck, FiLoader } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { language } = useLanguage();
  const settings = useQuery((api.products as any).getStoreSettings) as any;

  const [formData, setFormData] = useState({
    storeName: 'PandaMarket Supermarket',
    storeNameAr: 'باندا ماركت سوبر ماركت',
    supportEmail: 'support@pandamarket.com',
    supportPhone: '+20 100 000 0000',
    currency: 'EGP',
    freeDeliveryThreshold: 500,
    standardDeliveryFee: 30,
    taxRatePercent: 14,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Store settings saved successfully!');
  };

  if (settings === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Loading Store Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {language === 'ar' ? 'إعدادات النظام والمتجر' : 'Store & System Settings'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {language === 'ar' ? 'ضبط المعايير التشغيلية ورسوم التوصيل والبيانات الأساسية للمتجر' : 'Configure operational parameters, delivery thresholds, and store contact information.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Store Name (English)</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 dir-rtl">اسم المتجر (بالعربية)</label>
            <input
              type="text"
              value={formData.storeNameAr}
              onChange={(e) => setFormData({ ...formData, storeNameAr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white dir-rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Support Email</label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Support Hotline Phone</label>
            <input
              type="text"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Free Delivery Minimum ($)</label>
            <input
              type="number"
              value={formData.freeDeliveryThreshold}
              onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Standard Delivery Fee ($)</label>
            <input
              type="number"
              value={formData.standardDeliveryFee}
              onChange={(e) => setFormData({ ...formData, standardDeliveryFee: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Sales Tax Rate (%)</label>
            <input
              type="number"
              value={formData.taxRatePercent}
              onChange={(e) => setFormData({ ...formData, taxRatePercent: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs transition-colors flex items-center space-x-2 rtl:space-x-reverse shadow-lg shadow-emerald-500/20"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
