'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiTrash2, 
  FiEdit3, 
  FiCheck, 
  FiX, 
  FiLayers,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

interface Category {
  _id: Id<"categories">;
  name: string;
  nameEn: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  imagePublicId?: string;
  sortOrder?: number;
  active: boolean;
}

export default function AdminCategoriesPage() {
  const { language } = useLanguage();
  
  // Queries & Mutations from Convex
  const categories = useQuery(api.products.getAllCategoriesAdmin) as Category[] | undefined;
  const addCategoryMutation = useMutation(api.products.addCategory);
  const updateCategoryMutation = useMutation(api.products.updateCategory);
  const deleteCategoryMutation = useMutation(api.products.deleteCategory);

  // Local State
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    sortOrder: 0,
    active: true,
  });

  // Handle Edit Trigger
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn,
      slug: category.slug,
      description: category.description || '',
      descriptionEn: category.descriptionEn || '',
      sortOrder: category.sortOrder || 0,
      active: category.active,
    });
    setIsModalOpen(true);
  };

  // Handle Create Trigger
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      sortOrder: (categories?.length || 0) + 1,
      active: true,
    });
    setIsModalOpen(true);
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Edit category
        await updateCategoryMutation({
          id: editingCategory._id,
          name: formData.name,
          nameEn: formData.nameEn,
          slug: formData.slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          sortOrder: formData.sortOrder,
          active: formData.active,
        });
        toast.success(language === 'ar' ? 'تم تحديث الفئة بنجاح!' : 'Category updated successfully!');
      } else {
        // Create category
        await addCategoryMutation({
          name: formData.name,
          nameEn: formData.nameEn,
          slug: formData.slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          sortOrder: formData.sortOrder,
          active: formData.active,
        });
        toast.success(language === 'ar' ? 'تم إنشاء الفئة بنجاح!' : 'Category created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (language === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: Id<"categories">) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) return;
    
    try {
      await deleteCategoryMutation({ id });
      toast.success(language === 'ar' ? 'تم حذف الفئة بنجاح!' : 'Category deleted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (language === 'ar' ? 'فشل الحذف' : 'Deletion failed'));
    }
  };

  // Filter Categories
  const filteredCategories = categories?.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiLayers className="text-green-600 dark:text-green-400" />
              {language === 'ar' ? 'إدارة الفئات' : 'Category Management'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'ar' ? 'تنظيم وإدارة تصنيفات السوبرماركت المختلفة' : 'Organize and manage the different supermarket categories'}
            </p>
          </div>
          
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
          >
            <FiPlus />
            {language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث عن فئة...' : 'Search categories...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          
          <div className="text-sm text-gray-500">
            {language === 'ar' ? `إجمالي الفئات: ${filteredCategories?.length || 0}` : `Total Categories: ${filteredCategories?.length || 0}`}
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <th className="p-4">{language === 'ar' ? 'الترتيب' : 'Sort'}</th>
                  <th className="p-4">{language === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th className="p-4">{language === 'ar' ? 'الرابط (Slug)' : 'Slug'}</th>
                  <th className="p-4">{language === 'ar' ? 'الوصف' : 'Description'}</th>
                  <th className="p-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="p-4 text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories ? (
                  filteredCategories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors text-sm">
                      <td className="p-4 font-semibold text-gray-400">#{category.sortOrder || 0}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{category.nameEn}</div>
                        <div className="text-xs text-gray-400">{category.name}</div>
                      </td>
                      <td className="p-4 font-mono text-xs">{category.slug}</td>
                      <td className="p-4 max-w-xs truncate text-gray-500">
                        {category.descriptionEn || category.description || '-'}
                      </td>
                      <td className="p-4">
                        {category.active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <FiEye className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'نشط' : 'Active'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                            <FiEyeOff className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'غير نشط' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title={language === 'ar' ? 'تعديل' : 'Edit'}
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {editingCategory 
                      ? (language === 'ar' ? 'تعديل الفئة' : 'Edit Category') 
                      : (language === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category')}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name EN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>

                  {/* Name AR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ar' ? 'الرابط (Slug)' : 'Slug'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm"
                    />
                  </div>

                  {/* Description EN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm h-20"
                    />
                  </div>

                  {/* Sort Order & Active */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {language === 'ar' ? 'الترتيب' : 'Sort Order'}
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.sortOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>

                    <div className="flex items-end pb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                          className="w-5 h-5 accent-green-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {language === 'ar' ? 'نشط (مرئي)' : 'Active (Visible)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-colors"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : <FiCheck />}
                      {language === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
