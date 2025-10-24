import { notFound } from 'next/navigation';
import { sampleProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

type Props = {
  params: { category: string };
};

export default function CategoryPage({ params }: Props) {
  const { category } = params;

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 capitalize">
          {category} Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
