// src/components/Cart/Cart.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { getProductImage } from "../Products/GetProductImage";
import { useCheckout } from "@/hooks/useCheckout";

const Cart = () => {
  const {
    items,
    total,
    count,
    loading,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const { goToCheckout, authLoading } = useCheckout();
  const shipping = 30000;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (!items.length) await refreshCart();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [refreshCart, items.length]);

  if ((loading || isLoading) && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-yellow-500" />
          <p className="text-gray-600 text-sm">در حال بارگذاری سبد خرید...</p>
        </div>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="min-h-[60vh] bg-gray-50" dir="rtl">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">سبد خرید</h1>
          <div className="rounded-2xl border border-gray-100 bg-white p-12 shadow-sm">
            <p className="mb-2 text-lg font-medium text-gray-800">سبد خرید شما خالی است</p>
            <p className="mb-8 text-sm text-gray-500">
              محصولات مورد علاقه را اضافه کنید
            </p>
            <Link
              href="/products"
              className="inline-flex rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-white hover:bg-yellow-600"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          سبد خرید
          <span className="mr-2 text-base font-medium text-gray-500">
            ({count.toLocaleString("fa-IR")} کالا)
          </span>
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* لیست */}
          <div className="min-w-0 flex-1 space-y-3">
            {items.map((item) => {
              if (!item.product) return null;
              const productId = item.product.id ?? item.product_id;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  {/* تصویر + عنوان → لینک به صفحه محصول */}
                  <Link
                    href={`/products/${productId}`}
                    className="flex min-w-0 flex-1 items-center gap-4 group"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={getProductImage(item.product.images || [])}
                        alt={item.product.title || "محصول"}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-gray-900 group-hover:text-yellow-600">
                        {item.product.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {Number(item.price).toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </Link>

                  {/* تعداد */}
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={
                          loading ||
                          (item.product.stock != null &&
                            item.quantity >= item.product.stock)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="min-w-[7rem] text-left text-sm font-semibold text-gray-900">
                      {(Number(item.price) * item.quantity).toLocaleString("fa-IR")} تومان
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      className="text-sm text-red-500 hover:text-red-600 disabled:opacity-40"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}

            <Link
              href="/products"
              className="inline-flex text-sm font-medium text-yellow-600 hover:text-yellow-700"
            >
              ← ادامه خرید
            </Link>
          </div>

          {/* خلاصه */}
          <aside className="h-fit w-full shrink-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:w-80">
            <h2 className="mb-4 text-lg font-bold text-gray-900">خلاصه سفارش</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>جمع کالاها</span>
                <span className="font-medium text-gray-900">
                  {total.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>هزینه ارسال</span>
                <span className="font-medium text-gray-900">
                  {shipping.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
                <span className="font-semibold">قابل پرداخت</span>
                <span className="font-bold text-gray-900">
                  {(total + shipping).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={goToCheckout}
              disabled={count === 0 || authLoading}
              className="mt-6 w-full rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ثبت سفارش
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;