// src/services/api/cart.ts
import { apiClient, ApiResponse } from './client';
import { CartItem } from '@/contracts/cart';

export interface CartResponse {
  items: CartItem[];
  total: number;
  count: number;
}

export interface CartUpdateResponse extends CartResponse {
  message?: string;
}

class CartService {
  private readonly CART_ENDPOINT = '/api/cart';
  private readonly GUEST_ID_KEY = 'guest_id';
  private guestId: string | null = null;

  constructor() {
    this.initializeGuestId();
  }

  private initializeGuestId(): void {
    if (typeof window !== 'undefined') {
      let guestId = localStorage.getItem(this.GUEST_ID_KEY);
      if (!guestId) {
        guestId = this.generateGuestId();
        localStorage.setItem(this.GUEST_ID_KEY, guestId);
      }
      this.guestId = guestId;
    }
  }

  private generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.guestId) {
      headers['X-Guest-ID'] = this.guestId;
    }
    return headers;
  }

  async getCart(): Promise<ApiResponse<CartResponse>> {
    try {
      const response = await apiClient.get<CartResponse>(
        this.CART_ENDPOINT,
        false,
        this.getHeaders()
      );

      if (response.success && response.data) {
        return {
          ...response,
          data: {
            items: response.data.items || [],
            total: response.data.total || 0,
            count: response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
          }
        };
      }

      return response;
    } catch (error) {
      console.error('CartService.getCart error:', error);
      throw error;
    }
  }

  async addToCart(productId: number, quantity: number = 1): Promise<ApiResponse<CartUpdateResponse>> {
    if (quantity < 1) {
      return {
        success: false,
        message: 'تعداد محصول باید حداقل 1 باشد'
      };
    }
    try {
      const response = await apiClient.post<CartUpdateResponse>(
        this.CART_ENDPOINT,
        { product_id: productId, quantity },
        false,
        this.getHeaders()
      );
      return response;
    } catch (error) {
      console.error('CartService.addToCart error:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: number, quantity: number): Promise<ApiResponse<CartUpdateResponse>> {
    if (quantity < 0) {
      return {
        success: false,
        message: 'تعداد محصول نمی‌تواند منفی باشد'
      };
    }
    try {
      const response = await apiClient.put<CartUpdateResponse>(
        `${this.CART_ENDPOINT}/${itemId}`,
        { quantity },
        false,
        this.getHeaders()
      );
      return response;
    } catch (error) {
      console.error('CartService.updateCartItem error:', error);
      throw error;
    }
  }

  async removeFromCart(itemId: number): Promise<ApiResponse<CartUpdateResponse>> {
    try {
      const response = await apiClient.delete<CartUpdateResponse>(
        `${this.CART_ENDPOINT}/${itemId}`,
        false,
        this.getHeaders()
      );
      return response;
    } catch (error) {
      console.error('CartService.removeFromCart error:', error);
      throw error;
    }
  }

  async clearCart(): Promise<ApiResponse<CartUpdateResponse>> {
    try {
      const response = await apiClient.delete<CartUpdateResponse>(
        `${this.CART_ENDPOINT}/clear`,
        false,
        this.getHeaders()
      );
      return response;
    } catch (error) {
      console.error('CartService.clearCart error:', error);
      throw error;
    }
  }

  async syncCart(): Promise<ApiResponse<CartResponse>> {
    return this.getCart();
  }
}

// Singleton instance
export const cartService = new CartService();
