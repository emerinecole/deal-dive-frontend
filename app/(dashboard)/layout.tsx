//import AuthRoute from "@/app/components/protected-route/auth-route";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthRoute>
        <div className="flex flex-col min-h-screen w-full min-w-0">
          <main className="flex flex-1 w-full flex-col">
            {children}
          </main>
        </div>
    // </AuthRoute>
  );
}
