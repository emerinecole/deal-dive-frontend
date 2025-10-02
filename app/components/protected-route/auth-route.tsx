import { APP_ROUTES } from "@/constants/app-routes";
import { getSession } from "@/lib/supabase-auth";
import { redirect } from "next/navigation";

export default async function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect(APP_ROUTES.AUTH.SIGNUP);
  }

  return <>{children}</>;
}
