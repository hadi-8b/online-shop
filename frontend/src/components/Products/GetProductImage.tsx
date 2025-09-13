// src/components/Products/GetProductImage.tsx
import { ProductImage } from "@/contracts/products";

export const getProductImage = (images: ProductImage[]) => {
  if (!images || images.length === 0) {
    return "/images/products/10pr.png";
  }

  const primaryImage = images.find((image) => image.is_primary === 1);
  const selectedImage = primaryImage || images[0];

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${baseURL}/storage/${selectedImage.image_path}`;
};
