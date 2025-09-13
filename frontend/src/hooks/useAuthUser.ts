// src/hooks/useAuthUser.ts
import { useAuthContext } from "@/contexts/AuthContext.tsx";

export const useAuthUser = () => {
  const context = useAuthContext();
  return context;
};