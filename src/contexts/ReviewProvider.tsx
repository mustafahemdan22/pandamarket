'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => void;
  getReviewsByProduct: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
  getRatingDistribution: (productId: string) => { [key: number]: number };
  markHelpful: (reviewId: string) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

interface ReviewProviderProps {
  children: React.ReactNode;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('panda-reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error loading reviews from localStorage:', error);
      }
    } else {
      // Add some sample reviews
      const sampleReviews: Review[] = [
        {
          id: '1',
          productId: '1',
          userId: 'user1',
          userName: 'أحمد محمد',
          rating: 5,
          title: 'خبز طازج جداً',
          comment: 'الخبز طازج ولذيذ جداً، أنصح به بشدة',
          date: new Date(Date.now() - 86400000).toISOString(),
          helpful: 12,
          verified: true
        },
        {
          id: '2',
          productId: '1',
          userId: 'user2',
          userName: 'فاطمة أحمد',
          rating: 4,
          title: 'جيد جداً',
          comment: 'الخبز طازج والجودة ممتازة',
          date: new Date(Date.now() - 172800000).toISOString(),
          helpful: 8,
          verified: true
        },
        {
          id: '3',
          productId: '4',
          userId: 'user3',
          userName: 'محمد علي',
          rating: 5,
          title: 'فلفل أسود ممتاز',
          comment: 'الفلفل الأسود عالي الجودة والنكهة قوية',
          date: new Date(Date.now() - 259200000).toISOString(),
          helpful: 15,
          verified: true
        },
        {
          id: '4',
          productId: '7',
          userId: 'user4',
          userName: 'سارة خالد',
          rating: 4,
          title: 'أرز بسمتي رائع',
          comment: 'الأرز طويل الحبة ومطبوخ بشكل مثالي',
          date: new Date(Date.now() - 345600000).toISOString(),
          helpful: 6,
          verified: false
        },
        {
          id: '5',
          productId: '16',
          userId: 'user5',
          userName: 'عبدالله سالم',
          rating: 5,
          title: 'طماطم طازجة',
          comment: 'الطماطم طازجة ولذيذة، أنصح بها',
          date: new Date(Date.now() - 432000000).toISOString(),
          helpful: 9,
          verified: true
        }
      ];
      setReviews(sampleReviews);
    }
  }, []);

  // Save reviews to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panda-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      helpful: 0,
      verified: true // In a real app, this would be determined by purchase history
    };
    
    setReviews(prev => [newReview, ...prev]);
  };

  const getReviewsByProduct = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const getAverageRating = (productId: string) => {
    const productReviews = getReviewsByProduct(productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / productReviews.length;
  };

  const getRatingDistribution = (productId: string) => {
    const productReviews = getReviewsByProduct(productId);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    productReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    
    return distribution;
  };

  const markHelpful = (reviewId: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const value: ReviewContextType = {
    reviews,
    addReview,
    getReviewsByProduct,
    getAverageRating,
    getRatingDistribution,
    markHelpful,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};


