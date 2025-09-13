// src/components/layouts/Header/Header.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import style from "./header.module.css";
import { CartPopup } from "./CartPopup";

const navigation = [
  { name: "خانه", href: "/" },
  { name: "فروشگاه", href: "#" },
  { name: "محصولات", href: "/products" },
  { name: "تماس با ما", href: "#" },
  { name: "درباره ما", href: "#" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className={style.header}>
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap justify-between items-center py-4">
          {/* Social Icons */}
          <div className="flex space-x-4 rtl:space-x-reverse">
            <Link
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/social-icons/facebook-icon.svg"
                alt="Facebook"
                width={16}
                height={16}
              />
            </Link>
            <Link
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/social-icons/instagram-icon.svg"
                alt="Instagram"
                width={16}
                height={16}
              />
            </Link>
            <Link
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/social-icons/twitter-icon.svg"
                alt="Twitter"
                width={16}
                height={16}
              />
            </Link>
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="sr-only">شرکت شما</span>
            <Image src="/icons/logo.svg" alt="logo" width={148} height={35} />
          </div>

          {/* Action Links */}
          <div className="flex space-x-4 rtl:space-x-reverse hidden lg:flex">
            <Link
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/icons/search-icon.svg"
                alt="search-icon"
                width={16}
                height={16}
              />
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              >
                <Image
                  aria-hidden
                  src="/icons/shopping-cart-icon.svg"
                  alt="shopping"
                  width={16}
                  height={16}
                />
              </button>
              <CartPopup
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />
            </div>
            <Link
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="/panel"
              // target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/icons/user-icon.svg"
                alt="user-icon"
                width={16}
                height={16}
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">باز کردن منوی اصلی</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <hr />

        {/* Main Navigation */}
        <nav
          className="mx-auto flex max-w-7xl items-center justify-center p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10 bg-black opacity-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">شرکت شما</span>
              <Image
                className="h-8 w-auto"
                src="/icons/logo.svg"
                alt=""
                height={20}
                width={20}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">بستن منو</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  ورود
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
