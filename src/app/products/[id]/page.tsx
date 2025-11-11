"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiHeart,
  FiArrowLeft,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { addToCart, updateQuantity } from "../../../store/cartSlice";
import { useLanguage } from "../../../contexts/LanguageProvider";
import { useWishlist } from "../../../contexts/WishlistProvider";
import { getProductById } from "../../../data/products";
import { Product } from "../../../store/cartSlice";
import ProductReviews from "../../../components/ProductReviews";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const ProductDetailPage = () => {
  const params = useParams();
  const { language, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id as string;
        const foundProduct = getProductById(id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
              </div>
              <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-6xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ar" ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            {isRTL ? (
              <>
                {language === "ar" ? "العودة للمنتجات" : "Back to Products"}
                <FiArrowLeft className="w-5 h-5 mr-2 rotate-180" />
              </>
            ) : (
              <>
                <FiArrowLeft className="w-5 h-5 mr-2" />
                {language === "ar" ? "العودة للمنتجات" : "Back to Products"}
              </>
            )}
          </Link>
        </div>
      </div>
    );
  }

  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if (product.image) {
      return [product.image];
    }
    return [];
  };

  const productImages = getProductImages();
  const hasImages = productImages.length > 0;
  const hasMultipleImages = productImages.length > 1;

  const productName = language === "ar" ? product.name : product.nameEn;
  const productDescription =
    language === "ar" ? product.description : product.descriptionEn;

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(
      language === "ar"
        ? `تم إضافة ${quantity} من ${productName} إلى السلة`
        : `${quantity} ${productName} added to cart`,
      { icon: "🛒" }
    );
    setQuantity(1);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) return;

    if (product.stock && newQuantity > product.stock) {
      toast.error(
        language === "ar"
          ? `الحد الأقصى ${product.stock}`
          : `Maximum ${product.stock} available`
      );
      return;
    }

    dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    toast.success(
      language === "ar"
        ? isWishlisted
          ? "تم إزالة المنتج من المفضلة"
          : "تم إضافة المنتج للمفضلة"
        : isWishlisted
          ? "Removed from wishlist"
          : "Added to wishlist",
      { icon: isWishlisted ? "💔" : "❤️" }
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: productDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        language === "ar" ? "تم نسخ الرابط" : "Link copied to clipboard"
      );
    }
  };

  const getProductEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      bakery: "🍞",
      spices: "🌶️",
      "dry-grocery": "🥫",
      cleaning: "🧹",
      bazaar: "🛍️",
      vegetables: "🥬",
    };
    return emojiMap[category] || "🛒";
  };

  const features = [
    {
      icon: FiTruck,
      title: language === "ar" ? "توصيل سريع" : "Fast Delivery",
      description:
        language === "ar" ? "توصيل خلال 24 ساعة" : "Delivery within 24 hours",
    },
    {
      icon: FiShield,
      title: language === "ar" ? "جودة مضمونة" : "Quality Guaranteed",
      description:
        language === "ar"
          ? "منتجات طازجة ومضمونة"
          : "Fresh and guaranteed products",
    },
    {
      icon: FiRefreshCw,
      title: language === "ar" ? "إرجاع مجاني" : "Free Returns",
      description:
        language === "ar"
          ? "إرجاع مجاني خلال 7 أيام"
          : "Free returns within 7 days",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link
              href="/categories"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {language === "ar" ? "المنتجات" : "Products"}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {productName}
            </span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* الصورة الرئيسية */}
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden relative group">
              {hasImages && productImages[selectedImage] ? (
                <>
                  <Image
                    src={productImages[selectedImage]}
                    alt={`${productName} - ${selectedImage + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority={selectedImage === 0}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* عداد الصور */}
                  {hasMultipleImages && (
                    <div
                      className={`absolute bottom-4 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm bg-black/70 text-white z-10 ${
                        isRTL ? "left-4" : "right-4"
                      }`}
                    >
                      {selectedImage + 1} / {productImages.length}
                    </div>
                  )}

                  {/* أزرار التنقل */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          )
                        }
                        className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10 ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                        aria-label={
                          language === "ar" ? "الصورة السابقة" : "Previous image"
                        }
                      >
                        {isRTL ? (
                          <FiChevronRight className="w-6 h-6" />
                        ) : (
                          <FiChevronLeft className="w-6 h-6" />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === productImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10 ${
                          isRTL ? "left-4" : "right-4"
                        }`}
                        aria-label={
                          language === "ar" ? "الصورة التالية" : "Next image"
                        }
                      >
                        {isRTL ? (
                          <FiChevronLeft className="w-6 h-6" />
                        ) : (
                          <FiChevronRight className="w-6 h-6" />
                        )}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <span className="text-9xl opacity-80">
                    {getProductEmoji(product.category)}
                  </span>
                </div>
              )}
            </div>

            {/* الصور المصغرة */}
            {hasMultipleImages && (
              <div
                className={`grid gap-4 ${
                  productImages.length === 2
                    ? "grid-cols-2"
                    : productImages.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-4"
                }`}
              >
                {productImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 transition-all duration-200 relative ${
                      selectedImage === index
                        ? "border-green-500 ring-2 ring-green-200 dark:ring-green-900"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {productName}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (product.rating || 4)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.rating || 4.0}) • {product.reviews || 12}{" "}
                  {language === "ar" ? "تقييم" : "reviews"}
                </span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-green-600 dark:text-green-500">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>

              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                    {product.compareAtPrice.toFixed(2)}
                  </span>
                )}

              {product.stock !== undefined && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {product.stock > 0
                    ? language === "ar"
                      ? `متوفر (${product.stock})`
                      : `In Stock (${product.stock})`
                    : language === "ar"
                      ? "غير متوفر"
                      : "Out of Stock"}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {language === "ar" ? "الوصف" : "Description"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {productDescription ||
                  (language === "ar"
                    ? "لا يوجد وصف"
                    : "No description available")}
              </p>
            </div>

            {/* Quantity & Actions - باقي الكود كما هو */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language === "ar" ? "الكمية:" : "Quantity:"}
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-gray-700 dark:text-gray-300"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || Infinity, quantity + 1))
                    }
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-green-600 dark:text-green-400"
                    disabled={product.stock !== undefined && quantity >= product.stock}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed active:scale-95"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>{language === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 active:scale-95 ${
                    isWishlisted
                      ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-500 transition-all duration-200 active:scale-95"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>

              {/* In Cart Indicator */}
              {currentQuantity > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {language === "ar" ? "في السلة:" : "In Cart:"} {currentQuantity}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                        className="p-1 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700 transition-colors active:scale-95"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                        className="p-1 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700 transition-colors active:scale-95"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === "ar" ? "المميزات" : "Features"}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
