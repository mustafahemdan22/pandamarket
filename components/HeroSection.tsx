"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingBag, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageProvider";
import style from "./HeroSection.module.css";
import Image from "next/image";
import { FALLBACK_IMAGE_PATH, HERO_IMAGE_PUBLIC_ID, CLOUDINARY_CLOUD_NAME } from "../lib/imageConfig";
import { useState } from "react";

const HeroSection = () => {
  const { language, isRTL } = useLanguage();
  const [heroImgSrc, setHeroImgSrc] = useState<string>(
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_256,h_256,c_fill,q_auto,f_auto/${HERO_IMAGE_PUBLIC_ID}`
  );

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
                  <span className={style.span}>سوبر ماركت باندا</span>
                </>
              ) : (
                <>
                  Welcome to{" "}
                  <span className={style.span}>Panda Supermarket</span>
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
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-200  hover:shadow-xl transform hover:-translate-y-1"
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
                className="w-64 h-64 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={heroImgSrc}
                  alt="Panda Supermarket Mascot"
                  width={256}
                  height={256}
                  className="w-64 h-64 rounded-full object-cover"
                  onError={() => setHeroImgSrc(FALLBACK_IMAGE_PATH)}
                />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4  flex items-center justify-center "
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
                className="absolute -bottom-4 -left-4 flex items-center justify-center "
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
                className="absolute top-1/16 start-32 flex items-center justify-center "
              >
                <span className="text-5xl">🥕</span>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute top-5 -left-8 flex items-center justify-center "
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
    </section>
  );
};

export default HeroSection;
