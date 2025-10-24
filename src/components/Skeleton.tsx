'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave';
}

const Skeleton = ({ className = '', variant = 'rectangular', animation = 'pulse' }: SkeletonProps) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : 'animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${animationClasses} ${variantClasses[variant]} ${className}`}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" variant="text" />
        
        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-2/3" variant="text" />
        
        {/* Price and Button Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-full max-w-32" />
        </div>
      </div>
    </div>
  );
};

// Category Card Skeleton
export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Icon Skeleton */}
        <Skeleton className="w-16 h-16" variant="circular" />
        
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" variant="text" />
        
        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
        
        {/* Arrow Skeleton */}
        <Skeleton className="h-4 w-20" variant="text" />
      </div>
    </div>
  );
};

// Text Skeleton
export const TextSkeleton = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          className={`h-4 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`} 
          variant="text" 
        />
      ))}
    </div>
  );
};

export default Skeleton;
