'use client';

import { motion } from 'framer-motion';
import { sampleProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { useLanguage } from '../../contexts/LanguageProvider';
import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';

// مكون Pagination
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  language: 'ar' | 'en';
  isRTL: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, language, isRTL }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    pages.push(1);

    if (currentPage > delta + 2) {
      pages.push('...');
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - delta - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* زر السابق */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
      >
        {isRTL ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
      </button>

      {/* أرقام الصفحات */}
      <div className="flex gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* زر التالي */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={language === 'ar' ? 'الصفحة التالية' : 'Next page'}
      >
        {isRTL ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
};

const CategoriesPage = () => {
  const { language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const categories = [
    { id: 'all', name: language === 'ar' ? 'الكل' : 'All Products', icon: '🛒' },
    { id: 'bakery', name: language === 'ar' ? 'المخبوزات' : 'Bakery', icon: '🍞' },
    { id: 'spices', name: language === 'ar' ? 'التوابل' : 'Spices', icon: '🌶️' },
    { id: 'dry-grocery', name: language === 'ar' ? 'البقالة الجافة' : 'Dry Grocery', icon: '🥫' },
    { id: 'cleaning', name: language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products', icon: '🧹' },
    { id: 'bazaar', name: language === 'ar' ? 'البازار' : 'Bazaar', icon: '🛍️' },
    { id: 'vegetables', name: language === 'ar' ? 'الخضروات والفواكه' : 'Vegetables & Fruits', icon: '🥬' },
  ];

  // ✅ فلترة المنتجات مع البحث بكلا اللغتين
  const filteredProducts = useMemo(() => {
    let products =
      selectedCategory === 'all'
        ? sampleProducts
        : sampleProducts.filter((product) => product.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.nameEn.toLowerCase().includes(query) ||
          (product.description?.toLowerCase() || '').includes(query) ||
          (product.descriptionEn?.toLowerCase() || '').includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    return products;
  }, [selectedCategory, searchQuery]);

  // حساب Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // تغيير الصفحة
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // إعادة ضبط الصفحة عند تغيير الفلتر
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اكتشف مجموعتنا الواسعة من المنتجات الطازجة والعالية الجودة'
              : 'Discover our wide range of fresh and high-quality products'}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  language === 'ar' ? 'ابحث عن المنتجات...' : 'Search products...'
                }
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                  isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'
                }`}
              />
              <FiSearch 
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
                  isRTL ? 'right-4' : 'left-4'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4 justify-center">
            <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {language === 'ar' ? 'تصفية حسب القسم' : 'Filter by Category'}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Info & Items Per Page */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6 flex-wrap gap-4"
          >
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {language === 'ar' ? (
                <>
                  عرض <span className="text-green-600 font-bold">{startIndex + 1}</span> - <span className="text-green-600 font-bold">{Math.min(endIndex, filteredProducts.length)}</span> من{' '}
                  <span className="text-green-600 font-bold">{filteredProducts.length}</span> منتج
                </>
              ) : (
                <>
                  Showing <span className="text-green-600 font-bold">{startIndex + 1}</span> - <span className="text-green-600 font-bold">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
                  <span className="text-green-600 font-bold">{filteredProducts.length}</span> products
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {language === 'ar' ? 'عرض:' : 'Show:'}
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]"
        >
          {currentProducts.map((product, index) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            language={language}
            isRTL={isRTL}
          />
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
              <span className="text-6xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {language === 'ar'
                ? 'جرب اختيار فئة أخرى أو تعديل كلمات البحث'
                : 'Try selecting a different category or adjusting your search terms'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
