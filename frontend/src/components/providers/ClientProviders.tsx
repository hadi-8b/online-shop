"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { SWRConfig } from "swr";
import CartInitializer from "@/components/Cart/CartInitializer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          shouldRetryOnError: false,
          // fetcher عمومی لازم نداریم چون apiClient خودت همه جا استفاده میشه
        }}
      >
        <CartInitializer />
        {children}
      </SWRConfig>
    </Provider>
  );
}
