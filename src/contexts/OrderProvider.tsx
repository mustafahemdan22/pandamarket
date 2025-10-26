'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('panda-orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panda-orders', JSON.stringify(orders));
  }, [orders]);

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
    
    // Simulate order status updates
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'confirmed');
    }, 2000);
    
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'processing');
    }, 10000);
    
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'shipped');
    }, 30000);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status,
              deliveryDate: status === 'delivered' ? new Date().toISOString() : order.deliveryDate,
              trackingNumber: status === 'shipped' ? `TRK${Date.now().toString().slice(-8)}` : order.trackingNumber
            }
          : order
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const value: OrderContextType = {
    orders,
    currentOrder,
    addOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};


