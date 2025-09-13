// src/components/cart/CartInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { fetchCart } from "@/store/cart/cartSlice";

export default function CartInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // بارگیری اولیه سبد خرید با استفاده از dispatch مستقیم
    // این رویکرد از مشکلات احتمالی با custom hook جلوگیری می‌کند
    dispatch(fetchCart());
  }, [dispatch]);

  return null;
}