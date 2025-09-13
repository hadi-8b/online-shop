// components/Cart/Cart.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { getProductImage } from '../Products/GetProductImage';

const Cart = () => {
  const {
    items,
    total,
    count,
    loading,
    updateQuantity,
    removeFromCart,
    refreshCart
  } = useCart();

  const shipping = 30000; // هزینه ارسال ثابت
  const [isLoading, setIsLoading] = useState(true);

  // اضافه کردن console.log برای دیباگ
  console.log('Cart Component Rendering:', {
    items: items?.length || 0,
    total,
    count,
    loading,
    isLoading
  });

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (!items.length) {
          await refreshCart();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [refreshCart, items.length]);


  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  // نمایش وضعیت بارگذاری
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری سبد خرید...</p>
        </div>
      </div>
    );
  }

  // نمایش سبد خرید خالی
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">سبد خرید</h1>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-12 text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-xl font-medium text-gray-700 mb-4">سبد خرید شما خالی است</p>
              <p className="text-gray-500 mb-6">محصولات مورد علاقه خود را به سبد خرید اضافه کنید</p>
              <Link
                href="/products"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">سبد خرید</h1>

        {/* اطلاعات دیباگ - بعد از تست حذف شود */}
        <div className="bg-blue-50 p-4 mb-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>اطلاعات سبد خرید:</strong> {items.length} محصول |
            مجموع: {total.toLocaleString('fa-IR')} تومان |
            تعداد: {count} عدد
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium">محصول</th>
                  <th className="px-6 py-4 text-right text-sm font-medium">قیمت واحد</th>
                  <th className="px-6 py-4 text-right text-sm font-medium">تعداد</th>
                  <th className="px-6 py-4 text-right text-sm font-medium">قیمت کل</th>
                  <th className="px-6 py-4 text-right text-sm font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => {
                  // اضافه کردن null check برای product
                  if (!item.product) {
                    console.error('Product is null for item:', item);
                    return null;
                  }

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-20 h-20 relative ml-4 rounded-lg overflow-hidden">
                            <Image
                              src={getProductImage(item.product?.images || [])}
                              alt={item.product?.title || "محصول"}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.product?.title || "محصول"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              کد: {item.product?.id || item.product_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Number(item.price).toLocaleString('fa-IR')} تومان
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1 || loading}
                            aria-label="کاهش تعداد"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(item.product?.stock && item.quantity >= item.product.stock) || loading}
                            aria-label="افزایش تعداد"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {(Number(item.price) * item.quantity).toLocaleString('fa-IR')} تومان
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          disabled={loading}
                          aria-label="حذف محصول"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  ادامه خرید
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 w-full lg:w-96">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">جمع کل ({count} محصول)</span>
                    <span className="font-medium">{total.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">هزینه ارسال</span>
                    <span className="font-medium">{shipping.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">مبلغ قابل پرداخت</span>
                      <span className="text-lg font-bold text-blue-600">
                        {(total + shipping).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  تکمیل خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;