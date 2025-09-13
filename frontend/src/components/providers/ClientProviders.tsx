// src/components/providers/ClientProviders.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import AuthInitializer from "@/components/auth/AuthInitializer";
import CartInitializer from "@/components/Cart/CartInitializer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <CartInitializer />
      {children}
    </Provider>
  );
}