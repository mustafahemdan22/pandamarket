'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageProvider';
import { normalizeArabicText } from '@/lib/formatters';
import { FiSearch, FiPackage, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const { language, isRTL } = useLanguage();

  const [query, setQuery] = useState(rawQuery);
  const [activeQuery, setActiveQuery] = useState(rawQuery);

  useEffect(() => {
    setQuery(rawQuery);
    setActiveQuery(rawQuery);
  }, [rawQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
  };

  const products = useQuery(
    api.products.getProducts,
    activeQuery ? { searchTerm: normalizeArabicText(activeQuery) } : "skip"
  );

  // Filter out draft_hidden items from storefront search
  const filteredProducts = (products || []).filter((p) => {
    const readiness = p.readinessStatus || (p.isActive ? 'active_sellable' : 'draft_hidden');
    return readiness !== 'draft_hidden';
  });

  const adaptedProducts = filteredProducts.map((p) => ({
    id: p._id,
    name: p.name,
    nameEn: p.nameEn,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    imagePublicId: p.imagePublicId,
    imagePublicIds: p.imagePublicIds,
    category: p.subcategory || 'grocery',
    brand: p.brand,
    unit: p.unit,
    description: p.description,
    descriptionEn: p.descriptionEn,
    stock: p.stock,
    discount: p.discount,
    rating: p.rating,
    reviews: p.reviews,
    readinessStatus: p.readinessStatus,
    isFulfillable: p.isFulfillable,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'نتائج البحث عن المنتجات' : 'Search Product Catalog'}
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-lg rounded-2xl overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث باسم المنتج، الماركة، الفئة...' : 'Search by product name, brand, category...'}
              className="w-full px-5 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-base focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center space-x-2 rtl:space-x-reverse transition-colors"
            >
              <FiSearch className="w-5 h-5" />
              <span>{language === 'ar' ? 'بحث' : 'Search'}</span>
            </button>
          </form>
        </motion.div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            {activeQuery ? (
              <span>
                {language === 'ar'
                  ? `نتائج البحث عن "${activeQuery}": ${adaptedProducts.length} منتج`
                  : `Search results for "${activeQuery}": ${adaptedProducts.length} products`}
              </span>
            ) : (
              <span>{language === 'ar' ? 'يرجى إدخال كلمة للبحث' : 'Please enter a search term'}</span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {products === undefined && activeQuery && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <FiLoader className="w-10 h-10 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500">{language === 'ar' ? 'جاري البحث في قاعدة البيانات...' : 'Searching product catalog...'}</p>
          </div>
        )}

        {/* Empty State */}
        {products !== undefined && adaptedProducts.length === 0 && activeQuery && (
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
              <FiPackage className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'لم نجد منتجات مطابقة' : 'No Matching Products Found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              {language === 'ar'
                ? 'جرب البحث بكلمات أخرى أو تصفح الأقسام الرئيسية في المتجر.'
                : 'Try searching with different keywords or browse our main categories.'}
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adaptedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
