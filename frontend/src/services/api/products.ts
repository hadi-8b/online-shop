// src/services/api/products.ts
import { ProductsResponse, Product } from "@/contracts/products";
import { notFound } from "next/navigation";

// تابع تشخیص محیط و انتخاب URL مناسب
const getApiUrl = () => {
  // اگر در سرور هستیم از INTERNAL_API_URL استفاده کنیم
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://nginx-webserver/api';
  }
  // اگر در کلاینت هستیم از NEXT_PUBLIC_API_URL استفاده کنیم
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

// تابع کمکی برای ارسال درخواست
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/${endpoint.replace(/^\//, '')}`;
  
  console.log(`API Request: ${url}`);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`API Response:`, data);
    return data;
  } catch (error) {
    console.error(`API Request Failed for ${url}:`, error);
    throw error;
  }
};

// دریافت یک محصول
export const getSingleProduct = async (id: string): Promise<{ product: Product }> => {
  try {
    const data = await apiRequest(`products/${id}`, {
      next: { revalidate: 3600 }, // کش برای 1 ساعت
    });
    
    return data;
  } catch (error) {
    console.error('خطا در دریافت اطلاعات محصول:', error);
    notFound(); // بازگردان 404 به جای throw
  }
};

// دریافت لیست محصولات
export const getProductsList = async (params: {
  page?: string;
  per_page?: string;
  category?: string;
  search?: string;
  sort?: string;
} = {}) => {
  const { page = '1', per_page = '12', ...otherParams } = params;
  
  try {
    // ساخت query string
    const queryParams = new URLSearchParams({
      page,
      per_page,
      ...Object.fromEntries(
        Object.entries(otherParams).filter(([_, value]) => value !== undefined)
      ),
    });

    const data = await apiRequest(`products?${queryParams.toString()}`, {
      cache: "no-store", // همیشه داده تازه
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // برگرداندن داده خالی به جای خطا
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: parseInt(per_page),
      total: 0,
    };
  }
};

// دریافت محصولات برای صفحه اصلی
export const getHomeProducts = async () => {
  try {
    const data = await apiRequest('products?per_page=8', {
      next: { revalidate: 1800 }, // کش برای 30 دقیقه
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching home products:", error);
    return { data: [] };
  }
};

// دریافت دسته‌بندی‌ها
export const getCategories = async () => {
  try {
    const data = await apiRequest('categories', {
      next: { revalidate: 3600 }, // کش برای 1 ساعت
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] };
  }
};