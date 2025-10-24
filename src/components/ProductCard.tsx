'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/store/cartSlice';
import { useAppDispatch } from '@/hooks/redux';
import { addToCart } from '@/store/cartSlice';
import { FiShoppingCart, FiPlus } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { language } = useLanguage();

  const getProductEmoji = (category: string, name: string) => {
    const lowerName = name.toLowerCase();
    
    // Bakery
    if (category === 'bakery') {
      if (lowerName.includes('bread')) return '🍞';
      if (lowerName.includes('croissant')) return '🥐';
      if (lowerName.includes('cake')) return '🍰';
      return '🥖';
    }
    
    // Spices
    if (category === 'spices') {
      if (lowerName.includes('pepper')) return '🫚';
      if (lowerName.includes('cumin')) return '🌿';
      if (lowerName.includes('turmeric')) return '🟡';
      return '🧂';
    }
    
    // Dry Grocery
    if (category === 'dry-grocery') {
      if (lowerName.includes('rice')) return '🍚';
      if (lowerName.includes('pasta')) return '🍝';
      if (lowerName.includes('lentil')) return '🫘';
      return '🌾';
    }
    
    // Cleaning Products
    if (category === 'cleaning') {
      if (lowerName.includes('soap')) return '🧼';
      if (lowerName.includes('detergent')) return '🧴';
      if (lowerName.includes('cleaner')) return '🧽';
      return '🧹';
    }
    
    // Bazaar
    if (category === 'bazaar') {
      if (lowerName.includes('oil')) return '🫒';
      if (lowerName.includes('honey')) return '🍯';
      if (lowerName.includes('nut')) return '🥜';
      return '🛍️';
    }
    
    // Vegetables
    if (category === 'vegetables') {
      if (lowerName.includes('tomato')) return '🍅';
      if (lowerName.includes('carrot')) return '🥕';
      if (lowerName.includes('pepper')) return '🫑';
      if (lowerName.includes('spinach')) return '🥬';
      if (lowerName.includes('onion')) return '🧅';
      return '🥬';
    }
    
    return '🛒';
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${product.name} إلى السلة` 
        : `${product.name} added to cart`
    );
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-80">{getProductEmoji(product.category, product.name)}</span>
        </div>
        
        {/* Add to Cart Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse hover:bg-green-700"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>{language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </div>
          
          {product.stock && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  {language === 'ar' ? 'متوفر' : 'In Stock'}
                </span>
              ) : (
                <span className="text-red-600">
                  {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <FiPlus className="w-4 h-4" />
          <span>{language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
        </button>
      </div>
    </motion.div>
    </Link>
  );
};

export default ProductCard;
