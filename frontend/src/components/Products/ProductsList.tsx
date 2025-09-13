// src/components/Products/ProductsList.tsx
"use client";

import React from "react";
import ProductCard from "../layouts/Cards/ProductCard/ProductCard";
import { ProductsData } from "@/contracts/products";
import { getProductImage } from "./GetProductImage";

interface Props {
  // productsData: ProductsData;
  productsData: ProductsData;
}

export default function ProductsList({ productsData }: Props) {
  const { oldest_products, newest_products } = productsData;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* بخش محصولات قدیمی */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {oldest_products.data.map((product) => (
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
        </div>

        {/* بخش محصولات جدید */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {newest_products.data.map((product) => (
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
        </div>
      </div>

      <div className="block lg:hidden">
        <hr className="my-8 border-gray-200" />
      </div>
    </section>
  );
}
