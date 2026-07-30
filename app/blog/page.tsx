'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageProvider';
import { BLOG_IMAGES, FALLBACK_IMAGE_PATH, CLOUDINARY_CLOUD_NAME } from '../../lib/imageConfig';
import { useState } from 'react';

const BlogPage = () => {
  const { language } = useLanguage();

  const getBlogImgSrc = (key: keyof typeof BLOG_IMAGES) =>
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_500,c_fill,q_auto,f_auto/${BLOG_IMAGES[key]}`;

  const posts = [
    {
      id: 1,
      title: language === 'ar' ? 'نصائح للتسوق الذكي في السوبر ماركت' : 'Smart Shopping Tips at the Supermarket',
      excerpt: language === 'ar'
        ? 'تعرف على أفضل الطرق لتوفير المال أثناء التسوق وشراء منتجات عالية الجودة.'
        : 'Learn how to save money while buying high-quality groceries.',
      imageKey: 'smartShopping' as const,
      href: '/blog/smart-shopping'
    },
    {
      id: 2,
      title: language === 'ar' ? 'أهمية المنتجات الطازجة في نظامك الغذائي' : 'The Importance of Fresh Produce in Your Diet',
      excerpt: language === 'ar'
        ? 'الفواكه والخضروات الطازجة جزء أساسي من حياة صحية متوازنة.'
        : 'Fresh fruits and vegetables are essential for a healthy, balanced life.',
      imageKey: 'freshProduce' as const,
      href: '/blog/fresh-produce'
    },
    {
      id: 3,
      title: language === 'ar' ? 'أفضل طرق تخزين الطعام للحفاظ على الجودة' : 'Best Food Storage Methods to Maintain Quality',
      excerpt: language === 'ar'
        ? 'تعلم كيف تحفظ أكلك بشكل صحيح عشان يفضل طازج أطول فترة.'
        : 'Learn how to properly store food to keep it fresh longer.',
      imageKey: 'foodStorage' as const,
      href: '/blog/food-storage'
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'المدونة' : 'Blog'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'نصائح ومعلومات مفيدة حول التسوق الصحي المنتجات الطازجة'
              : 'Useful tips and information about healthy shopping and fresh products'}
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} language={language} getImgSrc={getBlogImgSrc} />
          ))}
        </div>
      </div>
    </div>
  );
};

function BlogCard({ post, index, language, getImgSrc }: {
  post: { id: number; title: string; excerpt: string; imageKey: keyof typeof BLOG_IMAGES; href: string };
  index: number;
  language: string;
  getImgSrc: (key: keyof typeof BLOG_IMAGES) => string;
}) {
  const [imgSrc, setImgSrc] = useState<string>(getImgSrc(post.imageKey));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={post.href}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgSrc(FALLBACK_IMAGE_PATH)}
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default BlogPage;
