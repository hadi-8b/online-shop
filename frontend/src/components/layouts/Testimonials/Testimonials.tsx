// src/components/layouts/Testimonials/Testimonials.tsx
import Image from "next/image";
import React from "react";

interface Customer {
  id: number;
  name: string;
  location: string;
  image: string;
  testimonial: string;
}

const customers: Customer[] = [
  {
    id: 1,
    name: "نیک وید",
    location: "تهران",
    image: "/images/photo1.png",
    testimonial: "طراحی منحصر به فرد با جزئیات دقیق و راحتی بی‌نظیر. تجربه‌ای متفاوت از راحتی و استایل.",
  },
  {
    id: 2,
    name: "ناتاشا رییس",
    location: "اصفهان",
    image: "/images/photo2.png",
    testimonial: "طراحی منحصر به فرد با جزئیات دقیق و راحتی بی‌نظیر. تجربه‌ای متفاوت از راحتی و استایل.",
  },
  {
    id: 3,
    name: "کارولین بنکس",
    location: "شیراز",
    image: "/images/photo3.png",
    testimonial: "طراحی منحصر به فرد با جزئیات دقیق و راحتی بی‌نظیر. تجربه‌ای متفاوت از راحتی و استایل.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">مشتریان ما</h2>
        <p className="text-gray-600 mt-2">طراحی شیک و مدرن با جزئیات دقیق و برجسته.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div
              key={customer.id} // تغییر کلید به id
              className="bg-white p-6 shadow-md text-center"
            >
              <Image
                src={customer.image}
                alt={customer.name}
                height={200}
                width={200}
                className="w-16 h-16 mx-auto rounded-full mb-4"
              />
              <p className="text-gray-700 mb-4">{customer.testimonial}</p>
              <p className="font-semibold text-yellow-600">{customer.name}, {customer.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
