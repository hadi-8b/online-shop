// src/components/cart/CartInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { fetchCart } from "@/store/cart/cartSlice";
import useAuth from "@/hooks/useAuth";

export default function CartInitializer() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      dispatch(fetchCart());
    }
  }, [dispatch, loading, user]);

  return null;
}
