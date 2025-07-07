import JotaiProvider from "./jotai-provider";
import { QueryProvider } from "./query-provider";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
            <JotaiProvider>
              <>{children}</>
            </JotaiProvider>
    </QueryProvider>
  );
}
