"use client";

import Link from "next/link";
import ProductCard from "../layouts/Cards/ProductCard/ProductCard";
import { getProductImage } from "./GetProductImage";
import { Product } from "@/contracts/products";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  moreHref: string;
  moreLabel?: string;
}

export default function HomeProductSection({
  title,
  subtitle,
  products,
  moreHref,
  moreLabel = "مشاهده همه",
}: Props) {
  const list = products ?? [];

  if (list.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
        <Link
          href={moreHref}
          className="shrink-0 text-sm font-medium text-yellow-600 hover:text-yellow-700">
          {moreLabel} ←
        </Link>
      </div>

      {/* اسکرول افقی روی موبایل/دسکتاپ */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
        {list.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-[30%] lg:w-[23%]">
            <ProductCard
              id={product.id}
              image={getProductImage(product.images)}
              title={product.title}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
