// src/store/cart/cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/contracts/cart';
import { cartService } from '@/services/api/cart';
import { RootState } from '..';

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

/** بعد از هر mutate، لیست کامل سبد را از سرور بگیر */
async function fetchFullCart() {
  const cart = await cartService.getCart();
  if (!cart.status || !cart.data) {
    throw new Error(cart.message || 'خطا در دریافت سبد خرید');
  }
  return cart.data;
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return fetchFullCart();
});

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const response = await cartService.addToCart(productId, quantity);
    if (!response.status) {
      throw new Error(response.message || 'خطا در افزودن به سبد خرید');
    }
    return fetchFullCart();
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    const response = await cartService.updateCartItem(itemId, quantity);
    if (!response.status) {
      throw new Error(response.message || 'خطا در به‌روزرسانی سبد خرید');
    }
    return fetchFullCart();
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeItem',
  async (itemId: number) => {
    const response = await cartService.removeFromCart(itemId);
    if (!response.status) {
      throw new Error(response.message || 'خطا در حذف از سبد خرید');
    }
    return fetchFullCart();
  }
);

export const clearCartAsync = createAsyncThunk('cart/clearCart', async () => {
  const response = await cartService.clearCart();
  if (!response.status) {
    throw new Error(response.message || 'خطا در پاک کردن سبد خرید');
  }
  // اگر endpoint clear نداشتید و خطا داد، می‌توانید فقط return { items:[], total:0, count:0 }
  try {
    return await fetchFullCart();
  } catch {
    return { items: [], total: 0, count: 0 };
  }
});

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
    const setCart = (
      state: CartState,
      action: { payload?: { items?: CartItem[]; total?: number; count?: number } }
    ) => {
      state.loading = false;
      state.items = action.payload?.items || [];
      state.total = action.payload?.total || 0;
      state.count = action.payload?.count || 0;
      state.lastUpdated = Date.now();
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        // فقط وقتی سبد خالی است UI را loading کن
        if (state.items.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'خطا در دریافت سبد خرید';
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, setCart)
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'خطا در افزودن به سبد خرید';
      })
      .addCase(updateCartItemAsync.fulfilled, setCart)
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'خطا در به‌روزرسانی سبد خرید';
      })
      .addCase(removeFromCartAsync.fulfilled, setCart)
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'خطا در حذف از سبد خرید';
      })
      .addCase(clearCartAsync.fulfilled, setCart)
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'خطا در پاک کردن سبد خرید';
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