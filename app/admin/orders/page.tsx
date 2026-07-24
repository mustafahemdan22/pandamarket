'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { 
  FiShoppingBag, 
  FiSearch, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiLoader, 
  FiEye, 
  FiUser, 
  FiMapPin, 
  FiDollarSign,
  FiX
} from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const { language } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOrder, setActiveOrder] = useState<any>(null);

  const orders = useQuery(api.orders.getAllOrdersAdmin, {
    status: selectedStatus,
    search: searchTerm,
  });

  const updateStatusMutation = useMutation(api.orders.updateOrderStatusAdmin);
  const cancelOrderMutation = useMutation(api.orders.cancelOrderAdmin);

  const handleUpdateStatus = async (id: Id<"orders">, status: any) => {
    try {
      await updateStatusMutation({ id, status });
      toast.success(`Order status updated to ${status}`);
      if (activeOrder && activeOrder._id === id) {
        setActiveOrder({ ...activeOrder, status });
      }
    } catch (err: any) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleCancelOrder = async (id: Id<"orders">) => {
    if (!confirm('Are you sure you want to cancel this order? Inventory will be restored.')) return;
    try {
      await cancelOrderMutation({ id });
      toast.success('Order cancelled & inventory restored');
      if (activeOrder && activeOrder._id === id) {
        setActiveOrder({ ...activeOrder, status: 'cancelled' });
      }
    } catch (err: any) {
      toast.error(err.message || 'Cancel failed');
    }
  };

  const statuses = [
    { id: 'all', label: language === 'ar' ? 'جميع الطلبات' : 'All Orders' },
    { id: 'pending', label: language === 'ar' ? 'قيد الانتظار' : 'Pending' },
    { id: 'processing', label: language === 'ar' ? 'قيد التجهيز' : 'Processing' },
    { id: 'shipped', label: language === 'ar' ? 'تم الشحن' : 'Shipped' },
    { id: 'delivered', label: language === 'ar' ? 'تم التوصيل' : 'Delivered' },
    { id: 'cancelled', label: language === 'ar' ? 'ملغاة' : 'Cancelled' },
  ];

  if (orders === undefined) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <FiLoader className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Loading Customer Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {language === 'ar' ? 'إدارة الطلبات والشحن' : 'Order Management'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {language === 'ar' ? `إجمالي ${orders.length} طلبات مسجلة` : `Total ${orders.length} orders recorded`}
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto pb-2 border-b border-slate-800">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No orders found matching parameters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isHighValue = (order.total || 0) > 300;
                  return (
                    <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                        {order.orderNumber}
                        {isHighValue && (
                          <span className="ml-2 rtl:mr-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px]">
                            HIGH VALUE
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </div>
                        <div className="text-xs text-slate-400">{order.customerInfo.email}</div>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        {order.items.length} items ({order.items.map((i) => i.productName).slice(0, 2).join(', ')})
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-white">
                        ${(order.total || 0).toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value as any)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-200 focus:border-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => setActiveOrder(order)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="View Order Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Cancel Order"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">Order {activeOrder.orderNumber}</h2>
                <span className="text-xs text-slate-400">
                  {new Date(activeOrder.createdAt || Date.now()).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setActiveOrder(null)} className="text-slate-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block mb-1">Customer Info</span>
                <p className="font-semibold text-white">{activeOrder.customerInfo.firstName} {activeOrder.customerInfo.lastName}</p>
                <p className="text-slate-400">{activeOrder.customerInfo.email}</p>
                <p className="text-slate-400">{activeOrder.customerInfo.phone}</p>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Shipping Address</span>
                <p className="text-slate-300">{activeOrder.shippingAddress.street}</p>
                <p className="text-slate-300">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state}</p>
                <p className="text-slate-300">{activeOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Items</h4>
              <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                {activeOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <p className="text-slate-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="font-mono font-bold text-emerald-400">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-slate-800 pt-3 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono">${activeOrder.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee:</span>
                <span className="font-mono">${activeOrder.deliveryFee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-400">${activeOrder.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
