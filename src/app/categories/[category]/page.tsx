'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { sampleProducts } from '../../../data/products';
import ProductCard from '../../../components/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setCategory(resolvedParams.category as string);
      } catch (error) {
        console.error('Error loading params:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadParams();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // لو الكاتيجوري مش موجودة في الداتا
  const categoryProducts = sampleProducts.filter(
    (product) => product.category === category
  );

  if (categoryProducts.length === 0) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 capitalize ">
          {category.charAt(0).toUpperCase() + category.slice(1)} Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}