'use client';

import { motion } from 'framer-motion';
import { useOrders } from '@/contexts/OrderProvider';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useAuth } from '@/contexts/AuthProvider';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiArrowLeft, FiMapPin, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const OrderDetailPage = () => {
  const params = useParams();
  const { getOrderById } = useOrders();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const orderId = params?.id as string;
  const order = getOrderById(orderId);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'الطلب غير موجود' : 'Order Not Found'}
          </h1>
          <Link
            href="/orders"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === 'ar' ? 'العودة للطلبات' : 'Back to Orders'}
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      case 'confirmed':
        return <FiCheckCircle className="w-6 h-6 text-blue-500" />;
      case 'processing':
        return <FiPackage className="w-6 h-6 text-orange-500" />;
      case 'shipped':
        return <FiTruck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FiClock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: language === 'ar' ? 'في الانتظار' : 'Pending',
      confirmed: language === 'ar' ? 'مؤكد' : 'Confirmed',
      processing: language === 'ar' ? 'قيد المعالجة' : 'Processing',
      shipped: language === 'ar' ? 'تم الشحن' : 'Shipped',
      delivered: language === 'ar' ? 'تم التسليم' : 'Delivered',
      cancelled: language === 'ar' ? 'ملغي' : 'Cancelled',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getProductEmoji = (category: string, name: string) => {
    const lowerName = name.toLowerCase();
    
    if (category === 'bakery') {
      if (lowerName.includes('bread')) return '🍞';
      if (lowerName.includes('croissant')) return '🥐';
      if (lowerName.includes('cake')) return '🍰';
      return '🥖';
    }
    
    if (category === 'spices') {
      if (lowerName.includes('pepper')) return '🫚';
      if (lowerName.includes('cumin')) return '🌿';
      if (lowerName.includes('turmeric')) return '🟡';
      return '🧂';
    }
    
    if (category === 'dry-grocery') {
      if (lowerName.includes('rice')) return '🍚';
      if (lowerName.includes('pasta')) return '🍝';
      if (lowerName.includes('lentil')) return '🫘';
      return '🌾';
    }
    
    if (category === 'cleaning') {
      if (lowerName.includes('soap')) return '🧼';
      if (lowerName.includes('detergent')) return '🧴';
      if (lowerName.includes('cleaner')) return '🧽';
      return '🧹';
    }
    
    if (category === 'bazaar') {
      if (lowerName.includes('oil')) return '🫒';
      if (lowerName.includes('honey')) return '🍯';
      if (lowerName.includes('nut')) return '🥜';
      return '🛍️';
    }
    
    if (category === 'vegetables') {
      if (lowerName.includes('tomato')) return '🍅';
      if (lowerName.includes('carrot')) return '🥕';
      if (lowerName.includes('pepper')) return '🫑';
      if (lowerName.includes('spinach')) return '🥬';
      if (lowerName.includes('onion')) return '🧅';
      return '🥬';
    }
    
    return '🛒';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400">
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-green-600 dark:hover:text-green-400">
              {language === 'ar' ? 'الطلبات' : 'Orders'}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">#{order.orderNumber}</span>
          </nav>
        </motion.div>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'ar' ? 'طلب رقم' : 'Order'} #{order.orderNumber}
              </h1>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FiCalendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {new Date(order.orderDate).toLocaleDateString()}
                {order.deliveryDate && (
                  <>
                    <span className="mx-2">•</span>
                    <FiTruck className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {language === 'ar' ? 'تم التسليم في' : 'Delivered on'} {new Date(order.deliveryDate).toLocaleDateString()}
                  </>
                )}
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse mt-4 sm:mt-0 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span>{getStatusText(order.status)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'المنتجات' : 'Order Items'}
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{getProductEmoji(item.product.category, item.product.name)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.product.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {language === 'ar' ? `الكمية: ${item.quantity}` : `Quantity: ${item.quantity}`}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'ar' ? `لكل وحدة: $${item.product.price.toFixed(2)}` : `Per unit: $${item.product.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'عدد المنتجات' : 'Items'}
                  </span>
                  <span className="text-gray-900 dark:text-white">{order.items.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className="text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
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
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'عنوان التسليم' : 'Shipping Address'}
              </h2>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {order.shippingAddress.street}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{order.customerInfo.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{order.customerInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معلومات التتبع' : 'Tracking Information'}
                </h2>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FiTruck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200 font-medium">
                      {language === 'ar' ? 'رقم التتبع:' : 'Tracking Number:'} {order.trackingNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;


