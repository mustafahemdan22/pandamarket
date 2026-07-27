'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { sampleProducts } from '../../../data/products';
import ProductCard from '../../../components/ProductCard';
import { useLanguage } from '../../../contexts/LanguageProvider';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// أسماء الفئات والأسماء المترادفة (Aliases)
const categoryNames: Record<string, { ar: string; en: string; aliases: string[] }> = {
  vegetables: { ar: 'الخضروات والفواكه', en: 'Vegetables & Fruits', aliases: ['vegetables', 'produce', 'fresh-food', 'fruits'] },
  produce: { ar: 'الخضروات والفواكه الطازجة', en: 'Fresh Produce', aliases: ['produce', 'vegetables', 'fresh-food', 'fruits'] },
  'fresh-food': { ar: 'الأطعمة الطازجة', en: 'Fresh Food', aliases: ['fresh-food', 'produce', 'vegetables', 'fruits'] },
  dairy: { ar: 'الألبان والبيض والجبن', en: 'Dairy, Eggs & Cheese', aliases: ['dairy', 'dairy-eggs', 'milk', 'cheese'] },
  'dairy-eggs': { ar: 'الألبان والبيض', en: 'Dairy & Eggs', aliases: ['dairy-eggs', 'dairy', 'milk', 'cheese'] },
  meat: { ar: 'اللحوم والدواجن', en: 'Meat & Poultry', aliases: ['meat', 'poultry', 'beef', 'chicken'] },
  frozen: { ar: 'الأغذية المجمدة', en: 'Frozen Foods', aliases: ['frozen', 'frozen-foods'] },
  pantry: { ar: 'الأرز والمكرونة والبقوليات', en: 'Pantry & Grains', aliases: ['pantry', 'rice', 'pasta', 'legumes', 'dry', 'grains'] },
  rice: { ar: 'الأرز والمعكرونة', en: 'Rice & Pasta', aliases: ['rice', 'pantry', 'pasta', 'grains'] },
  legumes: { ar: 'البقوليات', en: 'Legumes', aliases: ['legumes', 'pantry', 'grains'] },
  condiments: { ar: 'الزيوت والسمن والصلصات', en: 'Oils, Ghee & Spices', aliases: ['condiments', 'oils', 'spices', 'sauces', 'ghee'] },
  oils: { ar: 'الزيوت والسمن', en: 'Oils & Ghee', aliases: ['oils', 'condiments', 'ghee', 'spices'] },
  spices: { ar: 'التوابل والبهارات', en: 'Spices & Seasonings', aliases: ['spices', 'condiments'] },
  sauces: { ar: 'الصلصات والمايونيز', en: 'Sauces & Dressings', aliases: ['sauces', 'condiments'] },
  snacks: { ar: 'الوجبات الخفيفة والحلويات', en: 'Snacks & Sweets', aliases: ['snacks', 'sweets', 'biscuits', 'chips'] },
  beverages: { ar: 'المشروبات والعصائر', en: 'Beverages & Juices', aliases: ['beverages', 'juice', 'tea', 'coffee'] },
  cleaning: { ar: 'المنظفات والأدوات المنزلية', en: 'Cleaning & Household', aliases: ['cleaning', 'household', 'laundry'] },
  'personal-care': { ar: 'العناية الشخصية', en: 'Personal Care', aliases: ['personal-care', 'soap', 'shampoo'] },
  'baby-care': { ar: 'منتجات الأطفال', en: 'Baby Care', aliases: ['baby-care', 'diapers', 'baby'] },
  bakery: { ar: 'المخبوزات والخبز', en: 'Bakery & Bread', aliases: ['bakery', 'bread', 'toast'] },
  grocery: { ar: 'البقالة العامة', en: 'Grocery', aliases: ['grocery', 'pantry', 'dry'] },
  dry: { ar: 'البقالة الجافة', en: 'Dry Grocery', aliases: ['dry', 'pantry', 'grocery'] },
};

