// src/models/product.ts
export interface ProductType {
  id: number;
  title: string;
  category?: string;
  body: string;
  description?: string;
  price: number;
  user_id: number;
  created_at: string;
  updated_at?: string;
  image?: string;
  images?: string[];
  stock?: number;
  discount?: number;
  rating?: number;
  reviews_count?: number;
}

export default class Product {
  private productData: ProductType;

  constructor(product: ProductType) {
    this.productData = product;
  }

  // Getters
  get data(): ProductType {
    return this.productData;
  }

  get id(): number {
    return this.productData.id;
  }

  get title(): string {
    return this.productData.title;
  }

  get price(): number {
    return this.productData.price;
  }

  get finalPrice(): number {
    if (this.productData.discount) {
      return this.productData.price - (this.productData.price * this.productData.discount / 100);
    }
    return this.productData.price;
  }

  get hasDiscount(): boolean {
    return (this.productData.discount || 0) > 0;
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat('fa-IR').format(this.finalPrice) + ' تومان';
  }

  get isAvailable(): boolean {
    return (this.productData.stock || 0) > 0;
  }

  // متدهای کمکی
  getImageUrl(index = 0): string {
    if (this.productData.images && this.productData.images[index]) {
      return this.productData.images[index];
    }
    return this.productData.image || '/images/no-image.png';
  }
}