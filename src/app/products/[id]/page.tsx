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
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { addToCart, updateQuantity } from "../../../store/cartSlice";
import { useLanguage } from "../../../contexts/LanguageProvider";
import { getProductById } from "../../../data/products";
import { Product } from "../../../store/cartSlice";
import ProductReviews from "../../../components/ProductReviews";
import Link from "next/link";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const params = useParams();
  const { language, isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
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

  // ✅ اختيار الاسم والوصف حسب اللغة
  const productName = language === "ar" ? product.name : product.nameEn;
  const productDescription =
    language === "ar" ? product.description : product.descriptionEn;

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

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
    setQuantity(1); // ✅ إعادة تعيين الكمية
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) return;

    // ✅ التحقق من المخزون
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
    setIsWishlisted(!isWishlisted);
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
              className="hover:text-green-600 dark:hover:text-green-400"
            >
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link
              href="/categories"
              className="hover:text-green-600 dark:hover:text-green-400"
            >
              {language === "ar" ? "المنتجات" : "Products"}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{productName}</span>
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
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-9xl">
                  {getProductEmoji(product.category)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-green-500"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl">
                      {getProductEmoji(product.category)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {product.brand}
              </p>
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
                <span className="text-4xl font-bold text-green-600">
                  {product.price.toFixed(2)} {language === "ar" ? "ج.م" : "EGP"}
                </span>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <span className="text-xl text-gray-400 line-through">
                      {product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
              </div>

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

            {/* Quantity Selector & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
    {language === 'ar' ? 'الكمية:' : 'Quantity:'}
  </span>
  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
    <button 
      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
      className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
      disabled={quantity <= 1}
      aria-label="Decrease quantity"
    >
      <FiMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
    <span className="px-3 py-1.5 sm:px-4 sm:py-2 min-w-[50px] sm:min-w-[60px] text-center font-medium text-sm sm:text-base text-gray-900 dark:text-white">
      {quantity}
    </span>
    <button 
      onClick={() => setQuantity(quantity + 1)} 
      className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
      disabled={product.stock !== undefined && quantity >= product.stock}
      aria-label="Increase quantity"
    >
      <FiPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  </div>
</div>


              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>{language === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    isWishlisted
                      ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <FiHeart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {/* In Cart Indicator */}
              {currentQuantity > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {language === "ar" ? "في السلة:" : "In Cart:"}{" "}
                      {currentQuantity}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(currentQuantity - 1)
                        }
                        className="p-1 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(currentQuantity + 1)
                        }
                        className="p-1 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
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
