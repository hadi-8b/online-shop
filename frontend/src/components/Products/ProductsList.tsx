// src/components/Products/ProductsList.tsx
"use client";

import React from "react";
import ProductCard from "../layouts/Cards/ProductCard/ProductCard";
import { getProductImage } from "./GetProductImage";
import { Product } from "@/contracts/products";

/** پاسخ صفحه‌بندی‌شده کاتالوگ از GET /api/products */
interface CatalogResponse {
  data?: Product[];
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

interface Props {
  productsData: CatalogResponse;
}

export default function ProductsList({ productsData }: Props) {
  const products = productsData?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">محصولی یافت نشد</p>
        <p className="text-sm mt-2">فیلترها را تغییر دهید یا بعداً سر بزنید</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="flex justify-center">
            <ProductCard
              id={product.id}
              image={getProductImage(product.images)}
              title={product.title}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </section>
  );
}