'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FiUploadCloud, 
  FiImage, 
  FiPlus, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiFolder, 
  FiInfo, 
  FiArrowUp, 
  FiArrowDown, 
  FiRefreshCw, 
  FiLoader,
  FiCpu,
  FiZap
} from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
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

export default function AdminImageUpload() {
  const { language, isRTL } = useLanguage();
  
  // Convex Hooks
  const products = useQuery(api.products.getAllProductsAdmin) as AdminProduct[] | undefined;
  const updateProductMutation = useMutation(api.products.updateProduct);

  // Component State
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGenerationStep, setAIGenerationStep] = useState('');

  // Get active product details
  const activeProduct = products?.find((p) => p._id === selectedProductId);

  // Handle Bulk Upload (3-5 images)
  const handleBulkUpload = useCallback(async (files: File[]) => {
    if (!activeProduct) {
      toast.error(language === 'ar' ? 'حدد المنتج أولاً' : 'Select a product first');
      return;
    }

    if (files.length < 3 || files.length > 5) {
      toast.error(language === 'ar' ? 'يجب رفع 3-5 صور دقة واحدة' : 'Must upload between 3 and 5 images');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(language === 'ar' ? 'جاري رفع الصور...' : 'Uploading images...');

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('categorySlug', activeProduct.categorySlug);
      formData.append('productSlug', activeProduct.slug);
      formData.append('productId', activeProduct._id);
      formData.append('type', 'product');

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      await response.json();
      
      // Update local state if needed (Convex reactive update will trigger query reload)
      toast.success(
        language === 'ar' ? 'تم رفع الصور بنجاح ومزامنتها مع قاعدة البيانات' : 'Images uploaded successfully & synced to Convex',
        { id: toastId }
      );
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Upload failed';
      toast.error(language === 'ar' ? `فشل الرفع: ${msg}` : `Upload failed: ${msg}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, [activeProduct, language]);

  // Handle Replacing a Specific Image at an Index (Preserving Cloudinary name ending in /1, /2, etc.)
  const handleReplaceImage = async (indexNum: number, file: File) => {
    if (!activeProduct) return;

    setIsUploading(true);
    const toastId = toast.loading(
      language === 'ar' ? `جاري استبدال الصورة رقم ${indexNum}...` : `Replacing image #${indexNum}...`
    );

    try {
      const formData = new FormData();
      formData.append('images', file);
      formData.append('categorySlug', activeProduct.categorySlug);
      formData.append('productSlug', activeProduct.slug);
      formData.append('productId', activeProduct._id);
      formData.append('replaceIndex', indexNum.toString());

      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Replacement failed');
      }

      toast.success(
        language === 'ar' ? `تم استبدال الصورة ${indexNum} بنجاح` : `Image #${indexNum} replaced successfully`,
        { id: toastId }
      );
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Replacement failed';
      toast.error(language === 'ar' ? `فشل الاستبدال: ${msg}` : `Replacement failed: ${msg}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Deleting a Specific Image
  const handleDeleteImage = async (publicId: string) => {
    if (!activeProduct) return;

    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this image?')) {
      return;
    }

    const toastId = toast.loading(language === 'ar' ? 'جاري الحذف...' : 'Deleting image...');

    try {
      const response = await fetch(
        `/api/cloudinary/upload?productId=${activeProduct._id}&publicIdToDelete=${encodeURIComponent(publicId)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      toast.success(language === 'ar' ? 'تم حذف الصورة بنجاح' : 'Image deleted successfully', { id: toastId });
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Deletion failed';
      toast.error(language === 'ar' ? `فشل الحذف: ${msg}` : `Deletion failed: ${msg}`, { id: toastId });
    }
  };

  // Handle Reordering Images (Move Index Up/Down)
  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    if (!activeProduct || !activeProduct.imagePublicIds) return;

    const ids = [...activeProduct.imagePublicIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= ids.length) return;

    // Swap elements
    const temp = ids[index];
    ids[index] = ids[targetIndex];
    ids[targetIndex] = temp;

    try {
      await updateProductMutation({
        id: activeProduct._id,
        imagePublicId: ids[0], // First image is always primary
        imagePublicIds: ids,
      });
      toast.success(language === 'ar' ? 'تم تحديث الترتيب' : 'Display order updated');
    } catch (error) {
      console.error(error);
      toast.error(language === 'ar' ? 'فشل تحديث الترتيب' : 'Failed to update order');
    }
  };

  // Handle AI Image Generation
  const handleGenerateAIImages = async () => {
    if (!activeProduct) {
      toast.error(language === 'ar' ? 'حدد المنتج أولاً' : 'Select a product first');
      return;
    }

    setIsGeneratingAI(true);
    setAIGenerationStep(language === 'ar' ? 'بدء توليد الصور...' : 'Initializing generator...');

    try {
      const steps = [
        language === 'ar' ? 'توليد لقطة الواجهة الأمامية...' : 'Generating front view...',
        language === 'ar' ? 'توليد لقطة زاوية 45 درجة...' : 'Generating 45° angle view...',
        language === 'ar' ? 'توليد لقطة الجانب التفصيلي...' : 'Generating side detail view...',
        language === 'ar' ? 'توليد لقطة مقربة للتغليف...' : 'Generating close-up packaging view...',
        language === 'ar' ? 'رفع الصور إلى Cloudinary وحفظها في Convex...' : 'Uploading to Cloudinary & saving in Convex...'
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < steps.length - 1) {
          setAIGenerationStep(steps[stepIndex]);
          stepIndex++;
        }
      }, 5000);

      const response = await fetch('/api/ai/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: activeProduct._id,
          categorySlug: activeProduct.categorySlug,
          productSlug: activeProduct.slug,
          nameEn: activeProduct.nameEn,
          descriptionEn: activeProduct.descriptionEn,
          brand: activeProduct.brand,
          unit: activeProduct.unit,
          count: 4
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate');
      }

      setAIGenerationStep(steps[steps.length - 1]);
      
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
      setIsGeneratingAI(false);
      setAIGenerationStep('');
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!activeProduct) {
        toast.error(language === 'ar' ? 'حدد المنتج أولاً' : 'Select product first');
        return;
      }

      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) handleBulkUpload(files);
    },
    [activeProduct, language, handleBulkUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeProduct) {
        toast.error(language === 'ar' ? 'حدد المنتج أولاً' : 'Select product first');
        e.target.value = '';
        return;
      }
      const files = Array.from(e.target.files || []);
      if (files.length > 0) handleBulkUpload(files);
      e.target.value = '';
    },
    [activeProduct, language, handleBulkUpload]
  );

  // Copy public IDs to clipboard
  const copyPublicIds = () => {
    if (!activeProduct?.imagePublicIds) return;
    const ids = activeProduct.imagePublicIds.join('\n');
    navigator.clipboard.writeText(ids);
    toast.success(language === 'ar' ? 'تم نسخ المعرفات' : 'Public IDs copied');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Glow Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-30 pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-3">
                <FiImage className="text-emerald-400" />
                {language === 'ar' ? 'إدارة صور المنتجات المحترفة' : 'Professional Product Image Manager'}
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl">
                {language === 'ar'
                  ? 'ارفع، استبدل، احذف، ورتب صور منتجاتك - يتم حفظ معرفات صور Cloudinary فقط في قاعدة البيانات'
                  : 'Upload, replace, delete, and reorder images - Only Cloudinary Public IDs are saved in database'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/admin/bulk-ai-generate'}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white font-semibold transition shadow-lg shadow-violet-500/20"
              >
                <FiZap />
                <span>{language === 'ar' ? 'مولد AI الشامل' : 'Bulk AI Generator'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Product Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {language === 'ar' ? 'اختر المنتج لإدارة صوره' : 'Select Product to Manage Images'}
            </label>
            {products === undefined ? (
              <div className="flex items-center gap-2 text-slate-400">
                <FiLoader className="animate-spin text-emerald-400" />
                <span>{language === 'ar' ? 'جاري تحميل قائمة المنتجات...' : 'Loading products list...'}</span>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">{language === 'ar' ? '-- اختر منتجاً --' : '-- Select a Product --'}</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.brand} - {language === 'ar' ? p.name : p.nameEn} ({p.categoryName})
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeProduct && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-4"
            >
              <div className="space-y-1 flex-1 min-w-[200px]">
                <p className="text-sm text-slate-400">
                  <strong>{language === 'ar' ? 'مسار مجلد Cloudinary:' : 'Cloudinary Folder Path:'}</strong>
                </p>
                <code className="bg-slate-950 px-3 py-1.5 rounded text-xs text-emerald-400 font-mono block">
                  pandamarket/categories/{activeProduct.categorySlug}/products/{activeProduct.slug}/
                </code>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="text-xs text-slate-500 text-right">
                  <p>{language === 'ar' ? 'المعرف الفريد للمنتج:' : 'Product Slug:'}</p>
                  <p className="font-bold text-slate-300">{activeProduct.slug}</p>
                </div>
                <button
                  onClick={handleGenerateAIImages}
                  disabled={isGeneratingAI || isUploading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                >
                  {isGeneratingAI ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiCpu />
                  )}
                  <span>
                    {isGeneratingAI
                      ? (language === 'ar' ? 'جاري التوليد...' : 'Generating...')
                      : (language === 'ar' ? 'توليد صور AI' : 'Generate AI Images')}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {activeProduct && (
          <>
            {/* Upload Area for Bulk */}
            {(!activeProduct.imagePublicIds || activeProduct.imagePublicIds.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
              >
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-10 border-2 border-dashed rounded-2xl transition-all text-center space-y-4 ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-700 bg-transparent'
                  }`}
                >
                  <input
                    type="file"
                    id="bulk-image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <FiUploadCloud className="w-16 h-16 mx-auto text-slate-500 animate-pulse" />
                  <h3 className="text-xl font-bold text-white">
                    {language === 'ar' ? 'اسحب وأفلت الصور هنا' : 'Drag & Drop Images Here'}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    {language === 'ar'
                      ? 'قم برفع 3 إلى 5 صور استوديو لتهيئة معرض صور هذا المنتج.'
                      : 'Upload between 3 and 5 studio images to initialize this product\'s catalog.'}
                  </p>
                  <label
                    htmlFor="bulk-image-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition"
                  >
                    <FiPlus />
                    <span>{language === 'ar' ? 'اختر الصور' : 'Choose Images'}</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Uploading Loader */}
            {isUploading && (
              <div className="flex items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl gap-3">
                <FiLoader className="animate-spin text-emerald-400 text-2xl" />
                <span className="text-slate-300 font-medium">
                  {language === 'ar' ? 'جاري معالجة الصور على Cloudinary ومزامنة Convex...' : 'Processing images on Cloudinary & syncing Convex...'}
                </span>
              </div>
            )}

            {/* Current Product Images List & Manager */}
            {activeProduct.imagePublicIds && activeProduct.imagePublicIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FiFolder className="text-emerald-400" />
                    <span>{language === 'ar' ? 'معرض صور المنتج الحالي' : 'Current Product Images Gallery'}</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                      {activeProduct.imagePublicIds.length} {language === 'ar' ? 'صور' : 'images'}
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyPublicIds}
                      className="px-4 py-2 bg-slate-850 hover:bg-slate-850 border border-slate-700 text-slate-300 rounded-lg transition text-xs flex items-center gap-2"
                    >
                      <FiCheck />
                      <span>{language === 'ar' ? 'نسخ معرفات الصور' : 'Copy Public IDs'}</span>
                    </button>
                    {activeProduct.imagePublicIds.length < 5 && (
                      <label
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition text-xs font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <FiPlus />
                        <span>{language === 'ar' ? 'إضافة صورة جديدة' : 'Add New Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleReplaceImage(activeProduct.imagePublicIds.length + 1, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {activeProduct.imagePublicIds.map((imagePublicId, index) => {
                    const viewNum = index + 1;
                    const isMainImage = index === 0;

                    return (
                      <div
                        key={imagePublicId}
                        className="relative group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg"
                      >
                        {/* Image Preview Container */}
                        <div className="aspect-square relative bg-slate-950 flex items-center justify-center">
                          <Image
                            src={buildImageUrl(imagePublicId, { width: 400, height: 400, crop: 'fill' }).primary}
                            alt={`Image ${viewNum}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Main Image Badge */}
                          <div className="absolute top-2 left-2 z-10 flex gap-1">
                            <span className="bg-slate-950/80 text-white text-xs font-black px-2 py-0.5 rounded font-mono">
                              #{viewNum}
                            </span>
                            {isMainImage && (
                              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                {language === 'ar' ? 'الرئيسية' : 'Main'}
                              </span>
                            )}
                          </div>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setPreviewIndex(index)}
                              className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
                              title="Preview"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <label
                              className="p-2 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition cursor-pointer"
                              title="Replace File"
                            >
                              <FiRefreshCw className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReplaceImage(viewNum, file);
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => handleDeleteImage(imagePublicId)}
                              className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-400 transition"
                              title="Delete File"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Image Information & Ordering Actions */}
                        <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
                          <p className="text-[10px] text-slate-500 font-mono truncate" title={imagePublicId}>
                            {imagePublicId}
                          </p>
                          <div className="flex justify-between items-center gap-1 pt-1">
                            <button
                              onClick={() => handleMoveImage(index, 'up')}
                              disabled={index === 0}
                              className="flex-1 p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded text-slate-300 flex justify-center transition"
                              title="Move Up (Make Primary)"
                            >
                              <FiArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveImage(index, 'down')}
                              disabled={index === activeProduct.imagePublicIds.length - 1}
                              className="flex-1 p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded text-slate-300 flex justify-center transition"
                              title="Move Down"
                            >
                              <FiArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Preview Modal */}
            {previewIndex !== null && activeProduct.imagePublicIds && (
              <div
                className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4"
                onClick={() => setPreviewIndex(null)}
              >
                <div className="relative max-w-3xl max-h-[85vh] aspect-square w-full">
                  <button
                    onClick={() => setPreviewIndex(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                  <Image
                    src={buildImageUrl(activeProduct.imagePublicIds[previewIndex], { width: 1000, height: 1000, crop: 'pad' }).primary}
                    alt={`Preview image`}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 border border-slate-700 text-white px-4 py-2 rounded-lg text-xs font-mono">
                    {activeProduct.imagePublicIds[previewIndex]}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Documentation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiInfo className="text-emerald-400" />
            <span>{language === 'ar' ? 'تعليمات مهمة لخط أنابيب الصور' : 'Product Images Pipeline Guidelines'}</span>
          </h3>
          <ul className="space-y-3.5 text-slate-400 text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <FiCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ar' 
                  ? 'يتم توليد معرفات الصور العامة (Public IDs) تلقائياً بالصيغة المطلوبة: pandamarket/categories/{categorySlug}/products/{productSlug}/{index}'
                  : 'Cloudinary Public IDs are auto-generated dynamically following the format: pandamarket/categories/{categorySlug}/products/{productSlug}/{index}'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <FiCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'لا يتم تخزين روابط URL كاملة مطلقاً في Convex. يتم فقط تخزين مصفوفة معرفات Cloudinary.'
                  : 'Full URLs are never stored in Convex. Only the array of Cloudinary Public IDs is stored in the database.'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <FiCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'استبدال أي صورة يحافظ على ترقيمها على Cloudinary (مثلاً استبدال الصورة رقم 3 يعيد رفعها كملف يحمل الرقم 3 بالمسار).'
                  : 'Replacing any image preserves its exact numbering on Cloudinary (e.g. replacing image #3 re-uploads to the exact path ending in /3).'}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <FiCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'الترتيب يتم من خلال تعديل ترتيب مصفوفة المعرفات في Convex. الصورة الأولى (Index 0) تصبح تلقائياً هي الصورة الرئيسية للمنتج.'
                  : 'Reordering changes the sequence of Public IDs in Convex. The first image (Index 0) automatically updates as the primary product card image.'}
              </span>
            </li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
}