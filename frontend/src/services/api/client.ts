// src/services/api/client.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  raw?: any; // پاسخ خام برای مواقع خاص
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  // برای ساخت راحت query string
  query?: Record<string, string | number | boolean | null | undefined>;
  // اگر دوست داری کش مرورگر/next رو کنترل کنی (اختیاری)
  cache?: RequestCache;
  next?: NextFetchRequestConfig; // برای استفاده در محیط Next (اختیاری)
}

class ApiClient {
  private baseURL: string;

  constructor() {
    // آدرس API از ENV
    const base = (process.env.NEXT_PUBLIC_API_URL || '').trim();
    this.baseURL = base.replace(/\/+$/, ''); // حذف اسلش انتهایی

    if (!this.baseURL && process.env.NODE_ENV === 'development') {
      console.warn('⚠️  NEXT_PUBLIC_API_URL تعریف نشده است.');
    }
  }

  // ساخت URL نهایی + QueryString
  private buildUrl(endpoint: string, query?: RequestOptions['query']) {
    const cleanEndpoint = endpoint.replace(/^\/+/, ''); // حذف اسلش ابتدایی
    const url = `${this.baseURL}/${cleanEndpoint}`;

    if (!query) return url;

    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      params.append(k, String(v));
    });

    const qs = params.toString();
    return qs ? `${url}?${qs}` : url;
  }

  private isFormData(body: any) {
    return typeof FormData !== 'undefined' && body instanceof FormData;
  }

  private isJsonLike(body: any) {
    if (body === null || body === undefined) return false;
    if (typeof body === 'string') return false; // فرض می‌کنیم خودت درست ست کردی
    if (this.isFormData(body)) return false;
    return typeof body === 'object';
  }

  private logDev(...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }

  async request<T = unknown>(endpoint: string, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers,
      signal,
      query,
      cache,
      next,
    } = opts;

    const url = this.buildUrl(endpoint, query);

    const isFD = this.isFormData(body);
    const isJSON = this.isJsonLike(body);

    // هدرها: Accept همیشه JSON، Content-Type فقط برای JSON
    const reqHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(isJSON ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    };

    const init: RequestInit & { next?: NextFetchRequestConfig } = {
      method,
      headers: reqHeaders,
      credentials: 'include', // برای ارسال کوکی
      signal,
      cache,
      next,
    };

    if (body && method !== 'GET') {
      init.body = isFD ? body : (isJSON ? JSON.stringify(body) : body);
    }

    this.logDev('➡️ API Request:', { url, method, headers: reqHeaders, body: isFD ? '[FormData]' : body });

    try {
      const res = await fetch(url, init);

      const contentType = res.headers.get('content-type') || '';
      const isJsonResponse = contentType.includes('application/json');

      const parsed = isJsonResponse ? await res.json() : await res.text();

      this.logDev('⬅️ API Response:', { status: res.status, body: parsed });

      // استخراج message و data به‌صورت هوشمند
      const payload = isJsonResponse ? parsed : { message: parsed };
      const data = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
      const message =
        (payload && typeof payload === 'object' && ('message' in payload) ? payload.message : undefined) ||
        (res.ok ? undefined : res.statusText);

      return {
        success: res.ok,
        status: res.status,
        data,
        message,
        raw: payload,
      };
    } catch (err: any) {
      this.logDev('❌ API Error:', err);
      return {
        success: false,
        status: 0,
        message: err?.message || 'خطا در ارتباط با سرور',
        raw: err,
      };
    }
  }

  // شورت‌کات‌ها
  get<T = unknown>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = unknown>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = unknown>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = unknown>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// ——— Singleton
export const apiClient = new ApiClient();

// ——— SWR fetcher (در صورت نیاز)
export const swrFetcher = async <T = unknown>(endpoint: string) => {
  const res = await apiClient.get<T>(endpoint);
  if (!res.success) {
    throw new Error(res.message || 'Request failed');
  }
  return res.data as T;
};
