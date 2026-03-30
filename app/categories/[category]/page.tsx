'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { sampleProducts } from '../../../data/products';
import ProductCard from '../../../components/ProductCard';
import { useLanguage } from '../../../contexts/LanguageProvider';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

// أسماء الفئات بالعربي والإنجليزي
const categoryNames: Record<string, { ar: string; en: string;  }> = {
  bakery: { ar: 'المخبوزات', en: 'Bakery', },
  spices: { ar: 'التوابل', en: 'Spices', },
  dry: { ar: 'البقالة الجافة', en: 'Dry', },
  cleaning: { ar: 'منتجات التنظيف', en: 'Cleaning Products', },
  grocery: { ar: 'البازار', en: 'grocery',  },
  vegetables: { ar: 'الخضروات والفواكه', en: 'Vegetables & Fruits', },
};

export default function CategoryPage() {
  const params = useParams();
  const { language, isRTL } = useLanguage();
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setCategory(resolvedParams.category as string);
      } catch (error) {
        console.error('Error loading params:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParams();
  }, [params]);

  // ✅ استخدم useMemo للفلترة
  const categoryProducts = useMemo(() => {
    return sampleProducts.filter((product) => product.category === category);
  }, [category]);

  // ✅ معلومات الفئة
  const categoryInfo = categoryNames[category];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // لو الكاتيجوري مش موجودة أو مفيش منتجات
  if (!categoryInfo || categoryProducts.length === 0) {
    return notFound();
  }

  const categoryName = language === 'ar' ? categoryInfo.ar : categoryInfo.en;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8"
        >
          <Link
            href="/"
            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link
            href="/categories"
            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            {language === 'ar' ? 'الأقسام' : 'Categories'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {categoryName}
          </span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">


              {/* Category Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {categoryName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ar'
                    ? `${categoryProducts.length} منتج متاح`
                    : `${categoryProducts.length} products available`}
                </p>
              </div>
            </div>

            {/* Back Button */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
            >
              {isRTL ? (
                <>
                  {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
                  <FiArrowLeft className="w-5 h-5 rotate-180" />
                </>
              ) : (
                <>
                  <FiArrowLeft className="w-5 h-5" />
                  {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
                </>
              )}
            </Link>
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full w-24"></div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {categoryProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State (backup - should not show due to notFound) */}
        {categoryProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
              <FiPackage className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'ar' ? 'لا توجد منتجات' : 'No Products'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ar'
                ? 'لا توجد منتجات في هذا القسم حالياً'
                : 'No products in this category yet'}
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {language === 'ar' ? 'تصفح الأقسام الأخرى' : 'Browse Other Categories'}
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
