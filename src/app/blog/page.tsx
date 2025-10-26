'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageProvider';

const BlogPage = () => {
  const { language } = useLanguage();

  const posts = [
    {
      id: 1,
      title: language === 'ar' ? 'نصائح للتسوق الذكي في السوبر ماركت' : 'Smart Shopping Tips at the Supermarket',
      excerpt: language === 'ar'
        ? 'تعرف على أفضل الطرق لتوفير المال أثناء التسوق وشراء منتجات عالية الجودة.'
        : 'Learn how to save money while buying high-quality groceries.',
      image: '/images/blog1.jpg',
      href: '/blog/smart-shopping'
    },
    {
      id: 2,
      title: language === 'ar' ? 'أهمية المنتجات الطازجة في نظامك الغذائي' : 'The Importance of Fresh Produce in Your Diet',
      excerpt: language === 'ar'
        ? 'الفواكه والخضروات الطازجة جزء أساسي من حياة صحية متوازنة.'
        : 'Fresh fruits and vegetables are essential for a healthy, balanced life.',
      image: '/images/blog2.jpg',
      href: '/blog/fresh-produce'
    },
    {
      id: 3,
      title: language === 'ar' ? 'طرق تخزين الأطعمة للحفاظ على جودتها' : 'How to Store Food and Keep It Fresh',
      excerpt: language === 'ar'
        ? 'تعرف على الطرق المثلى لتخزين الطعام والحفاظ على نكهته وجودته لأطول فترة.'
        : 'Discover the best ways to store food and preserve its freshness.',
      image: '/images/blog3.jpg',
      href: '/blog/food-storage'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'مدونتنا' : 'Our Blog'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اقرأ أحدث المقالات والنصائح حول التسوق، التغذية، والعناية بالمنزل.'
              : 'Read our latest articles and tips about shopping, nutrition, and home care.'}
          </p>
        </motion.div>

        {/* Blog Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="text-green-600 font-medium hover:underline"
                >
                  {language === 'ar' ? 'اقرأ المزيد →' : 'Read More →'}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
