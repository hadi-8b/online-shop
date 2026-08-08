"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type Category = { id: number; name: string };

interface Props {
  categories?: Category[];
}

export default function ProductFilters({ categories = [] }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") || "");
  const [minPrice, setMinPrice] = useState(sp.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(sp.get("max_price") || "");
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [category, setCategory] = useState(sp.get("category") || "");

  const apply = (e?: FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (sort && sort !== "newest") params.set("sort", sort);
    else if (sort) params.set("sort", sort);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clear = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setCategory("");
    router.push("/products");
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-yellow-400/80 focus:border-yellow-400 bg-gray-50/50 focus:bg-white";

  return (
    <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-base">فیلتر محصولات</h3>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-gray-400 hover:text-yellow-600 transition">
          حذف فیلترها
        </button>
      </div>

      <form onSubmit={apply} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            جستجو
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="نام محصول را بنویسید..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            دسته‌بندی
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}>
            <option value="">همه دسته‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {typeof c.name === "string" ? c.name : String(c.name)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            قیمت (تومان)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="از"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={inputClass}
            />
            <span className="text-gray-300 shrink-0">تا</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="تا"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            مرتب‌سازی
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={inputClass}>
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-white py-3 rounded-xl text-sm font-semibold shadow-sm transition">
          اعمال فیلتر
        </button>
      </form>
    </aside>
  );
}
