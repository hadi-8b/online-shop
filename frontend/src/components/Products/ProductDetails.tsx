// src/components/Products/ProductDetails.tsx
"use client";

import { useState, useMemo } from "react";
import ProductImages from "./ProductImages";
import { Product } from "@/contracts/products";
import { useCart } from "@/hooks/useCart";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading, isInCart, getProductQuantity } = useCart();
  
  // استفاده از useMemo برای محاسبات
  const inCart = useMemo(() => isInCart(product.id), [isInCart, product.id]);
  const cartQuantity = useMemo(() => getProductQuantity(product.id), [getProductQuantity, product.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="p-4">
        <ProductImages images={product.images} title={product.title} />
      </div>

      {/* بخش اطلاعات محصول */}
      <div className="p-8">
        <div className="space-y-6">
          {/* دسته‌بندی */}
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {product.category.name}
          </div>

          {/* عنوان محصول */}
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          {/* توضیحات */}
          <div className="prose max-w-none">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* قیمت، موجودی و انتخاب تعداد */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {Number(product.price).toLocaleString('fa-IR')} تومان
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.stock > 0 ? `موجود (${product.stock} عدد)` : "ناموجود"}
              </span>
            </div>

            {/* نمایش قیمت کل */}
            {product.stock > 0 && (
              <div className="text-lg text-gray-700">
                قیمت کل:{" "}
                {(Number(product.price) * quantity).toLocaleString('fa-IR')}{" "}
                تومان
              </div>
            )}

            {/* افزودن به سبد خرید */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1 || loading}
                      aria-label="کاهش تعداد"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock || loading}
                      aria-label="افزایش تعداد"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${
                      inCart
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                    disabled={loading || product.stock === 0}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال افزودن...
                      </span>
                    ) : inCart ? (
                      `در سبد خرید (${cartQuantity})`
                    ) : (
                      "افزودن به سبد خرید"
                    )}
                  </button>
                </div>
                
                {product.stock <= 5 && (
                  <p className="text-orange-500 text-sm">تنها {product.stock} عدد در انبار باقی مانده</p>
                )}
              </div>
            )}
          </div>

          {/* ویژگی‌های اضافی */}
          <div className="border-t border-gray-200 pt-6">
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">کد محصول:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">دسته‌بندی:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.category.name}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}