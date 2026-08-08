"use client";

import HomeProductSection from "./HomeProductSection";

interface Props {
  productsData: any; // یا تایپ درست ProductsData هوم
}

export default function NewProductsList({ productsData }: Props) {
  const products = productsData?.newest_products?.data ?? [];

  return (
    <HomeProductSection
      title="محصولات جدید"
      subtitle="تازه‌ترین‌های فروشگاه"
      products={products}
      moreHref="/products?sort=newest"
    />
  );
}