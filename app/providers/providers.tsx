import JotaiProvider from "./jotai-provider";
import { QueryProvider } from "./query-provider";
import SupabaseProvider from "./supabase-provider";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <QueryProvider>
        <JotaiProvider>
          <>{children}</>
        </JotaiProvider>
      </QueryProvider>
    </SupabaseProvider>
  );
}
