'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiUsers, FiSearch, FiShoppingBag, FiDollarSign, FiLoader, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function AdminCustomersPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const customers = useQuery((api.orders as any).getAllCustomersAdmin, { search: searchTerm }) as any[] | undefined;

  if (customers === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Loading Customer Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {language === 'ar' ? 'سجل وحسابات العملاء' : 'Customer Accounts & Intelligence'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {language === 'ar' ? `إجمالي ${customers.length} عميل نشط ومسجل` : `Total ${customers.length} unique customer profiles`}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <FiSearch className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by customer name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No customer profiles match the search.
          </div>
        ) : (
          customers.map((c) => (
            <div key={c.email} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/20">
                    {c.firstName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{c.firstName} {c.lastName}</div>
                    <div className="text-xs text-slate-400">{c.city}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  c.status === 'frequent' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  c.status === 'inactive' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-b border-slate-800 py-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FiMail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FiPhone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{c.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Orders</span>
                  <span className="font-bold text-white text-sm">{c.orderCount}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Lifetime Spend</span>
                  <span className="font-bold text-emerald-400 text-sm">${c.totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
