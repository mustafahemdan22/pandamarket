'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../store/cartSlice';
import { useAppDispatch } from '../hooks/redux';
import { addToCart } from '../store/cartSlice';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageProvider';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);

  // ✅ اختيار الاسم والوصف حسب اللغة
  const productName = language === 'ar' ? product.name : product.nameEn;
  const productDescription = language === 'ar' 
    ? product.description 
    : product.descriptionEn;

  const getProductEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'bakery': '🍞',
      'spices': '🌶️',
      'dry-grocery': '🥫',
      'cleaning': '🧹',
      'bazaar': '🛍️',
      'vegetables': '🥬',
    };
    return emojiMap[category] || '🛒';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // ✅ منع الانتقال للصفحة
    e.stopPropagation();
    
    dispatch(addToCart(product));
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${productName} إلى السلة` 
        : `${productName} added to cart`,
      {
        icon: '🛒',
      }
    );
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${productName} للمفضلة` 
        : `${productName} added to wishlist`,
      {
        icon: '❤️',
      }
    );
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700"
      >
        {/* Product Image */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={productName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-80">
                {getProductEmoji(product.category)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discount && product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
            {product.stock !== undefined && product.stock === 0 && (
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FiHeart className="w-5 h-5 text-red-500" />
          </motion.button>

          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>{language === 'ar' ? 'أضف للسلة' : 'Quick Add'}</span>
            </motion.button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
            {product.brand}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
            {productName}
          </h3>

          {/* Description */}
          {productDescription && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {productDescription}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {product.reviews && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.reviews})
                </span>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {product.price.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.unit}
              </span>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="text-xs">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    {language === 'ar' ? 'متوفر' : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 shadow-md hover:shadow-lg"
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>
              {product.stock === 0
                ? language === 'ar'
                  ? 'غير متوفر'
                  : 'Out of Stock'
                : language === 'ar'
                ? 'أضف للسلة'
                : 'Add to Cart'}
            </span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
