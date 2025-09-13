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
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    if (!this.baseURL && process.env.NODE_ENV === 'development') {
      console.warn('NEXT_PUBLIC_API_URL is not defined');
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      requireAuth = true
    } = options;

    try {
      const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;
      const requestHeaders: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      };

      // حذف کامل Authorization چون فقط کوکی HttpOnly
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include',
      };
      console.log('Fetching URL:', url, requestOptions);

      if (body && method !== 'GET') {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`API Request: ${method} ${url}`);
      }
      
      const response = await fetch(url, requestOptions);
      console.log(url,requestOptions);

      let responseData: any = {};
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textData = await response.text();
        responseData = { message: textData };
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`API Response: ${response.status}`, responseData);
      }

      return { ...responseData, success: response.ok };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('API Request Error:', error);
      }
      return {
        success: false,
        message: error?.message || 'خطا در ارتباط با سرور.',
        errors: { network: [error?.message || 'خطا در شبکه'] }
      };
    }
  }

  async get<T = any>(endpoint: string, requireAuth = true, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', requireAuth, headers });
  }

  async post<T = any>(endpoint: string, data?: any, requireAuth = true, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: data, requireAuth, headers });
  }

  async put<T = any>(endpoint: string, data?: any, requireAuth = true, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body: data, requireAuth, headers });
  }

  async delete<T = any>(endpoint: string, requireAuth = true, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth, headers });
  }

  async patch<T = any>(endpoint: string, data?: any, requireAuth = true, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body: data, requireAuth, headers });
  }
}

export const apiClient = new ApiClient();

export const fetcher = (endpoint: string) => apiClient.get(endpoint);
export const sendToApi = (
  endpoint: string,
  data?: any,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  headers?: Record<string, string>
) => {
  switch (method) {
    case 'PUT':
      return apiClient.put(endpoint, data, true, headers);
    case 'DELETE':
      return apiClient.delete(endpoint, true, headers);
    case 'PATCH':
      return apiClient.patch(endpoint, data, true, headers);
    default:
      return apiClient.post(endpoint, data, true, headers);
  }
};
