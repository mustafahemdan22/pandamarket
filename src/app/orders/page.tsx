'use client';

import { motion } from 'framer-motion';
import { useOrders } from '../../contexts/OrderProvider';
import { useLanguage } from '../../contexts/LanguageProvider';
import { useAuth } from '../../contexts/AuthProvider';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiEye, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

const OrderHistoryPage = () => {
  const { orders } = useOrders();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <FiCheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <FiPackage className="w-5 h-5 text-orange-500" />;
      case 'shipped':
        return <FiTruck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
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

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusOptions = [
    { value: 'all', label: language === 'ar' ? 'الكل' : 'All Orders' },
    { value: 'pending', label: language === 'ar' ? 'في الانتظار' : 'Pending' },
    { value: 'confirmed', label: language === 'ar' ? 'مؤكد' : 'Confirmed' },
    { value: 'processing', label: language === 'ar' ? 'قيد المعالجة' : 'Processing' },
    { value: 'shipped', label: language === 'ar' ? 'تم الشحن' : 'Shipped' },
    { value: 'delivered', label: language === 'ar' ? 'تم التسليم' : 'Delivered' },
    { value: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled' },
  ];

  if (orders.length === 0) {
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
              <FiPackage className="w-16 h-16 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'لا توجد طلبات' : 'No Orders Yet'}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {language === 'ar' 
                ? 'ابدأ التسوق وستظهر طلباتك هنا' 
                : 'Start shopping and your orders will appear here'
              }
            </p>
            
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              {language === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? 'تاريخ الطلبات' : 'Order History'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'ar' 
              ? `${orders.length} ${orders.length === 1 ? 'طلب' : 'طلبات'} في المجموع` 
              : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} total`
            }
          </p>
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === option.value
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {language === 'ar' ? 'طلب رقم' : 'Order'} #{order.orderNumber}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2 sm:mt-0">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                    
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center px-3 py-1 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      <FiEye className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 3).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🛒</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === 'ar' ? `الكمية: ${item.quantity}` : `Quantity: ${item.quantity}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {language === 'ar' 
                        ? `و ${order.items.length - 3} منتجات أخرى` 
                        : `and ${order.items.length - 3} more items`
                      }
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ar' 
                      ? `إجمالي ${order.items.length} ${order.items.length === 1 ? 'منتج' : 'منتجات'}` 
                      : `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'} total`
                    }
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </div>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <FiTruck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-blue-800 dark:text-blue-200">
                        {language === 'ar' ? 'رقم التتبع:' : 'Tracking Number:'} {order.trackingNumber}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty Filter State */}
        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiPackage className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'لا توجد طلبات' : 'No Orders Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ar' 
                ? 'لا توجد طلبات بهذا الحالة' 
                : 'No orders found with this status'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;


