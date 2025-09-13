// src/components/Pagination/Pagination.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
}

const Pagination = ({
  currentPage,
  lastPage,
  baseUrl,
  queryParams = {},
}: PaginationProps) => {
  const pathname = usePathname();

  // تابع ساخت URL با پارامترهای query
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(queryParams);
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // ایجاد آرایه‌ای از شماره صفحات برای نمایش
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // تعداد صفحات قابل نمایش

    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(lastPage, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (lastPage <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 space-x-reverse">
      {/* دکمه صفحه قبل */}
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`px-3 py-1 rounded-md border ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === 1}
      >
        قبلی
      </Link>

      {/* شماره صفحات */}
      <div className="flex space-x-1 space-x-reverse">
        {getPageNumbers().map((pageNumber) => (
          <Link
            key={pageNumber}
            href={createPageUrl(pageNumber)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === pageNumber
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {pageNumber}
          </Link>
        ))}
      </div>

      {/* دکمه صفحه بعد */}
      <Link
        href={createPageUrl(currentPage + 1)}
        className={`px-3 py-1 rounded-md border ${
          currentPage === lastPage
            ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        aria-disabled={currentPage === lastPage}
      >
        بعدی
      </Link>
    </div>
  );
};

export default Pagination;