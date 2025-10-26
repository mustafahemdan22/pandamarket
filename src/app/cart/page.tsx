'use client';

import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { language, isRTL } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
      toast.success(language === 'ar' ? 'تم إزالة المنتج من السلة' : 'Product removed from cart');
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success(language === 'ar' ? 'تم إزالة المنتج من السلة' : 'Product removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success(language === 'ar' ? 'تم إفراغ السلة' : 'Cart cleared');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error(language === 'ar' ? 'السلة فارغة' : 'Cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'عربة التسوق فارغة' : 'Your Cart is Empty'}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {language === 'ar' 
                ? 'ابدأ التسوق وأضف بعض المنتجات الرائعة إلى سلة التسوق الخاصة بك' 
                : 'Start shopping and add some amazing products to your cart'
              }
            </p>
            
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FiArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? 'عربة التسوق' : 'Shopping Cart'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' 
              ? `${itemCount} ${itemCount === 1 ? 'منتج' : 'منتجات'} في السلة` 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart`
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {language === 'ar' ? 'المنتجات' : 'Products'}
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {language === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 flex items-center space-x-4 rtl:space-x-reverse"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? `$${item.product.price} × ${item.quantity}` : `$${item.product.price} × ${item.quantity}`}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'عدد المنتجات' : 'Items'}
                  </span>
                  <span className="text-gray-900 dark:text-white">{itemCount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'التوصيل' : 'Delivery'}
                  </span>
                  <span className="text-green-600">
                    {language === 'ar' ? 'مجاني' : 'Free'}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {language === 'ar' ? 'المجموع' : 'Total'}
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 mb-4"
              >
                {language === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
              </button>

              <Link
                href="/categories"
                className="block text-center text-green-600 hover:text-green-700 font-medium"
              >
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
