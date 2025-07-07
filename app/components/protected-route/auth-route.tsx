import { APP_ROUTES } from "@/constants/app-routes";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session) {
    redirect(APP_ROUTES.AUTH.SIGNUP);
  }

  return <>{children}</>;
}
