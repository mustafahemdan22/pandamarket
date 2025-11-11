'use client';

import { motion } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistProvider';
import ProductCard from '../../components/ProductCard';
import { useLanguage } from '../../contexts/LanguageProvider';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { language, isRTL } = useLanguage();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearWishlist = () => {
    if (window.confirm(
      language === 'ar' 
        ? 'هل أنت متأكد من حذف جميع المنتجات من المفضلة؟' 
        : 'Are you sure you want to clear your wishlist?'
    )) {
      setIsClearing(true);
      clearWishlist();
      toast.success(
        language === 'ar' 
          ? 'تم مسح المفضلة بنجاح' 
          : 'Wishlist cleared successfully'
      );
      setTimeout(() => setIsClearing(false), 300);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiHeart className="w-16 h-16 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {language === 'ar' 
                ? 'ابدأ إضافة المنتجات التي تحبها إلى قائمة المفضلة' 
                : 'Start adding products you love to your wishlist'
              }
            </p>
            
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FiShoppingBag className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'قائمة المفضلة' : 'My Wishlist'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' 
                  ? `${wishlist.length} ${wishlist.length === 1 ? 'منتج' : 'منتجات'} في المفضلة` 
                  : `${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} in wishlist`
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              {/* Clear All Button */}
              <button
                onClick={handleClearWishlist}
                disabled={isClearing}
                className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              >
                <FiTrash2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'مسح الكل' : 'Clear All'}
              </button>
              
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 text-green-600 hover:text-green-700 font-medium hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
              >
                <FiArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative group">
                <ProductCard product={product} />
                
                {/* Remove from Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    removeFromWishlist(product.id);
                    toast.success(
                      language === 'ar' 
                        ? 'تم إزالة المنتج من المفضلة' 
                        : 'Removed from wishlist'
                    );
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 bg-white dark:bg-gray-800 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                  aria-label={language === 'ar' ? 'إزالة من المفضلة' : 'Remove from wishlist'}
                >
                  <FiHeart className="w-5 h-5 fill-current" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <FiShoppingBag className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'ar' ? 'عرض السلة' : 'View Cart'}
              </Link>
              
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
              >
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;
