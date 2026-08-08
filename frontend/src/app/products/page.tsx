// src/app/products/page.tsx
import Pagination from "@/components/Pagination/Pagination";
import ProductFilters from "@/components/Products/ProductFilters";
import ProductsList from "@/components/Products/ProductsList";
import { getCategories, getProductsList } from "@/services/api/products";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
    category?: string;
    search?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export const metadata: Metadata = {
  title: "محصولات | فروشگاه آنلاین",
  description: "خرید آنلاین محصولات با بهترین قیمت و کیفیت",
};

export default async function ProductsPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = searchParams.page || "1";
  const per_page = searchParams.per_page || "12";

  const [productsData, categoriesRes] = await Promise.all([
    getProductsList({
      page,
      per_page,
      category: searchParams.category,
      search: searchParams.search,
      sort: searchParams.sort,
      min_price: searchParams.min_price,
      max_price: searchParams.max_price,
    }),
    getCategories().catch(() => ({ data: [] })),
  ]);

  const categories = Array.isArray(categoriesRes)
    ? categoriesRes
    : categoriesRes?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">محصولات</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* سایدبار فیلتر — مثل دیجی‌کالا */}
        <div className="lg:w-72 shrink-0">
          <ProductFilters categories={categories} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600 mb-4">
            {productsData?.total ?? 0} محصول یافت شد
          </div>

          <ProductsList productsData={productsData} />

          {productsData?.last_page > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={parseInt(page)}
                lastPage={productsData.last_page}
                baseUrl="/products"
                queryParams={{
                  per_page,
                  ...(searchParams.category && { category: searchParams.category }),
                  ...(searchParams.search && { search: searchParams.search }),
                  ...(searchParams.sort && { sort: searchParams.sort }),
                  ...(searchParams.min_price && { min_price: searchParams.min_price }),
                  ...(searchParams.max_price && { max_price: searchParams.max_price }),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}