'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiFolder, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiCpu, 
  FiImage, 
  FiDatabase,
  FiArrowRight,
  FiTrendingUp,
  FiCheckCircle
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageProvider';

export default function AdminDashboard() {
  const { language, isRTL } = useLanguage();

  const adminModules = [
    {
      title: language === 'ar' ? 'إدارة المنتجات' : 'Product Management',
      description: language === 'ar' ? 'إضافة وتعديل وحذف المنتجات وضبط الأسعار والمخزون' : 'Add, edit, delete products and adjust pricing/stock',
      href: '/admin/products',
      icon: FiPackage,
      color: 'from-blue-500 to-indigo-600',
      permission: 'products'
    },
    {
      title: language === 'ar' ? 'توليد الصور بالذكاء الاصطناعي' : 'AI Image Generation',
      description: language === 'ar' ? 'توليد صور المنتجات دفعة واحدة باستخدام نماذج الذكاء الاصطناعي' : 'Generate product images in bulk using AI models',
      href: '/admin/bulk-ai-generate',
      icon: FiCpu,
      color: 'from-purple-500 to-pink-600',
      permission: 'products'
    },
    {
      title: language === 'ar' ? 'إدارة صور Cloudinary' : 'Cloudinary Image Management',
      description: language === 'ar' ? 'استعراض وإدارة جميع الصور المرفوعة وتحسينها' : 'Browse, manage, and optimize all uploaded images',
      href: '/admin/images',
      icon: FiImage,
      color: 'from-cyan-500 to-blue-600',
      permission: 'products'
    },
    {
      title: language === 'ar' ? 'إدارة الفئات (قريباً)' : 'Category Management (Soon)',
      description: language === 'ar' ? 'إدارة فئات السوبرماركت والتصنيفات المختلفة' : 'Manage supermarket categories and classifications',
      href: '#',
      icon: FiFolder,
      color: 'from-emerald-500 to-teal-600',
      permission: 'categories',
      disabled: true
    },
    {
      title: language === 'ar' ? 'إدارة الطلبات (قريباً)' : 'Order Management (Soon)',
      description: language === 'ar' ? 'متابعة وتحديث حالات طلبات العملاء والتوصيل' : 'Track and update customer order statuses and delivery',
      href: '#',
      icon: FiShoppingBag,
      color: 'from-orange-500 to-red-600',
      permission: 'orders',
      disabled: true
    },
    {
      title: language === 'ar' ? 'إدارة المستخدمين (قريباً)' : 'User Management (Soon)',
      description: language === 'ar' ? 'إدارة حسابات المستخدمين وصلاحيات الأدوار والمدراء' : 'Manage user accounts, roles, and admin permissions',
      href: '#',
      icon: FiUsers,
      color: 'from-pink-500 to-rose-600',
      permission: 'users',
      disabled: true
    },
    {
      title: language === 'ar' ? 'الإعدادات والتهيئة (قريباً)' : 'Settings & Seed (Soon)',
      description: language === 'ar' ? 'إعدادات متجر السوبر ماركت وتعبئة البيانات الأولية' : 'Configure supermarket settings and load seed data',
      href: '#',
      icon: FiSettings,
      color: 'from-gray-600 to-slate-800',
      permission: 'settings',
      disabled: true
    }
  ];

  const stats = [
    { label: language === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue', value: '$12,450', growth: '+15.3%', icon: FiTrendingUp, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { label: language === 'ar' ? 'المنتجات النشطة' : 'Active Products', value: '184', growth: '+4.2%', icon: FiPackage, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: language === 'ar' ? 'الطلبات المكتملة' : 'Completed Orders', value: '412', growth: '+22.1%', icon: FiCheckCircle, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { label: language === 'ar' ? 'المستخدمين الجدد' : 'New Users', value: '89', growth: '+8.7%', icon: FiUsers, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left rtl:md:text-right">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-400 dark:to-teal-500"
          >
            {language === 'ar' ? 'لوحة تحكم المدير' : 'Admin Control Panel'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-600 dark:text-gray-400"
          >
            {language === 'ar' 
              ? 'مرحباً بك في المركز الإداري لسوبر ماركت باندا. تصفح وأدِر الأقسام أدناه.' 
              : 'Welcome back to the Panda Market administration hub. Select a management module below.'}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
                <span className="text-xs text-green-500 font-semibold mt-2 inline-block">{stat.growth}</span>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modules Grid */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          {language === 'ar' ? 'الأقسام الإدارية والتحكم' : 'Management Modules'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminModules.map((module, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: module.disabled ? 0 : -5 }}
              className={`relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-64 ${
                module.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Icon & Title */}
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${module.color} flex items-center justify-center text-white mb-6 shadow-md`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{module.description}</p>
              </div>

              {/* Bottom Link Action */}
              {!module.disabled ? (
                <Link href={module.href} className="mt-6 flex items-center text-green-600 dark:text-green-400 font-semibold text-sm hover:underline space-x-1 rtl:space-x-reverse">
                  <span>{language === 'ar' ? 'دخول القسم' : 'Open Module'}</span>
                  <FiArrowRight className={`w-4 h-4 transform ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              ) : (
                <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 font-medium italic">
                  {language === 'ar' ? 'مغلق مؤقتاً' : 'Currently Unavailable'}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
