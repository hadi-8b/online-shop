// src/components/layouts/SneakersModels/SneakersModels.tsx
import React from "react";
import Image from "next/image";

interface SneakerCardProps {
  title: string;
  description: string;
  image: string;
}

const SneakerCard: React.FC<SneakerCardProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <div className="group relative content-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Image
        src={image}
        alt={title}
        width={500}
        height={800}
        className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4
       text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="w-5/6 text-sm ">{description}</p>
      </div>
    </div>
  );
};

const SneakerCards: React.FC = () => {
  const sneakers = [
    {
      id: 1,
      title: "طراحی شیک و مدرن، با جزئیات دقیق.",
      description:
        "طراحی منحصر به‌فرد و جذاب با جزئیات دقیق. تجربه‌ای متفاوت و راحت.",
      image: "/images/sneaker/sneaker1.png",
    },
    {
      id: 2,
      title: "طراحی شیک و مدرن، با جزئیات دقیق.",
      description:
        "طراحی منحصر به‌فرد و جذاب با جزئیات دقیق. تجربه‌ای متفاوت و راحت.",
      image: "/images/sneaker/sneaker2.png",
    },
    {
      id: 3,
      title: "طراحی شیک و مدرن، با جزئیات دقیق.",
      description:
        "طراحی منحصر به‌فرد و جذاب با جزئیات دقیق. تجربه‌ای متفاوت و راحت.",
      image: "/images/sneaker/sneaker3.png",
    },
    {
      id: 4,
      title: "طراحی شیک و مدرن، با جزئیات دقیق.",
      description:
        "طراحی منحصر به‌فرد و جذاب با جزئیات دقیق. تجربه‌ای متفاوت و راحت.",
      image: "/images/sneaker/sneaker4.png",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-4">مدل‌های کفش ورزشی</h2>
      <p className="text-center text-gray-500 mb-8">
      طراحی شیک و مدرن با جزئیات دقیق و بی‌نظیر.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sneakers.map((sneaker) => (
          <SneakerCard
            key={sneaker.id}
            title={sneaker.title}
            description={sneaker.description}
            image={sneaker.image}
          />
        ))}
      </div>
    </div>
  );
};

export default SneakerCards;
