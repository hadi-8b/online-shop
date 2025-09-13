// src/contracts/products/index.ts
export interface ProductFilterValues {
  search: string;
  sort: string;
  value: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: string | number;
    stock: number;
    category_id: number;
    created_at: string;
    updated_at: string;
    category: Category;
    images: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_primary: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  per_page: number;
}


export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}



export interface ProductsResponse {
  id:string;
  product:Product;
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
      url: string | null;
      label: string;
      active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ProductsData {
  oldest_products: ProductsResponse;
  newest_products: ProductsResponse;
}
