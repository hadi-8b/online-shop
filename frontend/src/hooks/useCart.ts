// src/hooks/useCart.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchCart,
  addToCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
  clearCartAsync,
  toggleCart,
  closeCart,
  openCart,
  clearError,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartLoading,
  selectCartError,
  selectIsCartOpen,
  selectCartLastUpdated,
} from '@/store/cart/cartSlice';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useAppDispatch();
  
  // State
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const isOpen = useAppSelector(selectIsCartOpen);
  const lastUpdated = useAppSelector(selectCartLastUpdated);

  // بارگذاری اولیه
  useEffect(() => {
    if (!lastUpdated) {
      dispatch(fetchCart());
    }
  }, [dispatch, lastUpdated]);

  // نمایش خطا
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Actions
  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    try {
      await dispatch(addToCartAsync({ productId, quantity })).unwrap();
      toast.success('محصول با موفقیت به سبد خرید اضافه شد');
      dispatch(openCart());
    } catch (error) {
      toast.error('خطا در افزودن به سبد خرید');
      throw error; // برای handling در component
    }
  }, [dispatch]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    try {
      await dispatch(updateCartItemAsync({ itemId, quantity })).unwrap();
      toast.success('سبد خرید به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی سبد خرید');
      throw error;
    }
  }, [dispatch]);

  const removeFromCart = useCallback(async (itemId: number) => {
    try {
      await dispatch(removeFromCartAsync(itemId)).unwrap();
      toast.success('محصول از سبد خرید حذف شد');
    } catch (error) {
      toast.error('خطا در حذف از سبد خرید');
      throw error;
    }
  }, [dispatch]);

  const clearCart = useCallback(async () => {
    try {
      const confirmed = window.confirm('آیا از پاک کردن سبد خرید اطمینان دارید؟');
      if (!confirmed) return;
      
      await dispatch(clearCartAsync()).unwrap();
      toast.success('سبد خرید پاک شد');
      dispatch(closeCart());
    } catch (error) {
      toast.error('خطا در پاک کردن سبد خرید');
      throw error;
    }
  }, [dispatch]);

  const refreshCart = useCallback(async () => {
    try {
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error('Refresh cart error:', error);
    }
  }, [dispatch]);

  // Helper functions
  const getProductQuantity = useCallback((productId: number): number => {
    return items.find(item => item.product_id === productId)?.quantity || 0;
  }, [items]);

  const isInCart = useCallback((productId: number): boolean => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  // UI Actions
  const toggleCartUI = useCallback(() => dispatch(toggleCart()), [dispatch]);
  const openCartUI = useCallback(() => dispatch(openCart()), [dispatch]);
  const closeCartUI = useCallback(() => dispatch(closeCart()), [dispatch]);

  return {
    // State
    items,
    total,
    count,
    loading,
    error,
    isOpen,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    
    // UI Actions
    toggleCart: toggleCartUI,
    openCart: openCartUI,
    closeCart: closeCartUI,
    
    // Helpers
    getProductQuantity,
    isInCart,
  };
};