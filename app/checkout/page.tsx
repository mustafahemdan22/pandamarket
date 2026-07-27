'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useOrders } from '../../contexts/OrderProvider';
import { useAuth } from '../../contexts/AuthProvider';
import { useLanguage } from '../../contexts/LanguageProvider';
import { clearCart } from '../../store/cartSlice';
import { FiCreditCard, FiMapPin,  FiUser, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { language } = useLanguage();

  const createOrderMutation = useMutation(api.orders.createOrder);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState<{ date: string; timeWindow: string }>({
    date: 'Today',
    timeWindow: '14:00 - 16:00',
  });
  const [substitutionPreference, setSubstitutionPreference] = useState<
    'substitute_similar' | 'call_customer' | 'do_not_substitute'
  >('substitute_similar');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: language === 'ar' ? 'مصر' : 'Egypt',
    paymentMethod: 'credit-card'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error(language === 'ar' ? 'السلة فارغة' : 'Cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Unique idempotency key per submit attempt session
      const idempotencyKey = `chk-${user.id || 'guest'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.product.id as Id<"products">,
        quantity: item.quantity,
      }));

      // Call server-validated Convex mutation
      const result = await createOrderMutation({
        idempotencyKey,
        userId: user.id,
        items: orderItems,
        deliverySlot,
        substitutionPreference,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      });

      // Clear cart on clean success
      dispatch(clearCart());

      toast.success(
        language === 'ar' 
          ? `تم تأكيد الطلب بنجاح! رقم الطلب: ${result.orderNumber}` 
          : `Order confirmed! Order #: ${result.orderNumber}`
      );
      router.push('/orders');
    } catch (err: any) {
      toast.error(
        err.message || 
        (language === 'ar' ? 'حدث خطأ أثناء تأكيد الطلب' : 'An error occurred during checkout')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first'}
          </h1>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}
          </h1>
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === 'ar' ? 'العودة للتسوق' : 'Back to Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' 
              ? `${itemCount} ${itemCount === 1 ? 'منتج' : 'منتجات'} في السلة` 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart`
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === 'ar' ? 'عنوان التسليم' : 'Shipping Address'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'العنوان' : 'Street Address'}
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'ar' ? 'المدينة' : 'City'}
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'ar' ? 'المنطقة' : 'State/Province'}
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'ar' ? 'الرمز البريدي' : 'ZIP Code'}
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'البلد' : 'Country'}
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Time Slot (Supermarket Feature) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-green-600" />
                  {language === 'ar' ? 'موعد التوصيل المفضل' : 'Preferred Delivery Time Slot'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { date: language === 'ar' ? 'اليوم' : 'Today', timeWindow: '14:00 - 16:00' },
                    { date: language === 'ar' ? 'اليوم' : 'Today', timeWindow: '18:00 - 20:00' },
                    { date: language === 'ar' ? 'غداً' : 'Tomorrow', timeWindow: '10:00 - 12:00' },
                  ].map((slot, idx) => {
                    const isSelected = deliverySlot.date === slot.date && deliverySlot.timeWindow === slot.timeWindow;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDeliverySlot(slot)}
                        className={`p-3.5 rounded-xl border text-left rtl:text-right transition-all ${
                          isSelected
                            ? 'border-green-600 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 ring-2 ring-green-500'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-green-600 dark:text-green-400">{slot.date}</div>
                        <div className="text-sm font-semibold mt-0.5">{slot.timeWindow}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Picker Substitution Preference (Supermarket Feature) */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-green-600" />
                  {language === 'ar' ? 'تفضيلات استبدال المنتجات' : 'Item Substitution Preference'}
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: 'substitute_similar',
                      labelAr: 'استبدال بمنتج مشابه من نفس الفئة (موصى به)',
                      labelEn: 'Substitute with similar brand (Recommended)',
                    },
                    {
                      id: 'call_customer',
                      labelAr: 'الاتصال بي هاتفياً قبل الاستبدال',
                      labelEn: 'Call me before making any substitution',
                    },
                    {
                      id: 'do_not_substitute',
                      labelAr: 'عدم الاستبدال وإلغاء الصنف الناقص تلقائياً',
                      labelEn: 'Do not substitute; refund unavailable items',
                    },
                  ].map((pref) => (
                    <label
                      key={pref.id}
                      className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-colors ${
                        substitutionPreference === pref.id
                          ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="substitutionPreference"
                        value={pref.id}
                        checked={substitutionPreference === pref.id}
                        onChange={() => setSubstitutionPreference(pref.id as any)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ms-3 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {language === 'ar' ? pref.labelAr : pref.labelEn}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiCreditCard className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === 'credit-card'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">
                      {language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}
                    </span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={formData.paymentMethod === 'cash-on-delivery'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">
                      {language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      <span>{language === 'ar' ? 'تأكيد الطلب' : 'Place Order'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🛒</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {language === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
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
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


