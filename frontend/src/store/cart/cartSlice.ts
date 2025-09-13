// src/store/cart/cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/contracts/cart';
import { cartService } from '@/services/api/cart';
import { RootState } from '..';

// حتماً export کن:
export interface CartState {
  items: CartItem[];
  total: number;
  count: number;
  loading: boolean;
  error: string | null;
  isCartOpen: boolean;
  lastUpdated: number | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  count: 0,
  loading: false,
  error: null,
  isCartOpen: false,
  lastUpdated: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await cartService.getCart();
    if (!response.success) throw new Error(response.message || 'خطا در دریافت سبد خرید');
    return response.data;
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const response = await cartService.addToCart(productId, quantity);
    if (!response.success) throw new Error(response.message || 'خطا در افزودن به سبد خرید');
    return response.data;
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    const response = await cartService.updateCartItem(itemId, quantity);
    if (!response.success) throw new Error(response.message || 'خطا در به‌روزرسانی سبد خرید');
    return response.data;
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeItem',
  async (itemId: number) => {
    const response = await cartService.removeFromCart(itemId);
    if (!response.success) throw new Error(response.message || 'خطا در حذف از سبد خرید');
    return response.data;
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async () => {
    const response = await cartService.clearCart();
    if (!response.success) throw new Error(response.message || 'خطا در پاک کردن سبد خرید');
    return response.data;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.total = action.payload?.total || 0;
        state.count = action.payload?.count || 0;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'خطا در دریافت سبد خرید';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.total = action.payload?.total || 0;
        state.count = action.payload?.count || 0;
        state.lastUpdated = Date.now();
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.total = action.payload?.total || 0;
        state.count = action.payload?.count || 0;
        state.lastUpdated = Date.now();
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.total = action.payload?.total || 0;
        state.count = action.payload?.count || 0;
        state.lastUpdated = Date.now();
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.count = 0;
        state.lastUpdated = Date.now();
      });
  },
});

export const { toggleCart, closeCart, openCart, clearError } = cartSlice.actions;



export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartCount = (state: RootState) => state.cart.count;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectIsCartOpen = (state: RootState) => state.cart.isCartOpen;
export const selectCartLastUpdated = (state: RootState) => state.cart.lastUpdated;

export default cartSlice.reducer;
