'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiSearch, FiX, FiLoader, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import { formatCurrency, normalizeArabicText } from '@/lib/formatters';
import Link from 'next/link';

export default function StorefrontSearch() {
  const { language, isRTL } = useLanguage();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query Convex products
  const products = useQuery(
    api.products.getProducts,
    debouncedQuery ? { searchTerm: normalizeArabicText(debouncedQuery) } : "skip"
  );

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Filter products by readiness status (strictly exclude draft_hidden)
  const filteredResults = (products || []).filter((p) => {
    const readiness = p.readinessStatus || (p.isActive ? 'active_sellable' : 'draft_hidden');
    return readiness !== 'draft_hidden';
  }).slice(0, 6);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <FiSearch className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={language === 'ar' ? 'ابحث عن منتج (حليب، أرز، جهينة...)' : 'Search products (milk, rice...)'}
          className="w-full pl-9 pr-8 rtl:pr-9 rtl:pl-8 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 rounded-full text-xs sm:text-sm border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all duration-200"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Quick Search Preview Dropdown */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
          {products === undefined ? (
            <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <FiLoader className="w-4 h-4 animate-spin text-green-600" />
              <span>{language === 'ar' ? 'جاري البحث...' : 'Searching...'}</span>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching products found'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-80 overflow-y-auto">
              {filteredResults.map((product) => {
                const name = language === 'ar' ? product.name : product.nameEn;
                const readiness = product.readinessStatus || (product.isActive ? 'active_sellable' : 'draft_hidden');
                const isOutOfStock = product.stock !== undefined && product.stock === 0;

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 rtl:space-x-reverse p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                      🛒
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {name}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        {product.brand} • {formatCurrency(product.price, language)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {readiness === 'editorial_only' ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full">
                          {language === 'ar' ? 'عرض فقط' : 'Showcase'}
                        </span>
                      ) : readiness === 'request_quote' ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-full">
                          {language === 'ar' ? 'طلب سعر' : 'Quote'}
                        </span>
                      ) : isOutOfStock ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                          {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                          {language === 'ar' ? 'متوفر' : 'In Stock'}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}

              <Link
                href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                onClick={() => setIsOpen(false)}
                className="block p-2.5 text-center text-xs font-semibold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
              >
                {language === 'ar' ? `عرض كل النتائج (${filteredResults.length})` : `View all results (${filteredResults.length})`}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
