'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiPlus, 
  FiSearch, 
  FiCpu, 
  FiDatabase, 
  FiCheckCircle, 
  FiLoader, 
  FiAlertCircle, 
  FiTrash2, 
  FiLayers, 
  FiShoppingBag,
  FiX,
  FiCheck
} from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import { sampleProducts, categories as sampleCategories } from '@/data/products';
import { buildImageUrl } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

interface AdminProduct {
  _id: Id<"products">;
  name: string;
  nameEn: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imagePublicId: string;
  imagePublicIds: string[];
  categoryId: Id<"categories">;
  brand: string;
  unit: string;
  description?: string;
  descriptionEn?: string;
  stock?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  isActive: boolean;
  categorySlug: string;
  categoryName: string;
}

interface GenerateProductParams {
  _id: Id<"products">;
  categorySlug: string;
  slug: string;
  nameEn: string;
  descriptionEn?: string;
  brand: string;
  unit: string;
}

export default function AdminProductsPage() {
  const { language, isRTL } = useLanguage();
  
  // Queries & Mutations from Convex
  const products = useQuery(api.products.getAllProductsAdmin) as AdminProduct[] | undefined;
  const categories = useQuery(api.products.getCategories);
  const seedMutation = useMutation(api.seed.seedDatabase);
  const deleteProductMutation = useMutation(api.products.deleteProduct);
  const addProductMutation = useMutation(api.products.addProduct);

  // Local State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState('');
  
  // Create Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameEn: '',
    slug: '',
    price: 0,
    compareAtPrice: 0,
    categoryId: '',
    brand: '',
    unit: '',
    description: '',
    descriptionEn: '',
    stock: 100,
    discount: 0,
    isActive: true,
    autoGenerateAI: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Seeding
  const handleSeed = async () => {
    setIsSeeding(true);
    toast.loading(language === 'ar' ? 'جاري تهيئة قاعدة البيانات...' : 'Seeding database...', { id: 'seed' });
    try {
      // Map sample products to seed format
      const formattedProducts = sampleProducts.map(p => ({
        name: p.name,
        nameEn: p.nameEn,
        slug: p.id, // Using sample ID as slug to map correctly or generating slug
        price: p.price,
        compareAtPrice: p.compareAtPrice || p.price,
        imagePublicId: p.imagePublicId || '',
        imagePublicIds: p.imagePublicIds || [],
        category: p.category,
        brand: p.brand,
        unit: p.unit,
        description: p.description || '',
        descriptionEn: p.descriptionEn || '',
        stock: p.stock || 100,
        discount: p.discount || 0,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
      }));

      const result = await seedMutation({
        categories: sampleCategories,
        products: formattedProducts
      });

      toast.success(
        language === 'ar' 
          ? `تمت التهيئة بنجاح! تم استيراد ${result.seededProducts} منتج.` 
          : `Seeded successfully! Imported ${result.seededProducts} products.`,
        { id: 'seed' }
      );
    } catch (error: unknown) {
      console.error(error);
      toast.error(language === 'ar' ? 'فشلت التهيئة' : 'Seeding failed', { id: 'seed' });
    } finally {
      setIsSeeding(false);
    }
  };

  // Trigger AI Image Generation for an existing product
  const handleGenerateAIImages = async (product: GenerateProductParams) => {
    setIsGeneratingId(product._id);
    setGenerationStep(language === 'ar' ? 'بدء توليد الصور...' : 'Initializing generator...');
    
    try {
      const steps = [
        language === 'ar' ? 'توليد لقطة الواجهة الأمامية...' : 'Generating front view...',
        language === 'ar' ? 'توليد لقطة زاوية 45 درجة...' : 'Generating 45° angle view...',
        language === 'ar' ? 'توليد لقطة الجانب التفصيلي...' : 'Generating side view...',
        language === 'ar' ? 'توليد لقطة مقربة للتغليف...' : 'Generating close-up detail view...',
        language === 'ar' ? 'رفع الصور إلى Cloudinary وحفظها في Convex...' : 'Uploading to Cloudinary & saving in Convex...'
      ];

      // Simulate step-by-step progress updating for visual excellence
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < steps.length - 1) {
          setGenerationStep(steps[stepIndex]);
          stepIndex++;
        }
      }, 5000);

      const response = await fetch('/api/ai/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          categorySlug: product.categorySlug,
          productSlug: product.slug,
          nameEn: product.nameEn,
          descriptionEn: product.descriptionEn,
          brand: product.brand,
          unit: product.unit,
          count: 4
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate');
      }

      toast.success(
        language === 'ar'
          ? 'تم توليد صور الذكاء الاصطناعي بنجاح!'
          : 'AI product images generated successfully!'
      );
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      toast.error(
        language === 'ar'
          ? `فشل التوليد: ${errorMessage}`
          : `Generation failed: ${errorMessage}`
      );
    } finally {
      setIsGeneratingId(null);
      setGenerationStep('');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: Id<"products">) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation({ id });
        toast.success(language === 'ar' ? 'تم حذف المنتج' : 'Product deleted');
      } catch {
        toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed');
      }
    }
  };

  // Add Product Form Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.categoryId) {
      toast.error(language === 'ar' ? 'حدد القسم أولاً' : 'Select category first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Create product in Convex with placeholders first
      const generatedSlug = newProduct.slug || newProduct.nameEn.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      const productId = await addProductMutation({
        name: newProduct.name,
        nameEn: newProduct.nameEn,
        slug: generatedSlug,
        price: Number(newProduct.price),
        compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : undefined,
        imagePublicId: '',
        imagePublicIds: [],
        categoryId: newProduct.categoryId as Id<"categories">,
        brand: newProduct.brand,
        unit: newProduct.unit,
        description: newProduct.description,
        descriptionEn: newProduct.descriptionEn,
        stock: Number(newProduct.stock),
        discount: newProduct.discount ? Number(newProduct.discount) : undefined,
        isActive: newProduct.isActive,
      });

      // Close modal
      setIsCreateModalOpen(false);
      
      // 2. Trigger AI Generation if selected
      if (newProduct.autoGenerateAI) {
        const cat = categories?.find(c => c._id === newProduct.categoryId);
        await handleGenerateAIImages({
          _id: productId,
          categorySlug: cat?.slug || 'products',
          slug: generatedSlug,
          nameEn: newProduct.nameEn,
          descriptionEn: newProduct.descriptionEn,
          brand: newProduct.brand,
          unit: newProduct.unit
        });
      } else {
        toast.success(language === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product added successfully');
      }

      // Reset Form State
      setNewProduct({
        name: '',
        nameEn: '',
        slug: '',
        price: 0,
        compareAtPrice: 0,
        categoryId: '',
        brand: '',
        unit: '',
        description: '',
        descriptionEn: '',
        stock: 100,
        discount: 0,
        isActive: true,
        autoGenerateAI: true,
      });
    } catch {
      toast.error(language === 'ar' ? 'فشل إضافة المنتج' : 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Products
  const filteredProducts = products?.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || p.categorySlug === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Glowing Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-30 pointer-events-none" />
          <div className="space-y-2 z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-3">
              <FiShoppingBag className="text-emerald-400 animate-bounce" />
              {language === 'ar' ? 'إدارة كتالوج المنتجات' : 'Product Catalog Management'}
            </h1>
            <p className="text-sm text-slate-400">
              {language === 'ar' 
                ? 'توليد صور المنتجات بالذكاء الاصطناعي ومزامنتها مباشرة مع Cloudinary و Convex'
                : 'Generate AI product images and sync directly with Cloudinary & Convex'}
            </p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0 z-10">
            <button
              onClick={handleSeed}
              disabled={isSeeding || products === undefined}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition duration-300 disabled:opacity-50"
            >
              {isSeeding ? <FiLoader className="animate-spin text-emerald-400" /> : <FiDatabase className="text-emerald-400" />}
              <span>{language === 'ar' ? 'تهيئة قاعدة البيانات' : 'Seed Database'}</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-400 hover:to-teal-500 transition duration-300 shadow-lg shadow-emerald-500/20"
            >
              <FiPlus />
              <span>{language === 'ar' ? 'إضافة منتج جديد' : 'Add Product'}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: language === 'ar' ? 'إجمالي المنتجات' : 'Total Products',
                val: products.length,
                color: 'from-blue-500 to-indigo-600',
                icon: FiLayers
              },
              {
                title: language === 'ar' ? 'المنتجات النشطة' : 'Active Products',
                val: products.filter(p => p.isActive).length,
                color: 'from-emerald-500 to-teal-600',
                icon: FiCheckCircle
              },
              {
                title: language === 'ar' ? 'بصور الذكاء الاصطناعي' : 'With AI Images',
                val: products.filter(p => p.imagePublicId && p.imagePublicId.includes('products')).length,
                color: 'from-violet-500 to-fuchsia-600',
                icon: FiCpu
              },
              {
                title: language === 'ar' ? 'الأقسام المتاحة' : 'Total Categories',
                val: categories?.length || 0,
                color: 'from-amber-500 to-orange-600',
                icon: FiDatabase
              }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-lg hover:border-white/20 transition-all duration-300">
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-black text-white">{stat.val}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                  <stat.icon />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {products === undefined ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <FiLoader className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
            <p className="text-slate-400">{language === 'ar' ? 'جاري تحميل الكتالوج...' : 'Loading catalog...'}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-3xl">
              <FiDatabase />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold text-white">{language === 'ar' ? 'قاعدة البيانات فارغة' : 'Database is Empty'}</h3>
              <p className="text-sm text-slate-400">
                {language === 'ar' 
                  ? 'لم يتم العثور على منتجات في Convex. اضغط على زر التهيئة لملء المنتجات التجريبية.'
                  : 'No products found in Convex. Click the Seed Database button to load sample data.'}
              </p>
            </div>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300"
            >
              {isSeeding ? <FiLoader className="animate-spin" /> : <FiDatabase />}
              <span>{language === 'ar' ? 'تهيئة قاعدة البيانات الآن' : 'Seed Database Now'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 shadow-md">
              <div className="relative w-full md:max-w-md">
                <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث عن منتج...' : 'Search products...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-48 px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">{language === 'ar' ? 'جميع الأقسام' : 'All Categories'}</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{language === 'ar' ? cat.name : cat.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Catalog Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                      <th className="p-5">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th className="p-5">{language === 'ar' ? 'التصنيف والماركة' : 'Category & Brand'}</th>
                      <th className="p-5">{language === 'ar' ? 'السعر' : 'Price'}</th>
                      <th className="p-5">{language === 'ar' ? 'معرض صور AI' : 'AI Gallery'}</th>
                      <th className="p-5 text-right">{language === 'ar' ? 'التحكم' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredProducts.map((product) => {
                      const hasAIImages = product.imagePublicId && product.imagePublicId.includes('products');
                      return (
                        <tr key={product._id} className="hover:bg-white/[0.02] transition duration-200">
                          {/* Basic Info */}
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 flex items-center justify-center">
                                {product.imagePublicId ? (
                                  <Image
                                    src={buildImageUrl(product.imagePublicId, { width: 100, height: 100, crop: 'fill' })}
                                    alt={product.nameEn}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <FiAlertCircle className="text-slate-500 text-xl" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-semibold text-white truncate max-w-[200px]">{language === 'ar' ? product.name : product.nameEn}</p>
                                <p className="text-xs text-slate-400 max-w-[200px] truncate">{product.slug}</p>
                                <span className="inline-flex text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-bold">
                                  {product.unit}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category & Brand */}
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="text-slate-200 font-medium">{product.categoryName}</p>
                              <p className="text-xs text-slate-400">{product.brand}</p>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="text-white font-bold">{product.price.toFixed(2)} EGP</p>
                              {product.discount && product.discount > 0 ? (
                                <p className="text-xs text-rose-400 font-semibold">-{product.discount}% Off</p>
                              ) : null}
                            </div>
                          </td>

                          {/* AI Gallery Status */}
                          <td className="p-5">
                            {hasAIImages && product.imagePublicIds ? (
                              <div className="flex gap-1.5 overflow-x-auto max-w-[220px] scrollbar-hide py-1">
                                {product.imagePublicIds.map((img: string, idx: number) => (
                                  <div key={idx} className="relative w-8 h-8 rounded border border-white/10 overflow-hidden flex-shrink-0">
                                    <Image
                                      src={buildImageUrl(img, { width: 50, height: 50, crop: 'fill' })}
                                      alt={`View ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                {language === 'ar' ? 'لا يوجد صور AI' : 'No AI images'}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-5 text-right">
                            <div className="flex gap-2 justify-end items-center">
                              <button
                                onClick={() => handleGenerateAIImages(product)}
                                disabled={isGeneratingId !== null}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                  hasAIImages
                                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                              >
                                {isGeneratingId === product._id ? (
                                  <FiLoader className="animate-spin text-emerald-400" />
                                ) : (
                                  <FiCpu />
                                )}
                                <span>
                                  {hasAIImages 
                                    ? (language === 'ar' ? 'إعادة توليد' : 'Regenerate') 
                                    : (language === 'ar' ? 'توليد صور AI' : 'Generate AI')}
                                </span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generation Progress Overlay */}
      <AnimatePresence>
        {isGeneratingId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <FiCpu className="absolute inset-0 m-auto text-3xl text-emerald-400 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {language === 'ar' ? 'توليد صور بجودة الاستوديو' : 'Generating Studio Photos'}
                </h3>
                <p className="text-sm text-slate-400">
                  {language === 'ar'
                    ? 'يتم الآن توليد 4 زوايا تصويرية بدقة 2000×2000 بخلفية بيضاء ونظام إضاءة احترافي.'
                    : 'Creating 4 camera angles in 2000×2000 square resolution with pure white background & studio lighting.'}
                </p>
              </div>

              <div className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-center gap-3">
                <FiLoader className="animate-spin text-emerald-400" />
                <span className="text-xs text-slate-300 font-mono truncate">{generationStep}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Dialog Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-10"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition"
              >
                <FiX className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FiPlus className="text-emerald-400" />
                {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Arabic */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="مثال: حليب جهينة كامل الدسم"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Name English */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}</label>
                    <input
                      type="text"
                      required
                      value={newProduct.nameEn}
                      onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                      placeholder="e.g. Juhayna Full Cream Milk"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'المعرف الفريد (Slug)' : 'Unique Slug'}</label>
                    <input
                      type="text"
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      placeholder="e.g. juhayna-milk-1l"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Brand */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'الماركة' : 'Brand'}</label>
                    <input
                      type="text"
                      required
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      placeholder="e.g. Juhayna"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'القسم' : 'Category'}</label>
                    <select
                      required
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">{language === 'ar' ? 'اختر القسم...' : 'Select category...'}</option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>{language === 'ar' ? cat.name : cat.nameEn}</option>
                      ))}
                    </select>
                  </div>

                  {/* Unit */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'الوحدة / العبوة' : 'Unit / Size'}</label>
                    <input
                      type="text"
                      required
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      placeholder="e.g. 1 Liter / 250 g / 1 Unit"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'السعر (EGP)' : 'Price (EGP)'}</label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      placeholder="Price"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'المخزون' : 'Stock Quantity'}</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      placeholder="Stock"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Description En */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}</label>
                  <textarea
                    value={newProduct.descriptionEn}
                    onChange={(e) => setNewProduct({ ...newProduct, descriptionEn: e.target.value })}
                    placeholder="Provide a detailed description of the product in English..."
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Description Ar */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase">{language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="اكتب وصفاً تفصيلياً للمنتج باللغة العربية..."
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Switches */}
                <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.isActive}
                      onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold">{language === 'ar' ? 'نشط (متاح للشراء)' : 'Active (Available for purchase)'}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.autoGenerateAI}
                      onChange={(e) => setNewProduct({ ...newProduct, autoGenerateAI: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-emerald-400">{language === 'ar' ? 'توليد صور بالذكاء الاصطناعي تلقائياً' : 'Auto-generate AI images immediately'}</span>
                  </label>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                  >
                    {isSubmitting ? <FiLoader className="animate-spin" /> : <FiCheck />}
                    <span>{language === 'ar' ? 'حفظ وتأكيد' : 'Save & Confirm'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
