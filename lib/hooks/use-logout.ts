"use client";

import { useCallback } from "react";
import { APP_ROUTES } from "@/constants/app-routes";
import { useSupabase } from "@/app/providers/supabase-provider";
import { useRouter } from "next/navigation";

export function useLogout() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push(APP_ROUTES.AUTH.SIGNUP);
  }, [supabase, router]);

  return handleLogout;
}
