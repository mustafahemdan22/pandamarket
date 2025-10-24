'use client';

import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiClock, FiHeart } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';

const FeaturesSection = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: FiTruck,
      title: language === 'ar' ? 'توصيل سريع' : 'Fast Delivery',
      description: language === 'ar' 
        ? 'توصيل مجاني خلال 24 ساعة لجميع الطلبات' 
        : 'Free delivery within 24 hours for all orders'
    },
    {
      icon: FiShield,
      title: language === 'ar' ? 'جودة مضمونة' : 'Quality Guaranteed',
      description: language === 'ar' 
        ? 'جميع منتجاتنا طازجة ومضمونة الجودة' 
        : 'All our products are fresh and quality guaranteed'
    },
    {
      icon: FiClock,
      title: language === 'ar' ? 'متاح 24/7' : 'Available 24/7',
      description: language === 'ar' 
        ? 'خدمتنا متاحة على مدار الساعة' 
        : 'Our service is available around the clock'
    },
    {
      icon: FiHeart,
      title: language === 'ar' ? 'خدمة عملاء ممتازة' : 'Excellent Service',
      description: language === 'ar' 
        ? 'فريق خدمة العملاء متاح لمساعدتك دائماً' 
        : 'Customer service team is always available to help you'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'لماذا تختار باندا؟' : 'Why Choose Panda?'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'نحن ملتزمون بتقديم أفضل تجربة تسوق لعملائنا الكرام' 
              : 'We are committed to providing the best shopping experience for our valued customers'
            }
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-white transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
