// src/components/layouts/Cards/FeatureCard/FeatureCard.tsx
import React from "react";
import Image from "next/image";
import style from "./FeatureCard.module.css";
import DiscountCard from "../DiscountCard/DiscountCard";

const FeatureCard = () => {
  return (
    <>
      <section className={style.featureCardbg}>
        <div className="container mx-auto px-8 pt-8 pb-8 md:px-20 flex flex-col lg:flex-row items-center justify-center">
          <div className=" container px-8 py-4 lg:w-1/2 mb-6 lg:mb-0">
            <h2 className="text-black text-4xl font-bold mb-4">
              ویژگی‌های شگفت‌انگیزی که استایل شما را جذاب می‌کنند!
            </h2>
            <p className="text-gray-600 mb-6">
              استایل منحصربه‌فرد، راحتی بی‌نظیر! طراحی مدرن برای تجربه‌ای
              متفاوت.
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded">
              مشاهده تمام محصولات
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <Image
              src="/images/shoes.png"
              alt="Cool Shoes"
              width={600}
              height={700}
            />
          </div>
        </div>
      </section>
      <DiscountCard />
    </>
  );
};

export default FeatureCard;
