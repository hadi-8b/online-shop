// src/components/layouts/FeaturedImageSection/FeaturedImageSection.tsx
import Image from "next/image";

const FeaturedImageSection: React.FC = () => {
  return (
    <div className="relative mt-16 mb-16 ">
      {/* تصویر اصلی */}
      <div className="relative">
        <Image
          src="/images/FeaturedImageSection/386007d472079d7834701f4e609892e7.png"
          alt="Featured Section"
          width={1200}
          height={500} 
          className="w-full h-64 md:h-80 lg:h-96 object-cover "
          priority 
        />
        {/* متن روی تصویر */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <p className="text-white text-lg md:text-2xl lg:text-3xl font-bold text-center px-4">
          به سمت اهداف خود بدوید
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedImageSection;
