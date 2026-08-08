// src/components/layouts/Header/CartPopup.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon, TrashIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/hooks/useCart";
import { getProductImage } from "@/components/Products/GetProductImage";
import { useCheckout } from "@/hooks/useCheckout";

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartPopup = memo(({ isOpen, onClose }: CartPopupProps) => {
  const { items, total, count, loading, removeFromCart, refreshCart } = useCart();
  const { goToCheckout, authLoading } = useCheckout();

  useEffect(() => {
    if (isOpen) refreshCart();
  }, [isOpen, refreshCart]);

  const handleClose = () => onClose();

  const handleCheckout = () => {
    handleClose();
    goToCheckout();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
                {/* هدر */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <Dialog.Title className="text-base font-bold text-gray-900">
                    سبد خرید
                    {count > 0 && (
                      <span className="mr-2 text-sm font-medium text-gray-500">
                        ({count.toLocaleString("fa-IR")} کالا)
                      </span>
                    )}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    aria-label="بستن"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* بدنه */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {loading && items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-yellow-500" />
                      <p className="text-sm">در حال بارگذاری...</p>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                        <ShoppingBagIcon className="h-8 w-8 text-gray-300" />
                      </div>
                      <p className="mb-1 font-medium text-gray-800">سبد خرید خالی است</p>
                      <p className="mb-6 text-sm text-gray-500">
                        محصولات مورد علاقه را اضافه کنید
                      </p>
                      <Link
                        href="/products"
                        onClick={handleClose}
                        className="rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600"
                      >
                        مشاهده محصولات
                      </Link>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                            <Image
                              src={getProductImage(item.product?.images)}
                              alt={item.product?.title || "محصول"}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium text-gray-900">
                              {item.product?.title || "محصول"}
                            </h4>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {item.quantity.toLocaleString("fa-IR")} ×{" "}
                              {Number(item.price).toLocaleString("fa-IR")} تومان
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                              {(Number(item.price) * item.quantity).toLocaleString("fa-IR")}{" "}
                              تومان
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            disabled={loading}
                            className="self-start rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                            aria-label="حذف"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* فوتر */}
                {items.length > 0 && (
                  <div className="border-t border-gray-100 bg-white px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">جمع سبد</span>
                      <span className="text-lg font-bold text-gray-900">
                        {total.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                    <Link
                      href="/cart"
                      onClick={handleClose}
                      className="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                      مشاهده سبد خرید
                    </Link>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={count === 0 || loading || authLoading}
                      className="w-full rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ثبت سفارش
                    </button>
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

CartPopup.displayName = "CartPopup";