'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../../components/ProductCard';
import { useLanguage } from '../../../contexts/LanguageProvider';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import Link from 'next/link';
import CategoryErrorBoundary from '../../../components/CategoryErrorBoundary';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Category names and alias mapping
const categoryNames: Record<string, { ar: string; en: string; aliases: string[] }> = {
  vegetables: { ar: 'الخضروات والفواكه', en: 'Vegetables & Fruits', aliases: ['vegetables', 'produce', 'fresh-food', 'fruits'] },
  produce: { ar: 'الخضروات والفواكه الطازجة', en: 'Fresh Produce', aliases: ['produce', 'vegetables', 'fresh-food', 'fruits'] },
  'fresh-food': { ar: 'الأطعمة الطازجة', en: 'Fresh Food', aliases: ['fresh-food', 'produce', 'vegetables', 'fruits'] },
  dairy: { ar: 'الألبان والبيض والجبن', en: 'Dairy, Eggs & Cheese', aliases: ['dairy', 'dairy-eggs', 'milk', 'cheese'] },
  'dairy-eggs': { ar: 'الألبان والبيض', en: 'Dairy & Eggs', aliases: ['dairy-eggs', 'dairy', 'milk', 'cheese'] },
  meat: { ar: 'اللحوم والدواجن', en: 'Meat & Poultry', aliases: ['meat', 'poultry', 'beef', 'chicken'] },
  frozen: { ar: 'الأغذية المجمدة', en: 'Frozen Foods', aliases: ['frozen', 'frozen-foods'] },
  pantry: { ar: 'الأرز والمكرونة والبقوليات', en: 'Pantry & Grains', aliases: ['pantry', 'rice', 'pasta', 'legumes', 'dry', 'grains', 'dry-grocery', 'grocery'] },
  rice: { ar: 'الأرز والمعكرونة', en: 'Rice & Pasta', aliases: ['rice', 'pantry', 'pasta', 'grains', 'dry-grocery', 'dry'] },
  legumes: { ar: 'البقوليات', en: 'Legumes', aliases: ['legumes', 'pantry', 'grains', 'dry-grocery', 'dry'] },
  condiments: { ar: 'الزيوت والسمن والصلصات', en: 'Oils, Ghee & Spices', aliases: ['condiments', 'oils', 'spices', 'sauces', 'ghee'] },
  oils: { ar: 'الزيوت والسمن', en: 'Oils & Ghee', aliases: ['oils', 'condiments', 'ghee', 'spices'] },
  spices: { ar: 'التوابل والبهارات', en: 'Spices & Seasonings', aliases: ['spices', 'condiments', 'oils', 'sauces'] },
  sauces: { ar: 'الصلصات والمايونيز', en: 'Sauces & Dressings', aliases: ['sauces', 'condiments'] },
  snacks: { ar: 'الوجبات الخفيفة والحلويات', en: 'Snacks & Sweets', aliases: ['snacks', 'sweets', 'biscuits', 'chips', 'bazaar'] },
  bazaar: { ar: 'البازار والحلويات', en: 'Bazaar & Snacks', aliases: ['bazaar', 'snacks', 'sweets', 'biscuits', 'chips'] },
  beverages: { ar: 'المشروبات والعصائر', en: 'Beverages & Juices', aliases: ['beverages', 'juice', 'tea', 'coffee'] },
  cleaning: { ar: 'المنظفات والأدوات المنزلية', en: 'Cleaning & Household', aliases: ['cleaning', 'household', 'laundry'] },
  'personal-care': { ar: 'العناية الشخصية', en: 'Personal Care', aliases: ['personal-care', 'soap', 'shampoo'] },
  'baby-care': { ar: 'منتجات الأطفال', en: 'Baby Care', aliases: ['baby-care', 'diapers', 'baby'] },
  bakery: { ar: 'المخبوزات والخبز', en: 'Bakery & Bread', aliases: ['bakery', 'bread', 'toast'] },
  grocery: { ar: 'البقالة العامة', en: 'Grocery', aliases: ['grocery', 'pantry', 'dry', 'dry-grocery', 'rice', 'legumes'] },
  dry: { ar: 'البقالة الجافة', en: 'Dry Grocery', aliases: ['dry', 'pantry', 'grocery', 'dry-grocery', 'rice', 'legumes'] },
  'dry-grocery': { ar: 'البقالة الجافة', en: 'Dry Grocery', aliases: ['dry-grocery', 'dry', 'pantry', 'grocery', 'rice', 'legumes', 'pasta'] },
};

function CategoryPageInner() {
  const params = useParams();
  const { language, isRTL } = useLanguage();

  const rawParam = params?.category;
  const categorySlug = (
    typeof rawParam === 'string'
      ? rawParam
      : Array.isArray(rawParam) && rawParam.length > 0
      ? rawParam[0]
      : ''
  ).toLowerCase().trim();

  // Direct indexed Convex query for this category slug
  const dbCategoryProducts = useQuery(
    api.products.getProductsByCategorySlug,
    categorySlug ? { categorySlug } : 'skip'
  );

  // Determine category info or fallback
  const categoryInfo = useMemo(() => {
    if (!categorySlug) return null;
    return (
      categoryNames[categorySlug] || {
        ar: categorySlug,
        en: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        aliases: [categorySlug],
      }
    );
  }, [categorySlug]);

  // Show loading skeleton while route params are resolving or Convex query is in flight
  const isLoading = !categorySlug || dbCategoryProducts === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
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

  // If categoryInfo is completely missing and unmapped after loading
  if (!categoryInfo) {
    return notFound();
  }

  // Safely map products — guard every field against null/undefined
  const categoryProducts = (Array.isArray(dbCategoryProducts) ? dbCategoryProducts : [])
    .filter((p: any) => {
      if (!p || !p._id) return false;
      const readiness = p.readinessStatus ?? (p.isActive !== false ? 'active_sellable' : 'draft_hidden');
      return readiness !== 'draft_hidden';
    })
    .map((p: any) => ({
      id: String(p._id ?? p.id ?? ''),
      name: String(p.name ?? p.nameEn ?? ''),
      nameEn: String(p.nameEn ?? p.name ?? ''),
      price: typeof p.price === 'number' ? p.price : 0,
      compareAtPrice: typeof p.compareAtPrice === 'number' ? p.compareAtPrice : undefined,
      imagePublicId: p.imagePublicId ?? p.imagePublicIds?.[0] ?? '',
      imagePublicIds: Array.isArray(p.imagePublicIds) ? p.imagePublicIds : [],
      category: String(p.category ?? p.categorySlug ?? p.subcategory ?? 'grocery'),
      subcategory: p.subcategory ?? undefined,
      brand: String(p.brand ?? ''),
      unit: String(p.unit ?? ''),
      description: p.description ?? undefined,
      descriptionEn: p.descriptionEn ?? undefined,
      stock: typeof p.stock === 'number' ? p.stock : undefined,
      discount: typeof p.discount === 'number' ? p.discount : undefined,
      rating: typeof p.rating === 'number' ? p.rating : undefined,
      reviews: typeof p.reviews === 'number' ? p.reviews : undefined,
      readinessStatus: p.readinessStatus ?? undefined,
      isFulfillable: p.isFulfillable ?? true,
    }));

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
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {language === 'ar' ? 'الأقسام' : 'Categories'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{categoryName}</span>
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
        {categoryProducts.length > 0 ? (
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
        ) : (
          /* Empty State */
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

export default function CategoryPage() {
  return (
    <CategoryErrorBoundary>
      <CategoryPageInner />
    </CategoryErrorBoundary>
  );
}
