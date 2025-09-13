// src/contracts/cart/index.ts
import { Product } from "../products";


export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  product: Product;
}