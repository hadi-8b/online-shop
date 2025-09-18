// src/components/providers/ClientProviders.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import CartInitializer from "@/components/Cart/CartInitializer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <CartInitializer />
      {children}
    </Provider>
  );
}