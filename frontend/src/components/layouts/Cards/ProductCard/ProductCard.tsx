// src/components/layouts/Cards/ProductCard/ProductCard.tsx
'use client';

import React, { memo, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: string | number;
}

const ProductCard = memo(({ id, image, title, price }: ProductCardProps) => {
  const { addToCart, isInCart, getProductQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  // استفاده از useMemo برای محاسبات
  const inCart = useMemo(() => isInCart(id), [isInCart, id]);
  const quantity = useMemo(() => getProductQuantity(id), [getProductQuantity, id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inCart && !isLoading) {
      setIsLoading(true);
      try {
        await addToCart(id, 1);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Link href={`/products/${id}`} className="block w-full group">
      <div className="flex flex-col items-center bg-white shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        <div className="relative w-full h-64 overflow-hidden">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-300" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold py-1 px-2 rounded">
            فروش ویژه
          </div>
        </div>
        <div className="p-4 flex flex-col items-center w-full">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2 line-clamp-2">
            {title}
          </h3>
          <span className="text-gray-600 text-sm mb-4">
            {Number(price).toLocaleString('fa-IR')} تومان
          </span>
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              inCart
                ? "bg-green-500 hover:bg-green-600 text-white"
                : isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-yellow-400 hover:bg-yellow-500 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                در حال افزودن...
              </span>
            ) : inCart ? (
              `در سبد خرید (${quantity})`
            ) : (
              "افزودن به سبد خرید"
            )}
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;