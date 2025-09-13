// src/components/Products/ProductImages.tsx
'use client';
import { ProductImage } from "@/contracts/products";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState } from "react";
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface Props {
  images: ProductImage[];
  title: string;
}

export default function ProductImages({ images, title }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return (
    <div className="w-full">
      {/* Main Slider */}
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="h-96 w-full mb-4"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <Image
                src={`${baseURL}/storage/${image.image_path}`}
                alt={`${title} - تصویر ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs Slider */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="h-24"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full cursor-pointer">
              <Image
                src={`${baseURL}/storage/${image.image_path}`}
                alt={`${title} - thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}