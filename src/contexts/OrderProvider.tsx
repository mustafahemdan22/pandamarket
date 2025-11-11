'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../store/cartSlice';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'panda-orders';

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // ✅ useRef لحفظ الـ timeouts
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // ✅ Load orders from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
      }
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ✅ Save orders to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders, isLoaded]);

  // ✅ Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PANDA-${timestamp}-${random}`;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      orderDate: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    
    // ✅ Simulate order status updates with cleanup
    const timeout1 = setTimeout(() => {
      updateOrderStatus(newOrder.id, 'confirmed');
    }, 2000);
    
    const timeout2 = setTimeout(() => {
      updateOrderStatus(newOrder.id, 'processing');
    }, 10000);
    
    const timeout3 = setTimeout(() => {
      updateOrderStatus(newOrder.id, 'shipped');
    }, 30000);

    // ✅ حفظ الـ timeouts للتنظيف
    timeoutsRef.current.push(timeout1, timeout2, timeout3);

    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status,
              deliveryDate: status === 'delivered' ? new Date().toISOString() : order.deliveryDate,
              trackingNumber: status === 'shipped' && !order.trackingNumber
                ? `TRK${Date.now().toString().slice(-8)}` 
                : order.trackingNumber
            }
          : order
      )
    );

    // ✅ تحديث currentOrder إذا كان هو المطلوب
    setCurrentOrder(prev => 
      prev?.id === orderId 
        ? { 
            ...prev, 
            status,
            deliveryDate: status === 'delivered' ? new Date().toISOString() : prev.deliveryDate,
            trackingNumber: status === 'shipped' && !prev.trackingNumber
              ? `TRK${Date.now().toString().slice(-8)}` 
              : prev.trackingNumber
          } 
        : prev
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const value: OrderContextType = {
    orders,
    currentOrder,
    addOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    clearCurrentOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
