'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiCoffee, 
  FiStar, 
  FiPackage, 
  FiDroplet, 
  FiShoppingBag, 
} from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageProvider';

const CategoryGrid = () => {
  const { language, isRTL } = useLanguage();

  const categories = [
    {
      id: 'bakery',
      name: language === 'ar' ? 'المخبوزات' : 'Bakery',
      icon: FiCoffee,
      emoji: '🍞',
      href: '/categories/bakery',
      color: 'from-orange-400 to-orange-600',
      description: language === 'ar' ? 'خبز طازج وحلويات لذيذة' : 'Fresh bread and delicious pastries'
    },
    {
      id: 'spices',
      name: language === 'ar' ? 'التوابل' : 'Spices',
      icon: FiStar,
      emoji: '🌶️',
      href: '/categories/spices',
      color: 'from-red-400 to-red-600',
      description: language === 'ar' ? 'توابل عطرية ومذاقات مميزة' : 'Aromatic spices and unique flavors'
    },
    {
      id: 'dry-grocery',
      name: language === 'ar' ? 'البقالة الجافة' : 'Dry Grocery',
      icon: FiPackage,
      emoji: '🥫',
      href: '/categories/dry-grocery',
      color: 'from-yellow-400 to-yellow-600',
      description: language === 'ar' ? 'أرز ومعكرونة وحبوب متنوعة' : 'Rice, pasta, and various grains'
    },
    {
      id: 'cleaning',
      name: language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products',
      icon: FiDroplet,
      emoji: '🧹',
      href: '/categories/cleaning',
      color: 'from-blue-400 to-blue-600',
      description: language === 'ar' ? 'منتجات نظافة عالية الجودة' : 'High-quality cleaning products'
    },
    {
      id: 'bazaar',
      name: language === 'ar' ? 'البازار' : 'Bazaar',
      icon: FiShoppingBag,
      emoji: '🛍️',
      href: '/categories/bazaar',
      color: 'from-purple-400 to-purple-600',
      description: language === 'ar' ? 'منتجات متنوعة وأسعار مميزة' : 'Varied products and special prices'
    },
    {
      id: 'vegetables',
      name: language === 'ar' ? 'الخضروات' : 'Vegetables',
      emoji: '🥬',
      href: '/categories/vegetables',
      color: 'from-green-400 to-green-600',
      description: language === 'ar' ? 'خضروات طازجة من الحقل' : 'Fresh vegetables from the farm'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={category.href}>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-6">
                {/* Icon with Emoji */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon ? (
                    <category.icon className="w-8 h-8 text-white" />
                  ) : (
                    <span className="text-3xl">{category.emoji}</span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className={`flex items-center text-green-600 dark:text-green-400 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform duration-300`}>
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  </span>
                  {isRTL ? (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryGrid;
