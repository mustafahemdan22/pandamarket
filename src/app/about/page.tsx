'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageProvider';

const AboutPage = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: FiTarget,
      title: language === 'ar' ? 'رؤيتنا' : 'Our Vision',
      description: language === 'ar' 
        ? 'أن نكون الوجهة الأولى للبقالة الطازجة والجودة العالية في المنطقة' 
        : 'To be the leading destination for fresh groceries and high-quality products in the region'
    },
    {
      icon: FiUsers,
      title: language === 'ar' ? 'رسالتنا' : 'Our Mission',
      description: language === 'ar' 
        ? 'توفير أفضل المنتجات الطازجة مع خدمة عملاء استثنائية' 
        : 'Providing the freshest products with exceptional customer service'
    },
    {
      icon: FiAward,
      title: language === 'ar' ? 'جودتنا' : 'Our Quality',
      description: language === 'ar' 
        ? 'نحن ملتزمون بأعلى معايير الجودة في جميع منتجاتنا' 
        : 'We are committed to the highest quality standards in all our products'
    },
    {
      icon: FiHeart,
      title: language === 'ar' ? 'قيمنا' : 'Our Values',
      description: language === 'ar' 
        ? 'الصدق والشفافية والالتزام برضا العملاء' 
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
              ? 'سوبر ماركت باندا هو أكثر من مجرد متجر بقالة. نحن عائلة ملتزمة بتقديم أفضل المنتجات الطازجة والجودة العالية لعملائنا الكرام.' 
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
                  ? 'بدأت رحلتنا منذ أكثر من عقد من الزمان بهدف بسيط: توفير المنتجات الطازجة والجودة العالية لعائلاتنا وجيراننا. اليوم، نحن فخورون بأن نكون جزءاً من المجتمع.' 
                  : 'Our journey began over a decade ago with a simple goal: to provide fresh, high-quality products for our families and neighbors. Today, we are proud to be part of the community.'
                }
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' 
                  ? 'نحن نؤمن بأن كل عائلة تستحق الحصول على أفضل المنتجات بأسعار معقولة، ولهذا نسعى جاهدين لتقديم ذلك يومياً.' 
                  : 'We believe every family deserves access to the best products at affordable prices, and that\'s what we strive to deliver every day.'
                }
              </p>
            </div>
            <div className="h-80 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-8xl">🐼</span>
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
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <value.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'ar' ? 'فريقنا' : 'Our Team'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'فريقنا المتفاني من المهنيين يعمل بجد لضمان حصولك على أفضل تجربة تسوق ممكنة. نحن هنا لمساعدتك في العثور على ما تحتاجه.' 
              : 'Our dedicated team of professionals works hard to ensure you have the best shopping experience possible. We are here to help you find what you need.'
            }
          </p>
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
