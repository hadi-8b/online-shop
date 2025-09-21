// src/services/api/client.ts
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  success: boolean;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {} } = options;

    try {
      const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      let requestHeaders: Record<string, string> = {
        Accept: 'application/json',
        ...headers,
      };

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include', // کوکی HttpOnly
      };

      if (body && method !== 'GET') {
        if (body instanceof FormData) {
          // وقتی فایل یا فرم داری → مستقیم بفرست
          requestOptions.body = body;
          // ❌ Content-Type رو نذار، مرورگر خودش میذاره
        } else {
          // حالت معمول JSON
          requestHeaders['Content-Type'] = 'application/json';
          requestOptions.body = JSON.stringify(body);
        }
      }

      const response = await fetch(url, requestOptions);

      let responseData: any = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      return { ...responseData, success: response.ok };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'خطای شبکه',
        errors: { network: [error?.message || 'خطای شبکه'] },
      };
    }
  }

  get<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }
  post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }
  put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }
  delete<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
  patch<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }
}

export const apiClient = new ApiClient();

// آماده برای استفاده
export const authApi = {
  register: (payload: any) => apiClient.post('/api/auth/register', payload),
  login: (payload: any) => apiClient.post('/api/auth/login', payload),
  verify: (payload: any) => apiClient.post('/api/auth/verify', payload),
  logout: () => apiClient.post('/api/auth/logout'),
  profile: () => apiClient.get('/api/auth/profile'),
};

export const cartApi = {
  get: () => apiClient.get('/api/cart'),
  add: (item: any) => apiClient.post('/api/cart', item),
  update: (id: string, item: any) => apiClient.put(`/api/cart/${id}`, item),
  remove: (id: string) => apiClient.delete(`/api/cart/${id}`),
};
