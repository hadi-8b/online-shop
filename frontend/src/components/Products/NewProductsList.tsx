// src/components/Products/NewProductsList.tsx
"use client";

import React from "react";
import ProductCard from "../layouts/Cards/ProductCard/ProductCard";
import { ProductsData } from "@/contracts/products";
import { getProductImage } from "./GetProductImage";

interface Props {
  productsData: ProductsData;
}

export default function NewProductsList({ productsData }: Props) {
  const { newest_products } = productsData;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* بخش محصولات جدید */}
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          محصولات جدید
        </h2>
        <p className="text-gray-600 text-center mb-8">
          طراحی شیک و مدرن با جزئیات دقیق
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newest_products.data.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={getProductImage(product.images)}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
