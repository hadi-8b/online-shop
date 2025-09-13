// src/components/layouts/Footer/Footer.tsx
"use client";

import PopularToday from "../PopularToday/PopularToday";
import style from "./footer.module.css";

export default function Footer() {
  return (
    <>
      <PopularToday />
      <footer className={`max-w-6xl mx-auto px-4 py-10 ${style.footer}`}>
        {/* بخش اصلی فوتر */}
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* ستون اول */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-bold mb-4">درباره ما</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-black">
                  سازمان
                </a>
              </li>
              <li>
                <a href="/partners" className="hover:text-black">
                  شرکا
                </a>
              </li>
              <li>
                <a href="/clients" className="hover:text-black">
                  مشتریان
                </a>
              </li>
            </ul>
          </div>

          {/* ستون دوم */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-bold mb-4">لینک‌های جالب</h4>
            <ul className="space-y-2">
              <li>
                <a href="/gallery" className="hover:text-black">
                  گالری تصاویر
                </a>
              </li>
              <li>
                <a href="/team" className="hover:text-black">
                  تیم ما
                </a>
              </li>
              <li>
                <a href="/socials" className="hover:text-black">
                  شبکه‌های اجتماعی
                </a>
              </li>
            </ul>
          </div>

          {/* ستون سوم */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-bold mb-4">دستاوردها</h4>
            <ul className="space-y-2">
              <li>
                <a href="/awards" className="hover:text-black">
                  جوایز برنده شده
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-black">
                  رسانه‌ها
                </a>
              </li>
              <li>
                <a href="/clients" className="hover:text-black">
                  مشتریان شگفت‌انگیز ما
                </a>
              </li>
            </ul>
          </div>

          {/* ستون چهارم */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-bold mb-4">تماس با ما</h4>
            <p className="text-sm mb-4">
              طراحی منحصر به فرد با جزئیات دقیق و بی‌نظیر، که تجربه‌ای متفاوت از
              راحتی و استایل را فراهم می‌آورد.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+632368322" className="hover:text-black">
                  📞 تلفن: (+63) 236 8322
                </a>
              </li>
              <li>
                <a href="mailto:public@news.com" className="hover:text-black">
                  📧 ایمیل: public@news.com
                </a>
              </li>
              <li>⏰ Mon - Fri: 10am - 6pm</li>
              <li>📍 آدرس: 639 Jade Valley, Washington DC</li>
            </ul>
          </div>
        </div>
      </footer>
      {/* کپی‌رایت */}
      <div className="bg-gray-200 text-gray-600 py-4 text-center text-sm">
        © Copyright 2024
      </div>
    </>
  );
}