export default function CategoryPage() {
  const params = useParams();
  const { language, isRTL } = useLanguage();
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Query Convex DB products
  const dbProducts = useQuery(api.products.getProducts, {});

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setCategorySlug(resolvedParams.category as string);
      } catch (error) {
        console.error('Error loading params:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParams();
  }, [params]);

  // Determine category info or fallback
  const categoryInfo = useMemo(() => {
    if (!categorySlug) return null;
    return categoryNames[categorySlug] || {
      ar: categorySlug,
      en: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      aliases: [categorySlug]
    };
  }, [categorySlug]);

  // Direct indexed Convex Query for this category slug
  const dbCategoryProducts = useQuery(
    api.products.getProductsByCategorySlug,
    categorySlug ? { categorySlug } : "skip"
  );

  // Category products matching aliases against Convex DB & static fallback
  const categoryProducts = useMemo(() => {
    if (!categorySlug) return [];
    const targetAliases = categoryInfo ? categoryInfo.aliases : [categorySlug];

    const rawList = (dbCategoryProducts && dbCategoryProducts.length > 0)
      ? dbCategoryProducts
      : (dbProducts && dbProducts.length > 0)
      ? dbProducts
      : sampleProducts;

    const adaptedList = rawList
      .filter((p: any) => {
        const readiness = p.readinessStatus || (p.isActive !== false ? 'active_sellable' : 'draft_hidden');
        return readiness !== 'draft_hidden';
      })
      .map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        nameEn: p.nameEn,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        imagePublicId: p.imagePublicId,
        imagePublicIds: p.imagePublicIds,
        category: p.category || p.categorySlug || p.subcategory || 'grocery',
        subcategory: p.subcategory,
        brand: p.brand,
        unit: p.unit,
        description: p.description,
        descriptionEn: p.descriptionEn,
        stock: p.stock,
        discount: p.discount,
        rating: p.rating,
        reviews: p.reviews,
        readinessStatus: p.readinessStatus,
        isFulfillable: p.isFulfillable,
      }));

    // If dbCategoryProducts was returned directly from server index, use it directly
    if (dbCategoryProducts && dbCategoryProducts.length > 0) {
      return adaptedList;
    }

    // Otherwise filter source list by category aliases
    return adaptedList.filter((product: any) =>
      targetAliases.includes(product.category) ||
      (product.subcategory && targetAliases.includes(product.subcategory)) ||
      product.category.includes(categorySlug) ||
      categorySlug.includes(product.category)
    );
  }, [categorySlug, categoryInfo, dbCategoryProducts, dbProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If categoryInfo is completely missing and unmapped
  if (!categoryInfo) {
    return notFound();
  }

  const categoryName = language === 'ar' ? categoryInfo.ar : categoryInfo.en;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8"
        >
          <Link
            href="/"
            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link
            href="/categories"
            className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            {language === 'ar' ? 'الأقسام' : 'Categories'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {categoryName}
          </span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">


              {/* Category Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {categoryName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ar'
                    ? `${categoryProducts.length} منتج متاح`
                    : `${categoryProducts.length} products available`}
                </p>
              </div>
            </div>

            {/* Back Button */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
            >
              {isRTL ? (
                <>
                  {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
                  <FiArrowLeft className="w-5 h-5 rotate-180" />
                </>
              ) : (
                <>
                  <FiArrowLeft className="w-5 h-5" />
                  {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
                </>
              )}
            </Link>
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full w-24"></div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {categoryProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State (backup - should not show due to notFound) */}
        {categoryProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
              <FiPackage className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'ar' ? 'لا توجد منتجات' : 'No Products'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ar'
                ? 'لا توجد منتجات في هذا القسم حالياً'
                : 'No products in this category yet'}
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {language === 'ar' ? 'تصفح الأقسام الأخرى' : 'Browse Other Categories'}
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
