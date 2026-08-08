// src/components/layouts/Header/Header.tsx
"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import style from "./header.module.css";
import { CartPopup } from "./CartPopup";
import { useCart } from "@/hooks/useCart";

const mainNav = [
  { name: "خانه", href: "/" },
  { name: "فروشگاه", href: "/products" },
  { name: "تماس با ما", href: "/contact" },
  { name: "درباره ما", href: "/about" },
];

/** لینک‌های مگا‌منو — بعداً می‌توانید از API دسته پر کنید */
const megaColumns = [
  {
    title: "دسته‌بندی‌ها",
    links: [
      { name: "همه محصولات", href: "/products" },
      { name: "جدیدترین‌ها", href: "/products?sort=newest" },
      { name: "ارزان‌ترین‌ها", href: "/products?sort=price_asc" },
      { name: "گران‌ترین‌ها", href: "/products?sort=price_desc" },
    ],
  },
  {
    title: "پیشنهادها",
    links: [
      { name: "فروش ویژه", href: "/products?sort=newest" },
      { name: "پربازدید", href: "/products" },
    ],
  },
];

export default function Header() {
  const router = useRouter();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [search, setSearch] = useState("");
  const megaRef = useRef<HTMLDivElement>(null);

  // بستن مگا‌منو با کلیک بیرون
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${style.header} bg-white border-b border-gray-100 sticky top-0 z-40`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ردیف بالا */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* موبایل: همبرگر */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="منو"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* لوگو */}
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/icons/logo.svg" alt="BEST SHOP" width={140} height={32} priority />
          </Link>

          {/* جستجو — دسکتاپ */}
          <form
            onSubmit={onSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="flex w-full rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400/80">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصول..."
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-gray-50"
              />
              <button
                type="submit"
                className="px-4 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium"
              >
                جستجو
              </button>
            </div>
          </form>

          {/* اکشن‌ها */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/panel"
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="حساب کاربری"
            >
              <Image src="/icons/user-icon.svg" alt="" width={20} height={20} />
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
                aria-label="سبد خرید"
              >
                <Image src="/icons/shopping-cart-icon.svg" alt="" width={20} height={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>
              <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </div>

        {/* ناوبری دسکتاپ + مگا‌منو */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t border-gray-50" aria-label="اصلی">
          <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-yellow-600">
            خانه
          </Link>

          {/* مگا‌منو محصولات */}
          <div className="relative" ref={megaRef}>
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              onMouseEnter={() => setMegaOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-yellow-600"
            >
              محصولات
              <ChevronDownIcon
                className={`h-4 w-4 transition ${megaOpen ? "rotate-180" : ""}`}
              />
            </button>

            <Transition
              show={megaOpen}
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <div
                className="absolute top-full right-1/2 translate-x-1/2 mt-3 w-[min(100vw-2rem,640px)] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50"
                onMouseLeave={() => setMegaOpen(false)}
              >
                <div className="grid grid-cols-2 gap-8">
                  {megaColumns.map((col) => (
                    <div key={col.title}>
                      <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
                        {col.title}
                      </p>
                      <ul className="space-y-2">
                        {col.links.map((link) => (
                          <li key={link.href + link.name}>
                            <Link
                              href={link.href}
                              onClick={() => setMegaOpen(false)}
                              className="block text-sm text-gray-800 hover:text-yellow-600 py-1"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <Link
                    href="/products"
                    onClick={() => setMegaOpen(false)}
                    className="text-sm font-semibold text-yellow-600 hover:text-yellow-700"
                  >
                    مشاهده همه محصولات ←
                  </Link>
                </div>
              </div>
            </Transition>
          </div>

          {mainNav
            .filter((i) => i.href !== "/" && i.name !== "فروشگاه")
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-800 hover:text-yellow-600"
              >
                {item.name}
              </Link>
            ))}
        </nav>
      </div>

      {/* منوی موبایل */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Image src="/icons/logo.svg" alt="" width={120} height={28} />
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-2">
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <form onSubmit={onSearch} className="mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
            />
          </form>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 font-semibold text-gray-900 hover:bg-gray-50"
            >
              خانه
            </Link>
            <p className="px-3 pt-3 pb-1 text-xs font-bold text-gray-400">محصولات</p>
            {megaColumns.flatMap((c) => c.links).map((link) => (
              <Link
                key={link.href + link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 font-semibold text-gray-900 hover:bg-gray-50 mt-2"
            >
              تماس با ما
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 font-semibold text-gray-900 hover:bg-gray-50"
            >
              درباره ما
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 font-semibold text-yellow-600 hover:bg-yellow-50 mt-4"
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}