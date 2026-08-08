"use client";

import HomeProductSection from "./HomeProductSection";

interface Props {
  productsData: any;
}

export default function OldProductsList({ productsData }: Props) {
  const products = productsData?.oldest_products?.data ?? [];

  return (
    <HomeProductSection
      title="محصولات منتخب"
      subtitle="طراحی شیک و مدرن با جزئیات دقیق"
      products={products}
      moreHref="/products?sort=oldest"
    />
  );
}