// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  // Required fields (إلزامية)
  id: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  unit: string;
  
  // Optional fields (اختيارية)
  description?: string;
  descriptionEn?: string;
  stock?: number;
  compareAtPrice?: number;  // السعر قبل الخصم
  discount?: number;        // نسبة الخصم
  tags?: string[];          // ['حلال', 'عضوي']
  rating?: number;          // تقييم المنتج
  reviews?: number;         // عدد التقييمات
    images?: string[]; // ✅ أضف هذا السطر - صور إضافية للمنتج

}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  discount: number;          // قيمة الخصم المطبق
  subtotal: number;          // المجموع قبل الخصم
  deliveryFee: number;       // رسوم التوصيل
  appliedCoupon?: string;    // ✅ الكوبون المطبق
}

const CART_STORAGE_KEY = 'grocery-cart';
const FREE_DELIVERY_THRESHOLD = 200; // حد التوصيل المجاني
const DELIVERY_FEE = 20; // رسوم التوصيل الثابتة

// ✅ تحميل السلة من localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      total: 0,
      itemCount: 0,
      discount: 0,
      subtotal: 0,
      deliveryFee: 0,
      appliedCoupon: undefined,
    };
  }

  try {
    const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (serializedCart) {
      const cart = JSON.parse(serializedCart);
      // التحقق من صحة البيانات
      if (cart && Array.isArray(cart.items)) {
        return {
          ...cart,
          appliedCoupon: cart.appliedCoupon || undefined,
        };
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    // مسح البيانات الفاسدة
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }

  return {
    items: [],
    total: 0,
    itemCount: 0,
    discount: 0,
    subtotal: 0,
    deliveryFee: 0,
    appliedCoupon: undefined,
  };
};

// ✅ حفظ السلة في localStorage
const saveCartToStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

// ✅ حساب الإجماليات
const calculateTotals = (state: CartState) => {
  // حساب عدد المنتجات
  state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  
  // حساب المجموع الفرعي
  state.subtotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  // حساب رسوم التوصيل
  state.deliveryFee = state.subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  
  // حساب الإجمالي النهائي
  state.total = state.subtotal - state.discount + state.deliveryFee;
  
  // تقريب الأسعار لرقمين عشريين
  state.subtotal = Math.round(state.subtotal * 100) / 100;
  state.total = Math.max(0, Math.round(state.total * 100) / 100); // ✅ منع القيم السالبة
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        // التحقق من المخزون
        if (action.payload.stock && existingItem.quantity >= action.payload.stock) {
          console.warn('Maximum stock reached');
          return;
        }
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }

      calculateTotals(state);
      saveCartToStorage(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      
      calculateTotals(state);
      saveCartToStorage(state);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.product.id === action.payload.id);
      
      if (item) {
        const newQuantity = Math.max(0, action.payload.quantity);
        
        // التحقق من المخزون
        if (item.product.stock && newQuantity > item.product.stock) {
          item.quantity = item.product.stock;
        } else {
          item.quantity = newQuantity;
        }
        
        // Remove item if quantity is 0
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.product.id !== action.payload.id);
        }
      }

      calculateTotals(state);
      saveCartToStorage(state);
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.product.id === action.payload);
      
      if (item) {
        // التحقق من المخزون
        if (item.product.stock && item.quantity >= item.product.stock) {
          console.warn('Maximum stock reached');
          return;
        }
        item.quantity += 1;
      }

      calculateTotals(state);
      saveCartToStorage(state);
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.product.id === action.payload);
      
      if (item) {
        item.quantity -= 1;
        
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.product.id !== action.payload);
        }
      }

      calculateTotals(state);
      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.discount = 0;
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.appliedCoupon = undefined;
      saveCartToStorage(state);
    },

    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = Math.max(0, action.payload);
      calculateTotals(state);
      saveCartToStorage(state);
    },

    removeDiscount: (state) => {
      state.discount = 0;
      state.appliedCoupon = undefined;
      calculateTotals(state);
      saveCartToStorage(state);
    },

    applyCoupon: (state, action: PayloadAction<{ code: string; percentage: number }>) => {
      const discountAmount = (state.subtotal * action.payload.percentage) / 100;
      state.discount = Math.round(discountAmount * 100) / 100;
      state.appliedCoupon = action.payload.code; // ✅ حفظ الكوبون
      calculateTotals(state);
      saveCartToStorage(state);
    },

    // ✅ تطبيق خصم بمبلغ ثابت
    applyFixedDiscount: (state, action: PayloadAction<{ code: string; amount: number }>) => {
      state.discount = Math.min(action.payload.amount, state.subtotal); // لا يتجاوز المجموع الفرعي
      state.appliedCoupon = action.payload.code;
      calculateTotals(state);
      saveCartToStorage(state);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  incrementQuantity,
  decrementQuantity,
  clearCart,
  applyDiscount,
  removeDiscount,
  applyCoupon,
  applyFixedDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;

// ✅ Selectors محسّنة
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.subtotal;
export const selectCartItemCount = (state: { cart: CartState }) => state.cart.itemCount;
export const selectCartDiscount = (state: { cart: CartState }) => state.cart.discount;
export const selectDeliveryFee = (state: { cart: CartState }) => state.cart.deliveryFee;
export const selectAppliedCoupon = (state: { cart: CartState }) => state.cart.appliedCoupon;
export const selectIsCartEmpty = (state: { cart: CartState }) => state.cart.items.length === 0;
export const selectCartItemById = (state: { cart: CartState }, id: string) =>
  state.cart.items.find((item) => item.product.id === id);

// ✅ Helper لحساب التوفير الكلي
export const selectTotalSavings = (state: { cart: CartState }) => {
  const savingsFromProducts = state.cart.items.reduce((total, item) => {
    if (item.product.compareAtPrice && item.product.compareAtPrice > item.product.price) {
      return total + (item.product.compareAtPrice - item.product.price) * item.quantity;
    }
    return total;
  }, 0);
  
  const savingsFromCoupon = state.cart.discount;
  const savingsFromDelivery = state.cart.deliveryFee === 0 && state.cart.subtotal >= FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  
  return Math.round((savingsFromProducts + savingsFromCoupon + savingsFromDelivery) * 100) / 100;
};

// ✅ Helper للحصول على عدد المنتجات الفريدة
export const selectUniqueProductCount = (state: { cart: CartState }) => state.cart.items.length;

// ✅ Helper لحساب متوسط سعر المنتج
export const selectAverageItemPrice = (state: { cart: CartState }) => {
  if (state.cart.items.length === 0) return 0;
  return Math.round((state.cart.subtotal / state.cart.itemCount) * 100) / 100;
};

// ✅ Helper لمعرفة المبلغ المتبقي للتوصيل المجاني
export const selectAmountForFreeDelivery = (state: { cart: CartState }) => {
  if (state.cart.subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return Math.round((FREE_DELIVERY_THRESHOLD - state.cart.subtotal) * 100) / 100;
};

// ✅ Constants للتصدير
export { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE };
