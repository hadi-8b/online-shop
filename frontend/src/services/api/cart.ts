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
    if (typeof window === 'undefined') return;

    let guestId = localStorage.getItem(this.GUEST_ID_KEY);

    // اگر فرمت قدیمی (غیر UUID) بود، پاک کن و از نو بساز
    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (guestId && !uuidRe.test(guestId)) {
      localStorage.removeItem(this.GUEST_ID_KEY);
      guestId = null;
    }

    if (!guestId) {
      guestId = this.generateGuestId();
      localStorage.setItem(this.GUEST_ID_KEY, guestId);
    }

    this.guestId = guestId;
  }

  private generateGuestId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.guestId) {
      headers['X-Guest-ID'] = this.guestId;
    }
    return headers;
  }

  /** نرمال‌سازی پاسخ بک‌اند به { items, total, count } */
  private normalizeCart(raw: unknown): CartResponse {
    const empty: CartResponse = { items: [], total: 0, count: 0 };
    if (!raw || typeof raw !== 'object') return empty;

    const obj = raw as Record<string, unknown>;

    // شکل استاندارد لیست سبد
    if (Array.isArray(obj.items)) {
      const items = obj.items as CartItem[];
      const total = Number(obj.total) || 0;
      const count =
        typeof obj.count === 'number'
          ? obj.count
          : items.reduce((sum, i) => sum + (i.quantity || 0), 0);
      return { items, total, count };
    }

    return empty;
  }

  private toCartResponse(
    response: ApiResponse<unknown>
  ): ApiResponse<CartResponse> {
    if (!response.status) {
      return {
        status: false,
        message: response.message || 'خطا در عملیات سبد خرید',
        errors: response.errors,
      };
    }

    return {
      status: true,
      message: response.message,
      data: this.normalizeCart(response.data),
    };
  }

  async getCart(): Promise<ApiResponse<CartResponse>> {
    try {
      const response = await apiClient.get<unknown>(
        this.CART_ENDPOINT,
        this.getHeaders()
      );
      return this.toCartResponse(response);
    } catch (error) {
      console.error('CartService.getCart error:', error);
      throw error;
    }
  }

  async addToCart(
    productId: number,
    quantity: number = 1
  ): Promise<ApiResponse<CartResponse>> {
    if (quantity < 1) {
      return { status: false, message: 'تعداد محصول باید حداقل 1 باشد' };
    }
    try {
      // POST ممکن است فقط یک آیتم برگرداند — بعداً در slice کل سبد را می‌گیریم
      const response = await apiClient.post<unknown>(
        this.CART_ENDPOINT,
        { product_id: productId, quantity },
        this.getHeaders()
      );

      if (!response.status) {
        return {
          status: false,
          message: response.message || 'خطا در افزودن به سبد خرید',
          errors: response.errors,
        };
      }

      // اگر بک‌اند کل سبد را داد، همان را برگردان؛ وگرنه فقط موفقیت
      const normalized = this.normalizeCart(response.data);
      if (normalized.items.length > 0) {
        return { status: true, message: response.message, data: normalized };
      }

      // آیتم تکی یا body بدون items → بگو موفق بود؛ slice بعداً getCart می‌زند
      return { status: true, message: response.message, data: normalized };
    } catch (error) {
      console.error('CartService.addToCart error:', error);
      throw error;
    }
  }

  async updateCartItem(
    itemId: number,
    quantity: number
  ): Promise<ApiResponse<CartResponse>> {
    if (quantity < 0) {
      return { status: false, message: 'تعداد محصول نمی‌تواند منفی باشد' };
    }
    try {
      const response = await apiClient.put<unknown>(
        `${this.CART_ENDPOINT}/${itemId}`,
        { quantity },
        this.getHeaders()
      );

      if (!response.status) {
        return {
          status: false,
          message: response.message || 'خطا در به‌روزرسانی سبد خرید',
          errors: response.errors,
        };
      }

      return {
        status: true,
        message: response.message,
        data: this.normalizeCart(response.data),
      };
    } catch (error) {
      console.error('CartService.updateCartItem error:', error);
      throw error;
    }
  }

  async removeFromCart(itemId: number): Promise<ApiResponse<CartResponse>> {
    try {
      const response = await apiClient.delete<unknown>(
        `${this.CART_ENDPOINT}/${itemId}`,
        this.getHeaders()
      );

      if (!response.status) {
        return {
          status: false,
          message: response.message || 'خطا در حذف از سبد خرید',
          errors: response.errors,
        };
      }

      return {
        status: true,
        message: response.message,
        data: this.normalizeCart(response.data),
      };
    } catch (error) {
      console.error('CartService.removeFromCart error:', error);
      throw error;
    }
  }

  async clearCart(): Promise<ApiResponse<CartResponse>> {
    try {
      const response = await apiClient.delete<unknown>(
        `${this.CART_ENDPOINT}/clear`,
        this.getHeaders()
      );

      if (!response.status) {
        return {
          status: false,
          message: response.message || 'خطا در پاک کردن سبد خرید',
          errors: response.errors,
        };
      }

      return {
        status: true,
        message: response.message,
        data: this.normalizeCart(response.data),
      };
    } catch (error) {
      console.error('CartService.clearCart error:', error);
      throw error;
    }
  }

  async syncCart(): Promise<ApiResponse<CartResponse>> {
    return this.getCart();
  }
}

export const cartService = new CartService();