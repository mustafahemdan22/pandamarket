'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { FiShield, FiCheckCircle, FiLock, FiKey, FiUserCheck } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function AdminRolesPage() {
  const { language } = useLanguage();
  const { user } = useUser();

  const permissions = [
    { key: 'dashboard.view', label: 'Dashboard Access', desc: 'View executive operational KPIs and summary widgets' },
    { key: 'products.view', label: 'Products Read', desc: 'View product catalog and pricing details' },
    { key: 'products.create', label: 'Products Create', desc: 'Add new supermarket items to catalog' },
    { key: 'products.update', label: 'Products Edit', desc: 'Update prices, stock, discounts, and AR/EN names' },
    { key: 'products.delete', label: 'Products Delete', desc: 'Permanently remove products from catalog' },
    { key: 'categories.view', label: 'Categories Read', desc: 'View category taxonomy list' },
    { key: 'categories.create', label: 'Categories Create', desc: 'Create new store categories' },
    { key: 'categories.update', label: 'Categories Edit', desc: 'Edit category names, slugs, and sort orders' },
    { key: 'categories.delete', label: 'Categories Delete', desc: 'Remove categories' },
    { key: 'orders.view', label: 'Orders Read', desc: 'View customer order history and statuses' },
    { key: 'orders.update', label: 'Orders Status Update', desc: 'Update order fulfillment state and cancel orders' },
    { key: 'inventory.view', label: 'Inventory Read', desc: 'View stock levels and low-stock alerts' },
    { key: 'inventory.update', label: 'Inventory Adjust', desc: 'Perform bulk stock edits and inventory updates' },
    { key: 'customers.view', label: 'Customers Read', desc: 'View customer accounts and lifetime spend metrics' },
    { key: 'analytics.view', label: 'Analytics Read', desc: 'View revenue trends and performance reports' },
    { key: 'media.view', label: 'Media Read', desc: 'Browse Cloudinary image library' },
    { key: 'media.upload', label: 'Media Upload', desc: 'Upload images to Cloudinary CDN' },
    { key: 'settings.view', label: 'Settings Read', desc: 'View store operational configurations' },
    { key: 'settings.update', label: 'Settings Edit', desc: 'Update delivery fees, tax rates, and contact info' },
    { key: 'roles.view', label: 'Roles Inspection', desc: 'Inspect active RBAC claims and security model' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {language === 'ar' ? 'الأدوار وصلاحيات الوصول (RBAC)' : 'Role-Based Access Control (RBAC)'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {language === 'ar' ? 'معاينة صلاحيات المستخدم النشط والتحقق من أمان النظام' : 'Active user token claims and module-level permission enforcement.'}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <FiUserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </div>
            <div className="text-xs text-emerald-400 font-mono">
              Assigned Role: Super Administrator
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center space-x-2 rtl:space-x-reverse">
          <FiShield className="text-emerald-400 w-5 h-5" />
          <span>Active Module Permission Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {permissions.map((perm) => (
            <div key={perm.key} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3 rtl:space-x-reverse">
              <FiCheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-white text-xs font-mono">{perm.key}</div>
                <div className="text-xs text-slate-300 font-medium">{perm.label}</div>
                <div className="text-[11px] text-slate-500">{perm.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
