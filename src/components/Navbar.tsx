'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import style from './Navbar.module.css';
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon,
  FiGlobe,
  FiHome,
  FiInfo,
  FiBookOpen,
  FiMail,
  FiGrid,
  FiLogIn,
  FiUserPlus,
  FiHeart,
  FiPackage
} from 'react-icons/fi';
import { useAppSelector } from '@/hooks/redux';
import { useTheme } from '@/contexts/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useWishlist } from '@/contexts/WishlistProvider';
import { useAuth } from '@/contexts/AuthProvider';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { href: '/', icon: FiHome, text: language === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/about', icon: FiInfo, text: language === 'ar' ? 'من نحن' : 'About' },
    { href: '/blog', icon: FiBookOpen, text: language === 'ar' ? 'المدونة' : 'Blog' },
    { href: '/contact', icon: FiMail, text: language === 'ar' ? 'اتصل بنا' : 'Contact' },
    { href: '/categories', icon: FiGrid, text: language === 'ar' ? 'الفئات' : 'Categories' },
    ...(user ? [{ href: '/orders', icon: FiPackage, text: language === 'ar' ? 'طلباتي' : 'My Orders' }] : []),
  ];

  const authItems = [
    { href: '/login', icon: FiLogIn, text: language === 'ar' ? 'تسجيل الدخول' : 'Login' },
    { href: '/signup', icon: FiUserPlus, text: language === 'ar' ? 'إنشاء حساب' : 'Sign Up' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-centerspace-x-2 rtl:space-x-reverse">
             
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {language === 'ar' ? 'سوبر ماركت باندا' : 'Panda market'}
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="  hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${style.navLink} flex items-center space-x-1 rtl:space-x-reverse text-gray-700 dark:text-gray-300 hover:text-bl-600 dark:hover:text-bl-400 transition-colors duration-200`}
              >
                <span>{item.text}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden  md:flex  space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <FiGlobe className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'التبديل إلى الوضع الفاتح'}
            >
              {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
          

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg bg-bl-100 dark:bg-bl-900 text-bl-700 dark:text-bl-300 hover:bg-bl-200 dark:hover:bg-bl-800 transition-colors duration-200"
            >
              <FiShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Auth Links */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {user ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {language === 'ar' ? `مرحباً، ${user.firstName}` : `Hi, ${user.firstName}`}
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-sm"
                  >
                    {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </div>
              ) : (
                authItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.text}</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <FiGlobe className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
            >
              <FiHeart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2 rounded-lg bg-bl-100 dark:bg-bl-900 text-bl-700 dark:text-bl-300"
            >
              <FiShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                {user ? (
                  <div className="px-4 py-2">
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? `مرحباً، ${user.firstName}` : `Hi, ${user.firstName}`}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                ) : (
                  authItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.text}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
