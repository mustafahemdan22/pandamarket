"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingBag, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageProvider";
import style from "./HeroSection.module.css";
import Image from "next/image";
import img from "./ChatGPT Image Oct 21, 2025, 07_32_49 PM.png"; // أو المسار بتاع الصورة

const HeroSection = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section
      className={`${style.heroSection} text-white py-20 lg:py-32 overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div
        className={`${style.heroContent} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isRTL ? "lg:order-2" : ""}`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              {language === "ar" ? (
                <>
                  مرحباً بك في{" "}
                  <span className="text-green-500">سوبر ماركت باندا</span>
                </>
              ) : (
                <>
                  Welcome to{" "}
                  <span className="text-green-500">Panda Supermarket</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-green-100 leading-relaxed"
            >
              {language === "ar"
                ? "وجهتك الوحيدة للبقالة الطازجة والضروريات اليومية بجودة عالية وأسعار منافسة"
                : "Your one-stop shop for fresh groceries and everyday essentials with high quality and competitive prices"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FiShoppingBag className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === "ar" ? "تسوق الآن" : "Shop Now"}
                {isRTL ? (
                  <FiArrowLeft className="w-5 h-5 ml-2" />
                ) : (
                  <FiArrowRight className="w-5 h-5 ml-2" />
                )}
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                {language === "ar" ? "اعرف المزيد" : "Learn More"}
              </Link>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${isRTL ? "lg:order-1" : ""}`}
          >
            <div className="relative">
              {/* Panda Character */}
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-64 h-64 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center"
              >
                <Image
                  src={img}
                  alt="description"
                  width={256}
                  height={256}
                  className="w-64 h-64 rounded-full object-cover"
                />{" "}
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4  flex items-center justify-center shadow-lg"
              >
                <span className="text-5xl">🥕</span>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 flex items-center justify-center shadow-lg"
              >
                <span className="text-5xl">🍊</span>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute top-1/2 -left-8 flex items-center justify-center shadow-lg"
              >
                <span className="text-5xl">🍎</span>
              </motion.div>
              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/2 -right-8 w-20 h-20  flex items-center justify-center "
              >
               <span className="text-5xl">🍎</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 fill-current text-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
