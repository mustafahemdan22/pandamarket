'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCpu, FiZap, FiCheckCircle, FiAlertCircle,
  FiRefreshCw, FiSkipForward, FiPause, FiPlay,
  FiTrash2, FiDownload, FiUpload, FiFilter,
  FiClock, FiUsers, FiBarChart2, FiSettings,
  FiArrowRight, FiChevronDown, FiChevronUp
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
  imagePublicId: string;
  imagePublicIds: string[];
  categoryId: Id<"categories">;
  brand: string;
  unit: string;
  descriptionEn?: string;
  isActive: boolean;
  categorySlug: string;
  categoryName: string;
  hasAIImages: boolean;
  imageCount: number;
}

interface GenerationJob {
  id: string;
  productId: Id<"products">;
  productName: string;
  productSlug: string;
  categorySlug: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  progress: number;
  currentStep: string;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  generatedCount: number;
  publicIds: string[];
}

const VIEWS = ['front', 'angle', 'side', 'detail'];
const BATCH_SIZE = 3;

export default function BulkAIImageGenerator() {
  const { language, isRTL } = useLanguage();
  
  const products = useQuery(api.products.getAllProductsAdmin) as AdminProduct[] | undefined;
  const updateProductMutation = useMutation(api.products.updateProduct);
  
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [skipExisting, setSkipExisting] = useState(true);
  const [regenerateFailed, setRegenerateFailed] = useState(true);
  const [maxConcurrent, setMaxConcurrent] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const productsWithImages = products?.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0) || [];
  const productsWithoutImages = products?.filter(p => !p.imagePublicIds || p.imagePublicIds.length === 0) || [];
  const productsWithSomeImages = products?.filter(p => p.imagePublicIds && p.imagePublicIds.length > 0 && p.imagePublicIds.length < 5) || [];
  
  const stats = {
    total: products?.length || 0,
    completed: jobs.filter(j => j.status === 'completed').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    pending: jobs.filter(j => j.status === 'pending').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    skipped: jobs.filter(j => j.status === 'skipped').length,
  };

  const filteredJobs = jobs.filter(job => {
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    if (showOnlySelected && !selectedProductIds.has(job.productId)) return false;
    return true;
  });

  const initializeJobs = useCallback(() => {
    if (!products) return;
    
    const newJobs: GenerationJob[] = products.map(product => {
      const hasImages = product.imagePublicIds && product.imagePublicIds.length > 0;
      const imageCount = product.imagePublicIds?.length || 0;
      
      return {
        id: `job-${product._id}`,
        productId: product._id,
        productName: product.nameEn,
        productSlug: product.slug,
        categorySlug: product.categorySlug,
        status: (skipExisting && hasImages) ? 'skipped' : 'pending',
        progress: 0,
        currentStep: skipExisting && hasImages ? (language === 'ar' ? 'تم التخطي - صور موجودة' : 'Skipped - images exist') : (language === 'ar' ? 'في الانتظار' : 'Pending'),
        generatedCount: 0,
        publicIds: product.imagePublicIds || [],
      };
    });
    
    setJobs(newJobs);
    setSelectedProductIds(new Set(productsWithoutImages.map(p => p._id)));
  }, [products, skipExisting, language]);

  useEffect(() => {
    initializeJobs();
  }, [initializeJobs]);

  const generateImagesForProduct = async (job: GenerationJob): Promise<GenerationJob> => {
    const controller = abortController;
    if (controller?.signal.aborted) {
      return { ...job, status: 'failed', error: 'Aborted', currentStep: 'Aborted' };
    }

    let updatedJob: GenerationJob = { ...job, status: 'processing', startedAt: Date.now(), progress: 5 };
    setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));

    try {
      const steps = [
        language === 'ar' ? 'تهيئة التوليد...' : 'Initializing generation...',
        language === 'ar' ? 'توليد لقطة الواجهة الأمامية...' : 'Generating front view...',
        language === 'ar' ? 'توليد لقطة الزاوية 45°...' : 'Generating 45° angle view...',
        language === 'ar' ? 'توليد لقطة الجانب...' : 'Generating side view...',
        language === 'ar' ? 'توليد لقطة التفاصيل...' : 'Generating detail view...',
        language === 'ar' ? 'رفع الصور إلى Cloudinary...' : 'Uploading to Cloudinary...',
        language === 'ar' ? 'حفظ المعرفات في Convex...' : 'Saving to Convex...'
      ];

      for (let i = 0; i < steps.length - 2; i++) {
        if (controller?.signal.aborted) throw new Error('Aborted');
        updatedJob = { ...updatedJob, currentStep: steps[i], progress: 10 + i * 12 };
        setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));
        await new Promise(r => setTimeout(r, 100));
      }

      const response = await fetch('/api/ai/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: job.productId,
          categorySlug: job.categorySlug,
          productSlug: job.productSlug,
          nameEn: job.productName,
          descriptionEn: '',
          brand: '',
          unit: '',
          count: 4
        }),
        signal: controller?.signal
      });

      if (controller?.signal.aborted) throw new Error('Aborted');

      updatedJob = { ...updatedJob, currentStep: steps[steps.length - 2], progress: 85 };
      setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      
      updatedJob = { 
        ...updatedJob, 
        currentStep: steps[steps.length - 1], 
        progress: 95,
        publicIds: data.publicIds,
        generatedCount: data.publicIds?.length || 0
      };
      setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));

      if (data.publicIds?.length > 0) {
        await updateProductMutation({
          id: job.productId,
          imagePublicId: data.publicIds[0],
          imagePublicIds: data.publicIds
        });
      }

      updatedJob = { 
        ...updatedJob, 
        status: 'completed', 
        progress: 100, 
        currentStep: language === 'ar' ? 'اكتمل بنجاح' : 'Completed successfully',
        completedAt: Date.now()
      };
      setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));
      
      return updatedJob;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { ...job, status: 'failed', error: 'Aborted', currentStep: 'Aborted' };
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updatedJob = { 
        ...job, 
        status: 'failed', 
        error: errorMessage, 
        currentStep: language === 'ar' ? `فشل: ${errorMessage}` : `Failed: ${errorMessage}`,
        progress: 0
      };
      setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));
      return updatedJob;
    }
  };

  const processQueue = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setIsGenerating(true);

    const pendingJobs = jobs.filter(j => 
      j.status === 'pending' || (regenerateFailed && j.status === 'failed')
    );

    for (let i = 0; i < pendingJobs.length; i++) {
      if (controller.signal.aborted) break;
      
      const job = pendingJobs[i];
      setCurrentJobIndex(i);
      await generateImagesForProduct(job);
      
      if (i < pendingJobs.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setIsGenerating(false);
    setAbortController(null);
    
    const completed = jobs.filter(j => j.status === 'completed').length;
    toast.success(
      language === 'ar' 
        ? `اكتمل التوليد! ${completed} منتج تم إنشاؤه`
        : `Generation complete! ${completed} products generated`
    );
  };

  const startGeneration = () => {
    const pendingCount = jobs.filter(j => j.status === 'pending' || (regenerateFailed && j.status === 'failed')).length;
    if (pendingCount === 0) {
      toast.error(language === 'ar' ? 'لا توجد منتجات للمعالجة' : 'No products to process');
      return;
    }
    processQueue();
  };

  const pauseGeneration = () => {
    abortController?.abort();
    setIsGenerating(false);
  };

  const retryFailed = () => {
    setJobs(prev => prev.map(j => 
      j.status === 'failed' ? { ...j, status: 'pending', progress: 0, error: undefined, currentStep: language === 'ar' ? 'في الانتظار' : 'Pending' } : j
    ));
  };

  const skipAllWithImages = () => {
    setJobs(prev => prev.map(j => 
      j.publicIds.length > 0 && j.status === 'pending' 
        ? { ...j, status: 'skipped', currentStep: language === 'ar' ? 'تم التخطي' : 'Skipped', progress: 0 }
        : j
    ));
  };

  const selectAll = () => {
    const pendingIds = jobs.filter(j => j.status === 'pending' || j.status === 'failed').map(j => j.productId);
    setSelectedProductIds(new Set(pendingIds));
  };

  const deselectAll = () => {
    setSelectedProductIds(new Set());
  };

  const toggleSelect = (productId: string) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const generateSelected = () => {
    setJobs(prev => prev.map(j => 
      selectedProductIds.has(j.productId) && (j.status === 'pending' || j.status === 'failed')
        ? { ...j, status: 'pending' }
        : j
    ));
    processQueue();
  };

  const exportResults = () => {
    const results = jobs.map(j => ({
      productId: j.productId,
      productName: j.productName,
      slug: j.productSlug,
      category: j.categorySlug,
      status: j.status,
      imageCount: j.generatedCount,
      publicIds: j.publicIds.join(','),
      error: j.error || ''
    }));
    const csv = ['Product ID,Product Name,Slug,Category,Status,Image Count,Public IDs,Error', 
      ...results.map(r => `"${r.productId}","${r.productName}","${r.slug}","${r.category}","${r.status}",${r.imageCount},"${r.publicIds}","${r.error}"`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generation-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-violet-500/10 opacity-30 pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center gap-3">
                <FiCpu className="text-emerald-400" />
                {language === 'ar' ? 'مولد صور الذكاء الاصطناعي الشامل' : 'Bulk AI Image Generator'}
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl">
                {language === 'ar' 
                  ? 'ولّد صور منتجات احترافية للكتالوج كاملاً - استوديو أبيض نقي 2000×2000 مع إضاءة سينمائية'
                  : 'Generate professional catalog images for all products - Pure white studio 2000×2000 with cinematic lighting'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={startGeneration}
                disabled={isGenerating || stats.pending === 0}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {isGenerating ? <FiPause className="animate-pulse" /> : <FiPlay />}
                <span>{isGenerating ? (language === 'ar' ? 'جاري التوليد...' : 'Generating...') : (language === 'ar' ? 'بدء التوليد الشامل' : 'Start Bulk Generation')}</span>
              </button>
              <button 
                onClick={pauseGeneration}
                disabled={!isGenerating}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition disabled:opacity-50"
              >
                <FiPause /> {language === 'ar' ? 'إيقاف' : 'Pause'}
              </button>
              <button 
                onClick={exportResults}
                className="inline-flex items-center gap-2 px-5 py-3 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 text-violet-400 font-medium rounded-xl transition"
              >
                <FiDownload /> {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: language === 'ar' ? 'إجمالي المنتجات' : 'Total Products', value: stats.total, color: 'from-blue-500 to-indigo-600', icon: FiBarChart2 },
            { label: language === 'ar' ? 'مكتمل' : 'Completed', value: stats.completed, color: 'from-emerald-500 to-teal-600', icon: FiCheckCircle },
            { label: language === 'ar' ? 'قيد المعالجة' : 'Processing', value: stats.processing, color: 'from-amber-500 to-orange-600', icon: FiClock },
            { label: language === 'ar' ? 'في الانتظار' : 'Pending', value: stats.pending, color: 'from-violet-500 to-fuchsia-600', icon: FiUsers },
            { label: language === 'ar' ? 'فشل' : 'Failed', value: stats.failed, color: 'from-rose-500 to-red-600', icon: FiAlertCircle },
            { label: language === 'ar' ? 'تم التخطي' : 'Skipped', value: stats.skipped, color: 'from-slate-500 to-slate-600', icon: FiSkipForward },
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                <stat.icon />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FiSettings className="text-emerald-400" />
              {language === 'ar' ? 'خيارات التوليد' : 'Generation Options'}
            </h2>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={skipExisting} 
                  onChange={e => { setSkipExisting(e.target.checked); initializeJobs(); }}
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700 rounded focus:ring-emerald-500"
                />
                {language === 'ar' ? 'تخطي المنتجات التي لها صور' : 'Skip products with existing images'}
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={regenerateFailed} 
                  onChange={e => setRegenerateFailed(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700 rounded focus:ring-emerald-500"
                />
                {language === 'ar' ? 'إعادة محاولة الفاشلة' : 'Retry failed products'}
              </label>
              <button 
                onClick={skipAllWithImages}
                className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg transition text-sm"
              >
                {language === 'ar' ? 'تخطي الكل مع صور' : 'Skip All with Images'}
              </button>
              <button 
                onClick={retryFailed}
                disabled={stats.failed === 0}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 rounded-lg transition text-sm disabled:opacity-50"
              >
                {language === 'ar' ? 'إعادة محاولة الفاشلة' : 'Retry Failed'}
              </button>
            </div>
          </div>

          {/* Filter & Selection */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'processing', 'completed', 'failed', 'skipped'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    filterStatus === status
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {language === 'ar' 
                    ? { all: 'الكل', pending: 'بانتظار', processing: 'معالجة', completed: 'مكتمل', failed: 'فشل', skipped: 'متخطى' }[status]
                    : { all: 'All', pending: 'Pending', processing: 'Processing', completed: 'Completed', failed: 'Failed', skipped: 'Skipped' }[status]
                  }
                  <span className="ml-1 px-1.5 py-0.5 bg-white/10 rounded text-[10px]">
                    {jobs.filter(j => status === 'all' || j.status === status).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={selectAll} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20">
                {language === 'ar' ? 'تحديد الكل' : 'Select All'}
              </button>
              <button onClick={deselectAll} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-700">
                {language === 'ar' ? 'إلغاء التحديد' : 'Deselect All'}
              </button>
              <button 
                onClick={generateSelected}
                disabled={selectedProductIds.size === 0 || isGenerating}
                className="px-4 py-1.5 bg-violet-500 hover:bg-violet-400 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                <FiZap className="w-4 h-4 inline mr-1" />
                {language === 'ar' ? 'توليد المحدد' : 'Generate Selected'}
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">{selectedProductIds.size}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Jobs Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 w-10 text-center">{language === 'ar' ? '#' : '#'}</th>
                  <th className="p-4 text-right">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th className="p-4 text-right w-48">{language === 'ar' ? 'القسم' : 'Category'}</th>
                  <th className="p-4 text-center w-24">{language === 'ar' ? 'صور' : 'Images'}</th>
                  <th className="p-4 text-center w-32">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="p-4 text-center w-40">{language === 'ar' ? 'التقدم' : 'Progress'}</th>
                  <th className="p-4 text-right w-64">{language === 'ar' ? 'الخطوة الحالية' : 'Current Step'}</th>
                  <th className="p-4 text-center w-28">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredJobs.map((job, index) => (
                  <tr key={job.id} className={`hover:bg-white/[0.02] transition ${job.status === 'processing' ? 'bg-emerald-500/5' : ''} ${job.status === 'failed' ? 'bg-rose-500/5' : ''}`}>
                    <td className="p-4 text-center text-slate-500 text-sm font-mono">{index + 1}</td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {job.publicIds[0] && (
                          <img 
                            src={buildImageUrl(job.publicIds[0], { width: 50, height: 50, crop: 'fill' }).primary} 
                            alt={job.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10"
                            loading="lazy"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[200px]">{job.productName}</p>
                          <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">{job.productSlug}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.has(job.productId)}
                              onChange={() => toggleSelect(job.productId)}
                              className="w-3.5 h-3.5 text-emerald-500 bg-slate-800 border-slate-700 rounded focus:ring-emerald-500"
                            />
                            <span className="text-[10px] text-slate-500">
                              {language === 'ar' ? 'تحديد' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {language === 'ar' ? job.categorySlug : job.categorySlug}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                        job.generatedCount >= 4 ? 'bg-emerald-500/20 text-emerald-400' :
                        job.generatedCount > 0 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {job.generatedCount}/4
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        job.status === 'processing' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                        job.status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
                        job.status === 'skipped' ? 'bg-slate-800 text-slate-400' :
                        'bg-violet-500/20 text-violet-400'
                      }`}>
                        {job.status === 'completed' && <FiCheckCircle className="w-3 h-3" />}
                        {job.status === 'processing' && <FiCpu className="w-3 h-3 animate-spin" />}
                        {job.status === 'failed' && <FiAlertCircle className="w-3 h-3" />}
                        {job.status === 'skipped' && <FiSkipForward className="w-3 h-3" />}
                        {job.status === 'pending' && <FiClock className="w-3 h-3" />}
                        {language === 'ar' 
                          ? { completed: 'مكتمل', processing: 'جاري', failed: 'فشل', skipped: 'متخطى', pending: 'بانتظار' }[job.status]
                          : job.status
                        }
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-full transition-all ${
                            job.status === 'completed' ? 'bg-emerald-500' :
                            job.status === 'processing' ? 'bg-amber-500' :
                            job.status === 'failed' ? 'bg-rose-500' :
                            'bg-violet-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">{job.progress}%</span>
                    </td>

                    <td className="p-4 text-right">
                      <p className="text-xs text-slate-400 truncate max-w-[140px]" title={job.currentStep}>
                        {job.currentStep}
                      </p>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {job.status === 'pending' || job.status === 'failed' ? (
                          <button
                            onClick={() => {
                              setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'pending', progress: 0, error: undefined } : j));
                              generateImagesForProduct(job);
                            }}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition"
                            title={language === 'ar' ? 'توليد' : 'Generate'}
                          >
                            <FiZap className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                        {job.status === 'completed' && job.publicIds.length > 0 && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(job.publicIds.join('\n'));
                              toast.success(language === 'ar' ? 'تم نسخ المعرفات' : 'Public IDs copied');
                            }}
                            className="p-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-lg transition"
                            title={language === 'ar' ? 'نسخ المعرفات' : 'Copy IDs'}
                          >
                            <FiDownload className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {job.status === 'failed' && (
                          <button
                            onClick={() => {
                              setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'pending', progress: 0, error: undefined } : j));
                              generateImagesForProduct(job);
                            }}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                            title={language === 'ar' ? 'إعادة محاولة' : 'Retry'}
                          >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <FiFilter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'ar' ? 'لا توجد منتجات تطابق الفلتر' : 'No products match the filter'}</p>
            </div>
          )}
        </motion.div>

        {/* Generation Progress Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
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
                    {language === 'ar' ? 'جاري توليد صور الذكاء الاصطناعي' : 'Generating AI Product Images'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {language === 'ar'
                      ? `منتج ${currentJobIndex + 1} من ${jobs.filter(j => j.status !== 'skipped').length}`
                      : `Product ${currentJobIndex + 1} of ${jobs.filter(j => j.status !== 'skipped').length}`}
                  </p>
                </div>

                <div className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{language === 'ar' ? 'التقدم الكلي' : 'Overall Progress'}</span>
                    <span className="font-mono text-emerald-400">
                      {Math.round((stats.completed / Math.max(1, stats.total - stats.skipped)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${(stats.completed / Math.max(1, stats.total - stats.skipped)) * 100}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-emerald-500/10 p-2 rounded text-emerald-400">
                      <div className="font-bold text-lg">{stats.completed}</div>
                      <div>{language === 'ar' ? 'مكتمل' : 'Done'}</div>
                    </div>
                    <div className="bg-amber-500/10 p-2 rounded text-amber-400">
                      <div className="font-bold text-lg">{stats.processing}</div>
                      <div>{language === 'ar' ? 'قيد المعالجة' : 'Processing'}</div>
                    </div>
                    <div className="bg-rose-500/10 p-2 rounded text-rose-400">
                      <div className="font-bold text-lg">{stats.failed}</div>
                      <div>{language === 'ar' ? 'فشل' : 'Failed'}</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded text-slate-400">
                      <div className="font-bold text-lg">{stats.pending}</div>
                      <div>{language === 'ar' ? 'بانتظار' : 'Pending'}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-300 font-mono truncate">
                    {jobs[currentJobIndex]?.currentStep || 'Initializing...'}
                  </p>
                </div>

                <button
                  onClick={pauseGeneration}
                  className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition flex items-center gap-2"
                >
                  <FiPause /> {language === 'ar' ? 'إيقاف التوليد' : 'Stop Generation'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}