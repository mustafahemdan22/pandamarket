"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiArrowUp,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageProvider";

import React from 'react';



import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const { language } = useLanguage();

  if (pathname.startsWith('/admin')) return null;

  const quickLinks = [
    { href: "/", text: language === "ar" ? "الرئيسية" : "Home" },
    { href: "/about", text: language === "ar" ? "من نحن" : "About" },
    { href: "/blog", text: language === "ar" ? "المدونة" : "Blog" },
    { href: "/contact", text: language === "ar" ? "اتصل بنا" : "Contact Us" },
    { href: "/categories", text: language === "ar" ? "الفئات" : "Categories" },
  ];

  const categories = [
    {
      href: "/categories/bakery",
      text: language === "ar" ? "المخبوزات" : "Bakery",
    },
    {
      href: "/categories/spices",
      text: language === "ar" ? "التوابل" : "Spices",
    },
    {
      href: "/categories/dry-grocery",
      text: language === "ar" ? "البقالة الجافة" : "Dry Grocery",
    },
    {
      href: "/categories/cleaning",
      text: language === "ar" ? "منتجات التنظيف" : "Cleaning Products",
    },
    {
      href: "/categories/bazaar",
      text: language === "ar" ? "البازار" : "Bazaar",
    },
    {
      href: "/categories/vegetables",
      text: language === "ar" ? "الخضروات" : "Vegetables",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐼</span>
              </div>
              <span className="text-xl font-bold">
                {language === "ar" ? "سوبر ماركت باندا" : "Panda Supermarket"}
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              {language === "ar"
                ? "شريكك الموثوق في البقالة - نوفر لك أفضل المنتجات الطازجة والجودة العالية"
                : "Your trusted grocery partner - providing fresh products and high quality items"}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a
                href="https://www.facebook.com/marketpanda337"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={language === "ar" ? "فيسبوك" : "Facebook"}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FiFacebook className="w-5 h-5" />
              </a>

              <a
                href="https://wa.me/201129862523"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={language === "ar" ? "واتساب" : "WhatsApp"}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaWhatsapp className="w-5 h-5 text-green-500" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "الفئات" : "Categories"}
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {category.text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "معلومات الاتصال" : "Contact Info"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FiMapPin className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-400">
                  {language === "ar"
                    ? "الإبراهيمية، 15 شارع حلمي بهجت، الإسكندرية"
                    : "15 Helmy Bahgat Street, Al Ibrahimeya, Alexandria"}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FiPhone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-400">00201129862523</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FiMail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-400">marketpanda337@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">
            {language === "ar"
              ? "© 2025 سوبر ماركت باندا. تصميم وبرمجة: مصطفى حمدان."
              : "© 2025 Panda Supermarket. Designed & Developed by Mustafa Hemdan."}
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center space-x-2 rtl:space-x-reverse text-green-500 hover:text-green-400 transition-colors duration-200"
          >
            <span>{language === "ar" ? "العودة للأعلى" : "Back to Top"}</span>
            <FiArrowUp className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
