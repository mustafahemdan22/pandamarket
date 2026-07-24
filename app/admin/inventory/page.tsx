'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiLoader, FiEdit3, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

export default function AdminInventoryPage() {
  const { language } = useLanguage();
  const products = useQuery(api.products.getAllProductsAdmin);
  const updateStockMutation = useMutation(api.products.updateStock);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, low_stock, out_of_stock
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  if (products === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Loading Inventory Matrix...</p>
      </div>
    );
  }

  const handleStockChange = (id: string, val: number) => {
    setStockEdits({ ...stockEdits, [id]: val });
  };

  const handleSaveStock = async (id: Id<"products">, currentStock: number) => {
    const editVal = stockEdits[id];
    if (editVal === undefined) return;
    const delta = editVal - currentStock;

    try {
      await updateStockMutation({ id, quantity: delta });
      toast.success('Stock count updated');
    } catch (err: any) {
      toast.error(err.message || 'Stock update failed');
    }
  };

  const filteredProducts = products.filter((p) => {
    const stock = p.stock ?? 100;
    const matchesSearch = p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'low_stock') return matchesSearch && stock > 0 && stock < 10;
    if (filter === 'out_of_stock') return matchesSearch && stock === 0;
    return matchesSearch;
  });

  const lowStockCount = products.filter((p) => (p.stock ?? 100) > 0 && (p.stock ?? 100) < 10).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 100) === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {language === 'ar' ? 'التحكم بالمخزون والتنبيهات' : 'Inventory Control & Alerts'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {language === 'ar' ? 'متابعة وتحديث كميات مخزون المنتجات وتوصيات إعادة التعبئة' : 'Real-time stock management and automated restock alerts.'}
        </p>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{products.length - lowStockCount - outOfStockCount}</div>
            <div className="text-xs text-slate-400">Healthy Stock</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">{lowStockCount}</div>
            <div className="text-xs text-slate-400">Low Stock (&lt;10 items)</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-4 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-red-400">{outOfStockCount}</div>
            <div className="text-xs text-slate-400">Out of Stock (0 items)</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filter === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-slate-400'}`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilter('low_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filter === 'low_stock' ? 'bg-amber-500 text-white' : 'bg-slate-950 text-slate-400'}`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilter('out_of_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filter === 'out_of_stock' ? 'bg-red-500 text-white' : 'bg-slate-950 text-slate-400'}`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search catalog inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 rtl:pr-9 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left rtl:text-right text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Stock Update</th>
              <th className="px-6 py-4 text-center">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredProducts.map((p) => {
              const currentStock = p.stock ?? 100;
              const val = stockEdits[p._id] !== undefined ? stockEdits[p._id] : currentStock;

              return (
                <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">{p.nameEn}</td>
                  <td className="px-6 py-4 text-slate-400">{p.categoryName || 'General'}</td>
                  <td className="px-6 py-4 font-mono font-bold">
                    <span className={`px-2 py-1 rounded-lg ${
                      currentStock === 0 ? 'bg-red-500/20 text-red-400' : currentStock < 10 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {currentStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleStockChange(p._id, parseInt(e.target.value) || 0)}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:border-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleSaveStock(p._id, currentStock)}
                      disabled={stockEdits[p._id] === undefined}
                      className="px-3 py-1 bg-emerald-500 disabled:opacity-40 text-white rounded-lg font-semibold text-xs transition-opacity"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
