// src/components/layouts/Cards/DiscountCard/DiscountCard.tsx
import React from "react";
import Image from "next/image";
import style from "./DiscountCard.module.css";

const DiscountCard = () => {
  return (
    <section
      className={` ${style.DiscountCard} mx-auto w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-8/12 bg-white shadow-lg flex flex-col lg:flex-row overflow-hidden`}
    >
      {/* Left Section */}
      <div className="flex-1 w-full p-6">
        <div className="pl-8">
          <div className="flex items-center mb-7 mt-7">
            <Image
              className="mr-5"
              src={"/images/profile.png"}
              alt="profile"
              width={40}
              height={40}
            />
            <div>
              <h4 className="font-bold text-gray-800">متین مرادی</h4>
              <span className="text-sm text-gray-500">مدیر ارشد بازاریابی</span>
            </div>
          </div>
          <div className="w-full sm:w-10/12">
            <h3 className="text-black text-2xl font-extrabold mb-4">
              انتخابی شیک و راحت برای شما
            </h3>
            <p className="text-gray-500 mb-4">
              ورودی (ویترین) فروشگاه به شکلی زیبا و منحصر‌به‌فرد طراحی شده است.
              طراحی منحصربه‌فرد و جذاب تجربه‌ای راحت و لذت‌بخش را برای شما فراهم
              می‌کند. استایل و راحتی را هم‌زمان تجربه کنید.
            </p>
            <p className="text-gray-500 mb-4">
              ناماکی، با طراحی مدرن و استایلی منحصربه‌فرد. فضای فروشگاهی ما
              ترکیبی از زیبایی و راحتی را برای شما فراهم می‌کند.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        className={`${style.DiscountCardbg} flex-1 w-full xl:top-1/2 p-8 text-center`}
      >
        <h2 className="text-white text-2xl font-extrabold mb-7">۲۵٪ تخفیف</h2>
        <p className="text-gray-300 mb-6 text-sm sm:w-10/12 mx-auto">
          استایل منحصربه‌فرد با راحتی بی‌نظیر! طراحی مدرن و شیک، همراه با نهایت
          راحتی برای شما.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 font-semibold py-2 px-6 rounded">
          تخفیف بگیرید
        </button>
      </div>
    </section>
  );
};

export default DiscountCard;
