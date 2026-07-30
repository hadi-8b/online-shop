export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
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
        cache: 'no-store',
      };

      if (body && method !== 'GET') {
        if (body instanceof FormData) {
          requestOptions.body = body;
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

      return {
        status: response.ok,
        message: responseData.message,
        data: responseData.data !== undefined ? responseData.data : responseData,
        errors: responseData.errors,
      };
    } catch (error: any) {
      return {
        status: false,
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
