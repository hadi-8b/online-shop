// src/app/products/[id]/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">محصول مورد نظر یافت نشد</h2>
      <p className="text-gray-600 mb-8">
        متاسفانه محصولی که به دنبال آن هستید در فروشگاه ما موجود نیست.
      </p>
      <Link 
        href="/products" 
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
      >
        بازگشت به صفحه محصولات
      </Link>
    </div>
  );
}