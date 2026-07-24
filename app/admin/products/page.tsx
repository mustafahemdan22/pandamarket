'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLayers, 
  FiShoppingBag,
  FiX,
  FiCheck,
  FiLoader,
  FiDollarSign,
  FiPackage,
  FiImage
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
  imagePublicIds?: string[];
  categoryId: Id<"categories">;
  brand: string;
  unit: string;
  description?: string;
  descriptionEn?: string;
  stock?: number;
  discount?: number;
  isActive: boolean;
  categorySlug: string;
  categoryName: string;
}

export default function AdminProductsPage() {
  const { language } = useLanguage();
  
  // Queries & Mutations
  const products = useQuery(api.products.getAllProductsAdmin) as AdminProduct[] | undefined;
  const categories = useQuery(api.products.getCategories);
  const deleteProductMutation = useMutation(api.products.deleteProduct);
  const addProductMutation = useMutation(api.products.addProduct);
  const updateProductMutation = useMutation(api.products.updateProduct);
  const updateStockMutation = useMutation(api.products.updateStock);

  // Local State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low_stock, out_of_stock
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<Id<"products"> | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    price: 0,
    compareAtPrice: 0,
    categoryId: '',
    brand: 'Generic',
    unit: '1 unit',
    description: '',
    descriptionEn: '',
    stock: 100,
    discount: 0,
    isActive: true,
    imagePublicId: 'pandamarket/categories/pantry/products/al-doha-rice-5kg/1',
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameEn: '',
      slug: '',
      price: 10,
      compareAtPrice: 12,
      categoryId: categories && categories.length > 0 ? categories[0]._id : '',
      brand: 'Panda',
      unit: '1 kg',
      description: '',
      descriptionEn: '',
      stock: 100,
      discount: 0,
      isActive: true,
      imagePublicId: 'pandamarket/categories/pantry/products/al-doha-rice-5kg/1',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice || product.price,
      categoryId: product.categoryId,
      brand: product.brand,
      unit: product.unit,
      description: product.description || '',
      descriptionEn: product.descriptionEn || '',
      stock: product.stock ?? 100,
      discount: product.discount || 0,
      isActive: product.isActive,
      imagePublicId: product.imagePublicId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.name || !formData.categoryId || !formData.price) {
      toast.error(language === 'ar' ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProductMutation({
          id: editingProduct._id,
          name: formData.name,
          nameEn: formData.nameEn,
          slug: formData.slug || formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: Number(formData.price),
          compareAtPrice: Number(formData.compareAtPrice),
          categoryId: formData.categoryId as Id<"categories">,
          brand: formData.brand,
          unit: formData.unit,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          stock: Number(formData.stock),
          discount: Number(formData.discount),
          isActive: formData.isActive,
          imagePublicId: formData.imagePublicId,
        });
        toast.success(language === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully!');
      } else {
        const slug = formData.slug || formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await addProductMutation({
          name: formData.name,
          nameEn: formData.nameEn,
          slug,
          price: Number(formData.price),
          compareAtPrice: Number(formData.compareAtPrice),
          imagePublicId: formData.imagePublicId,
          imagePublicIds: [formData.imagePublicId],
          categoryId: formData.categoryId as Id<"categories">,
          brand: formData.brand,
          unit: formData.unit,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          stock: Number(formData.stock),
          discount: Number(formData.discount),
          isActive: formData.isActive,
        });
        toast.success(language === 'ar' ? 'تم إضافة المنتج بنجاح' : 'Product created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"products">) => {
    try {
      await deleteProductMutation({ id });
      toast.success(language === 'ar' ? 'تم حذف المنتج' : 'Product deleted');
      setDeleteConfirmId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const handleToggleActive = async (product: AdminProduct) => {
    try {
      await updateProductMutation({
        id: product._id,
        isActive: !product.isActive,
      });
      toast.success(language === 'ar' ? 'تم تحديث حالة المنتج' : 'Status updated');
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  // Filter products logic
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch =
      product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low_stock') {
      matchesStock = (product.stock ?? 100) > 0 && (product.stock ?? 100) < 10;
    } else if (stockFilter === 'out_of_stock') {
      matchesStock = (product.stock ?? 100) === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (products === undefined || categories === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">
          {language === 'ar' ? 'جاري تحميل كتالوج المنتجات...' : 'Loading Product Catalog...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {language === 'ar' 
              ? `إجمالي ${products.length} منتج في كتالوج المتجر` 
              : `Total ${products.length} products in store catalog`}
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm"
        >
          <FiPlus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'البحث عن منتج بالتأثير أو الاسم...' : 'Search by name, brand, or slug...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {language === 'ar' ? c.name : c.nameEn}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">{language === 'ar' ? 'جميع حالات المخزون' : 'All Stock Status'}</option>
            <option value="low_stock">{language === 'ar' ? 'مخزون منخفض (<10)' : 'Low Stock (<10)'}</option>
            <option value="out_of_stock">{language === 'ar' ? 'نفذت الكمية (0)' : 'Out of Stock (0)'}</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">{language === 'ar' ? 'المنتج' : 'Product'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'الفئة والماركة' : 'Category & Brand'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'السعر' : 'Price'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'المخزون' : 'Stock'}</th>
                <th className="px-6 py-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {language === 'ar' ? 'لم يتم العثور على منتجات مطابقة' : 'No products found matching filters.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stock = product.stock ?? 100;
                  const isLow = stock > 0 && stock < 10;
                  const isOut = stock === 0;

                  return (
                    <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-12 h-12 relative rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                            <Image
                              src={buildImageUrl(product.imagePublicId, { width: 100, height: 100 }).primary}
                              alt={product.nameEn}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{product.nameEn}</div>
                            <div className="text-xs text-slate-400 dir-rtl">{product.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{product.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-200">{product.categoryName || 'General'}</div>
                        <div className="text-[11px] text-slate-400">{product.brand} • {product.unit}</div>
                      </td>

                      <td className="px-6 py-4 font-mono">
                        <div className="font-bold text-emerald-400">${product.price.toFixed(2)}</div>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <div className="text-xs text-slate-500 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isOut
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : isLow
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {stock} {language === 'ar' ? 'قطعة' : 'in stock'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            product.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {product.isActive
                            ? language === 'ar' ? 'نشط' : 'Active'
                            : language === 'ar' ? 'معطل' : 'Disabled'}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product._id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <FiAlertCircle className="w-10 h-10 text-red-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ar' ? 'تأكيد حذف المنتج' : 'Confirm Product Deletion'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'هل أنت تأكد من إلغاء هذا المنتج نهائياً من الكتالوج؟' : 'Are you sure you want to permanently delete this product?'}
            </p>
            <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
              >
                {language === 'ar' ? 'حذف الآن' : 'Delete Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingProduct
                  ? language === 'ar' ? 'تعديل بيانات المنتج' : 'Edit Product'
                  : language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                    placeholder="e.g. Al Doha Rice 5kg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 dir-rtl">
                    الاسم بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 dir-rtl"
                    placeholder="أرز الضحى 5 كيلو"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Compare Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Brand & Unit
                  </label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <input
                      type="text"
                      placeholder="Brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g. 500g)"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Cloudinary Public ID
                </label>
                <input
                  type="text"
                  value={formData.imagePublicId}
                  onChange={(e) => setFormData({ ...formData, imagePublicId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs transition-colors flex items-center space-x-2"
                >
                  {isSubmitting && <FiLoader className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
