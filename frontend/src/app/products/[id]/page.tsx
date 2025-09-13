// src/app/products/[id]/page.tsx
import ProductDetails from "@/components/Products/ProductDetails";
import { getSingleProduct } from "@/services/api/products";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const { product } = await getSingleProduct(params.id);

    return {
      title: product.title || 'محصول',
      description: product.description?.substring(0, 120) || 'توضیحات محصول',
    };
  } catch (error) {
    return {
      title: 'محصول یافت نشد',
      description: 'این محصول وجود ندارد',
    };
  }
}

export default async function ProductSinglePage(props: Props) {
  const params = await props.params;
  
  try {
    const { product } = await getSingleProduct(params.id);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ProductDetails product={product} />
        </div>
      </div>
    );
  } catch (error) {
    // این کد اجرا نمی‌شه چون getSingleProduct خودش notFound() صدا می‌زنه
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">خطا در بارگذاری محصول</h1>
          <p className="text-gray-600 mt-2">لطفا دوباره تلاش کنید</p>
        </div>
      </div>
    );
  }
}