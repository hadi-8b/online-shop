// src/components/layouts/Header/CartPopup.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { getProductImage } from "@/components/Products/GetProductImage";

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartPopup = memo(({ isOpen, onClose }: CartPopupProps) => {
  const { 
    items, 
    total, 
    count,
    loading, 
    removeFromCart, 
    refreshCart 
  } = useCart();

  // بارگذاری مجدد سبد خرید هنگام باز شدن پاپ‌آپ
  useEffect(() => {
    if (isOpen) {
      refreshCart();
    }
  }, [isOpen, refreshCart]);

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-end p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-x-2"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-2"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-900 text-white p-6 shadow-xl transition-all border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold">
                    سبد خرید ({count} محصول)
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="بستن سبد خرید"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    <p className="text-sm text-gray-300">در حال بارگذاری...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-300 mb-4">سبد خرید شما خالی است</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={handleClose}
                    >
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      شروع خرید
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getProductImage(item.product?.images)}
                            alt={item.product?.title || "محصول"}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {item.product?.title || "محصول"}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-300">
                              تعداد: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-blue-400">
                              {(Number(item.price) * item.quantity).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1"
                          disabled={loading}
                          aria-label={`حذف ${item.product?.title}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">جمع کل:</span>
                      <span className="text-lg font-bold text-blue-400">
                        {total.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        href="/cart"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg text-center font-medium transition-colors border border-gray-600"
                        onClick={handleClose}
                      >
                        مشاهده سبد خرید
                      </Link>
                      <Link
                        href="/checkout"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center font-medium transition-colors"
                        onClick={handleClose}
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          تکمیل خرید
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});

CartPopup.displayName = 'CartPopup';