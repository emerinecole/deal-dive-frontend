"use client";

import { APP_ROUTES } from "@/constants/app-routes";
import { ForbiddenError } from "@/lib/types/errors/server-reponse-errors/forbidden-error";
import { InvalidTokenError } from "@/lib/types/errors/server-reponse-errors/invalid-token-error";
import { UnauthorizedError } from "@/lib/types/errors/server-reponse-errors/unauthorized-error";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minute
            // TODO: better handle of errors here
            retry: (failureCount: number, error: unknown) => {
              if (error instanceof InvalidTokenError) {
                window.location.href = APP_ROUTES.AUTH.LOGIN;
                return false;
              }

              if (failureCount === 3) {
                // If we've failed 3 times with the forbidden error, redirect to logout
                if (
                  error instanceof ForbiddenError ||
                  error instanceof UnauthorizedError
                ) {
                  router.push(APP_ROUTES.AUTH.LOGIN);
                  return false;
                }
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
