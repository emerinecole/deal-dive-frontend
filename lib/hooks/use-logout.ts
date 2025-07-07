"use client";

import { useCallback } from "react";
import { APP_ROUTES } from "@/constants/app-routes";

export function useLogout() {
  const handleLogout = useCallback(() => {
    window.location.href = APP_ROUTES.AUTH.LOGOUT;
  }, []);

  return handleLogout;
}
