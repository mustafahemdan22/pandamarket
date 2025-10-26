'use client';

import { motion } from 'framer-motion';
import { sampleProducts } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { useLanguage } from '../../contexts/LanguageProvider';
import { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';

const CategoriesPage = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', name: language === 'ar' ? 'الكل' : 'All Products' },
    { id: 'bakery', name: language === 'ar' ? 'المخبوزات' : 'Bakery' },
    { id: 'spices', name: language === 'ar' ? 'التوابل' : 'Spices' },
    { id: 'dry-grocery', name: language === 'ar' ? 'البقالة الجافة' : 'Dry Grocery' },
    { id: 'cleaning', name: language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products' },
    { id: 'bazaar', name: language === 'ar' ? 'البازار' : 'Bazaar' },
    { id: 'vegetables', name: language === 'ar' ? 'الخضروات' : 'Vegetables' }
  ];

  const filteredProducts = useMemo(() => {
    let products = selectedCategory === 'all' 
      ? sampleProducts 
      : sampleProducts.filter(product => product.category === selectedCategory);
    
    if (searchQuery.trim()) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }
    
    return products;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
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
              : 'Discover our wide range of fresh and high-quality products'
            }
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن المنتجات...' : 'Search products...'}
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ar' 
                ? 'جرب اختيار فئة أخرى أو تصفح جميع المنتجات' 
                : 'Try selecting a different category or browse all products'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
