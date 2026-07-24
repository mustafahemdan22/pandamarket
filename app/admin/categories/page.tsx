'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiLoader, FiFolder, FiX, FiCheck } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const { language } = useLanguage();
  const categories = useQuery(api.products.getCategories);
  const addCategory = useMutation(api.products.addCategory);
  const updateCategory = useMutation(api.products.updateCategory);
  const deleteCategory = useMutation(api.products.deleteCategory);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    sortOrder: 1,
    active: true,
  });

  const handleOpenCreate = () => {
    setEditingCat(null);
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

  const handleOpenEdit = (cat: any) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      nameEn: cat.nameEn,
      slug: cat.slug,
      description: cat.description || '',
      descriptionEn: cat.descriptionEn || '',
      sortOrder: cat.sortOrder || 1,
      active: cat.active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.name) {
      toast.error('Please enter English and Arabic names');
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = formData.slug || formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editingCat) {
        await updateCategory({
          id: editingCat._id,
          name: formData.name,
          nameEn: formData.nameEn,
          slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          sortOrder: Number(formData.sortOrder),
          active: formData.active,
        });
        toast.success('Category updated successfully!');
      } else {
        await addCategory({
          name: formData.name,
          nameEn: formData.nameEn,
          slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          sortOrder: Number(formData.sortOrder),
          active: formData.active,
        });
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"categories">) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory({ id });
      toast.success('Category deleted');
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  if (categories === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Loading Categories...</p>
      </div>
    );
  }

  const filteredCategories = categories.filter(
    (c) =>
      c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {language === 'ar' ? 'إدارة الفئات والتصنيفات' : 'Category Taxonomy'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {language === 'ar' ? `إجمالي ${categories.length} فئات نشطة` : `Total ${categories.length} store categories`}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 text-sm"
        >
          <FiPlus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة فئة جديدة' : 'Add Category'}</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <FiSearch className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search category by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left rtl:text-right text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Sort Order</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{cat.nameEn}</div>
                    <div className="text-xs text-slate-400 dir-rtl">{cat.name}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{cat.slug}</td>
                  <td className="px-6 py-4 font-mono">{cat.sortOrder || 1}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      cat.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {cat.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">{editingCat ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">English Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">اسم الفئة بالعربية *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white dir-rtl"
                />
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
