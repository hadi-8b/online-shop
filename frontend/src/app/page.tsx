// app/page.tsx
import FeatureCard from "@/components/layouts/Cards/FeatureCard/FeatureCard";
import SneakersModels from "@/components/layouts/SneakersModels/SneakersModels";
import ProductsSection from "@/components/Products/OldProductsList";
import Testimonials from "@/components/layouts/Testimonials/Testimonials";
import FeaturedImageSection from "@/components/layouts/FeaturedImageSection/FeaturedImageSection";
import NewProductsList from "@/components/Products/NewProductsList";
import { getHomeProducts } from "@/services/api/products";

export default async function Home() {
  // دریافت داده‌ها
  const productsData = await getHomeProducts();

  return (
    <>
      <main className="bg-gray-50 min-h-screen">
        <FeatureCard />
        <div className="container mx-auto my-8 px-4">
          <SneakersModels />
          <ProductsSection productsData={productsData} />
          <FeaturedImageSection />
          <NewProductsList productsData={productsData} />
          <Testimonials />
        </div>
      </main>
    </>
  );
}