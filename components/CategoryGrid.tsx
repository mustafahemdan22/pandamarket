'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageProvider';
import { CATEGORY_IMAGES, FALLBACK_IMAGE_PATH } from '../lib/imageConfig';
import Image from 'next/image';
import { useState } from 'react';

const CategoryGrid = () => {
  const { language, isRTL } = useLanguage();

  const categories = [
    {
      id: 'produce',
      name: language === 'ar' ? 'الخضروات والفواكه' : 'Fresh Produce',
      href: '/categories/produce',
      color: 'from-green-500/80 to-green-700/80',
      description: language === 'ar' ? 'خضروات وفواكه طازجة يومياً' : 'Daily fresh vegetables and fruits'
    },
    {
      id: 'dairy',
      name: language === 'ar' ? 'الألبان والبيض' : 'Dairy & Eggs',
      href: '/categories/dairy',
      color: 'from-blue-500/80 to-blue-700/80',
      description: language === 'ar' ? 'ألبان، أجبان، وبيض طازج' : 'Fresh milk, cheese, and eggs'
    },
    {
      id: 'meat',
      name: language === 'ar' ? 'اللحوم والدواجن' : 'Meat & Poultry',
      href: '/categories/meat',
      color: 'from-red-500/80 to-red-700/80',
      description: language === 'ar' ? 'لحوم طازجة ودواجن ممتازة' : 'Premium fresh meat and poultry'
    },
    {
      id: 'pantry',
      name: language === 'ar' ? 'الأرز والبقوليات' : 'Pantry & Grains',
      href: '/categories/pantry',
      color: 'from-yellow-500/80 to-yellow-700/80',
      description: language === 'ar' ? 'أرز، مكرونة، وبقوليات أساسية' : 'Rice, pasta, and pantry essentials'
    },
    {
      id: 'condiments',
      name: language === 'ar' ? 'الزيوت والسمن' : 'Oils & Ghee',
      href: '/categories/condiments',
      color: 'from-orange-500/80 to-orange-700/80',
      description: language === 'ar' ? 'زيوت نقية، سمن طبيعي، وصلصات' : 'Pure oils, natural ghee, and sauces'
    },
    {
      id: 'cleaning',
      name: language === 'ar' ? 'المنظفات والمنزل' : 'Cleaning & Household',
      href: '/categories/cleaning',
      color: 'from-purple-500/80 to-purple-700/80',
      description: language === 'ar' ? 'منظفات وأدوات العناية المنزلية' : 'High-quality household cleaning supplies'
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
      {categories.map((category) => {
        const categoryImagePublicId = CATEGORY_IMAGES[category.id];
        return (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={category.href}>
              <div className="relative h-64 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer">
                {/* Background Image with Next.js Image component */}
                {categoryImagePublicId ? (
                  <CategoryCardImage publicId={categoryImagePublicId} alt={category.name} />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                )}
                
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
        );
      })}
    </motion.div>
  );
};

// Internal component for category card background images
function CategoryCardImage({ publicId, alt }: { publicId: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState<string>(
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfq1xxerr'}/image/upload/w_600,h_400,c_fill,q_auto,f_auto/${publicId}`
  );

  return (
    <div className="absolute inset-0">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setImgSrc(FALLBACK_IMAGE_PATH)}
      />
    </div>
  );
}

export default CategoryGrid;
