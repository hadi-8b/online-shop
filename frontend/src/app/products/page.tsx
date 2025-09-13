// src/app/products/page.tsx
import ProductsSidebar from "@/components/layouts/ProductsSidebar/ProductsSidebar";
import Pagination from "@/components/Pagination/Pagination";
import ProductsList from "@/components/Products/ProductsList";
import { getProductsList } from "@/services/api/products";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
    category?: string;
    search?: string;
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

  const productsData = await getProductsList({
    page,
    per_page,
    category: searchParams.category,
    search: searchParams.search,
  });

  // تعیین عنوان صفحه بر اساس فیلترها
  let pageTitle = "محصولات";
  if (searchParams.category) {
    pageTitle = `محصولات دسته ${searchParams.category}`;
  }
  if (searchParams.search) {
    pageTitle = `نتایج جستجو برای: ${searchParams.search}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">{pageTitle}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <ProductsSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="space-y-6">
            {/* Products Count */}
            <div className="text-sm text-gray-600 mb-4">
              {productsData.total} محصول یافت شد
            </div>
            
            {/* Products Grid */}
            <ProductsList productsData={productsData} />

            {/* Pagination */}
            {productsData.last_page > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={parseInt(page)}
                  lastPage={productsData.last_page}
                  baseUrl="/products"
                  queryParams={{ 
                    per_page,
                    ...(searchParams.category && { category: searchParams.category }),
                    ...(searchParams.search && { search: searchParams.search }),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}