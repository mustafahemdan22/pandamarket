'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageProvider';
import img from "../Phoenix_10_A_cute_panda_mother_with_her_two_baby_pandas_shoppi_3.jpg";
import Image from "next/image";

const AboutPage = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: FiTarget,
      title: language === 'ar' ? 'رؤيتنا' : 'Our Vision',
      description: language === 'ar' 
        ? 'نهدف دايمًا نكون المكان المفضل لكل عيلة تدور على منتجات طازجة وجودة عالية بأسعار مناسبة.' 
        : 'To be the leading destination for fresh groceries and high-quality products in the region'
    },
    {
      icon: FiUsers,
      title: language === 'ar' ? 'رسالتنا' : 'Our Mission',
      description: language === 'ar' 
        ? 'نوفر أفضل المنتجات الطازجة بخدمة مميزة تخلي التسوق تجربة ممتعة وسهلة.' 
        : 'Providing the freshest products with exceptional customer service'
    },
    {
      icon: FiAward,
      title: language === 'ar' ? 'جودتنا' : 'Our Quality',
      description: language === 'ar' 
        ? 'نهتم بكل تفصيلة في المنتج عشان نضمن دايمًا الجودة اللي تستحقها.' 
        : 'We are committed to the highest quality standards in all our products'
    },
    {
      icon: FiHeart,
      title: language === 'ar' ? 'قيمنا' : 'Our Values',
      description: language === 'ar' 
        ? 'الصدق، الاحترام، ورضا العميل هما الأساس في شغلنا كل يوم.' 
        : 'Honesty, transparency, and commitment to customer satisfaction'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'من نحن' : 'About Us'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'سوبر ماركت باندا بقاله أكتر من 6 سنين بيخدم العائلات بكل حب. مش مجرد مكان للتسوق، إحنا عيلة واحدة هدفها تقدم الأفضل لعملائنا كل يوم.' 
              : 'Panda Supermarket is more than just a grocery store. We are a family committed to providing the freshest products and highest quality for our valued customers.'
            }
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'ar' ? 'قصتنا' : 'Our Story'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {language === 'ar' 
                  ? 'بدأنا مشوارنا من حوالي 6 سنين بهدف بسيط: نوصل المنتجات الطازجة والجودة العالية لكل بيت. ومع الوقت، كبرنا بفضل ثقة الناس فينا.' 
                  : 'Our journey began over a decade ago with a simple goal: to provide fresh, high-quality products for our families and neighbors. Today, we are proud to be part of the community.'
                }
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' 
                  ? 'إيماننا دايمًا إن كل زبون يستحق أفضل جودة وأحسن سعر، وده اللي بنحاول نحققه كل يوم.' 
                  : 'We believe every family deserves access to the best products at affordable prices, and that\'s what we strive to deliver every day.'
                }
              </p>
            </div>
            <div className="relative h-80 w-full">
              <Image 
                src={img} 
                alt="Panda" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]"></div>
            </div>
          </div>
        </motion.div>

       {/* Values Grid */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
>
  {values.map((value, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: "easeInOut" }}
whileHover={{ boxShadow: "0 0 25px rgba(34,197,94,0.5)" }}
      className="relative group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[280px] flex flex-col items-center justify-start"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
        <value.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {value.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center transition-all duration-500 line-clamp-3 group-hover:line-clamp-none group-hover:mt-2">
        {value.description}
      </p>

      {/* Overlay effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        className="absolute inset-0 bg-green-600 rounded-2xl pointer-events-none transition-opacity duration-500"
      />
    </motion.div>
  ))}
</motion.div>

      
      </div>
    </div>
  );
};

export default AboutPage;
