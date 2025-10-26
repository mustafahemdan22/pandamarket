'use client';
import Head from "next/head";


import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiShoppingBag} from 'react-icons/fi';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import FeaturesSection from '../components/FeaturesSection';
import { useLanguage } from '../contexts/LanguageProvider';

export default function Home() {
  const { language } = useLanguage();
    <Head>
      <title>Panda Market | سوبر ماركت باندا</title>
      <meta
        name="description"
        content="Panda Market - الإبراهيمية، 15 شارع حلمي بهجت، الإسكندرية. تسوق أفضل المنتجات بأسعار مميزة."
      />
    </Head>


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'تسوق حسب الفئة' : 'Shop by Category'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اكتشف مجموعتنا الواسعة من المنتجات الطازجة والعالية الجودة' 
                : 'Discover our wide range of fresh and high-quality products'
              }
            </p>
          </motion.div>
          <CategoryGrid />
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-200 to-green-600"
>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'ar' ? 'ابدأ التسوق الآن' : 'Start Shopping Now'}
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'احصل على أفضل المنتجات بأسعار تنافسية مع خدمة توصيل سريعة' 
                : 'Get the best products at competitive prices with fast delivery service'
              }
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <FiShoppingBag className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" />
              {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
