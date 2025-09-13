// src/components/layouts/PopularToday/PopularToday.tsx
import React from "react";
import style from "./PopularToday.module.css";
import Image from "next/image";

const items = [
  {
    id: 1,
    image: "/images/PopularTodayimg/11.png", // لینک به تصویر
    text: "طراحی زیبا و متناسب با نیاز شما، که راحتی و استایل را با هم ترکیب می‌کند.",
  },
  {
    id: 2,
    image: "/images/PopularTodayimg/22.png",
    text: "طراحی زیبا و متناسب با نیاز شما، که راحتی و استایل را با هم ترکیب می‌کند.",
  },
  {
    id: 3,
    image: "/images/PopularTodayimg/33.png",
    text: "طراحی مدرن و نوآورانه که جذابیت و راحتی را در کنار هم ارائه می‌دهد.",
  },
  {
    id: 4,
    image: "/images/PopularTodayimg/44.png",
    text: "طراحی مدرن و متناسب با سلیقه شما، که راحتی و استایل را با هم ترکیب می‌کند.",
  },
];

const PopularToday: React.FC = () => {
  return (
    <div className={`py-8 px-4 ${style.bgimgPopularToday}`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 pl-6">محبوب امروز</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center group"
            >
              <Image
                src={item.image}
                alt={item.text}
                width={48}
                height={48}
                className="rounded-full mb-2 group-hover:scale-105 transition-transform"
              />
              <p className="text-xs sm:text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularToday;
