'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageProvider';

const CategoryGrid = () => {
  const { language, isRTL } = useLanguage();

  const categories = [
    {
      id: 'bakery',
      name: language === 'ar' ? 'المخبوزات' : 'Bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      href: '/categories/bakery',
      color: 'from-orange-500/80 to-orange-700/80',
      description: language === 'ar' ? 'خبز طازج وحلويات لذيذة' : 'Fresh bread and delicious pastries'
    },
    {
      id: 'spices',
      name: language === 'ar' ? 'التوابل' : 'Spices',
      image: 'https://images.unsplash.com/photo-1596040033229-a0b3b1c70c8b?w=800',
      href: '/categories/spices',
      color: 'from-red-500/80 to-red-700/80',
      description: language === 'ar' ? 'توابل عطرية ومذاقات مميزة' : 'Aromatic spices and unique flavors'
    },
    {
      id: 'dry-grocery',
      name: language === 'ar' ? 'البقالة الجافة' : 'Dry Grocery',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
      href: '/categories/dry-grocery',
      color: 'from-yellow-500/80 to-yellow-700/80',
      description: language === 'ar' ? 'أرز ومعكرونة وحبوب متنوعة' : 'Rice, pasta, and various grains'
    },
    {
      id: 'cleaning',
      name: language === 'ar' ? 'منتجات التنظيف' : 'Cleaning Products',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
      href: '/categories/cleaning',
      color: 'from-blue-500/80 to-blue-700/80',
      description: language === 'ar' ? 'منتجات نظافة عالية الجودة' : 'High-quality cleaning products'
    },
    {
      id: 'grocery',
      name: language === 'ar' ? 'البازار' : 'Bazaar',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      href: '/categories/grocery',
      color: 'from-purple-500/80 to-purple-700/80',
      description: language === 'ar' ? 'منتجات متنوعة وأسعار مميزة' : 'Varied products and special prices'
    },
    {
      id: 'vegetables',
      name: language === 'ar' ? 'الخضروات' : 'Vegetables',
      image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800',
      href: '/categories/vegetables',
      color: 'from-green-500/80 to-green-700/80',
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
            <div className="relative h-64 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer">
              {/* Background Image with Hover Scale */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              ></div>
              
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-100`}></div>
              
              {/* Dynamic Color Border (on hover) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

              <div className="relative h-full p-6 flex flex-col justify-end">
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                  {category.name}
                </h3>
                
                <p className="text-gray-200 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {category.description}
                </p>

                {/* Arrow & Call to Action */}
                <div className={`flex items-center text-white font-semibold transition-transform duration-300 group-hover:${isRTL ? '-translate-x-2' : 'translate-x-2'}`}>
                  <span className="text-sm">
                    {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  </span>
                  {isRTL ? (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Glassmorphism Border line on hover */}
              <div className="absolute inset-0 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryGrid;
