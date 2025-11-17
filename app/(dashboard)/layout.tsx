import Link from "next/link";
import { Home, Plus, Bookmark, User } from "lucide-react";
import AuthRoute from "@/app/components/protected-route/auth-route";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/lib/supabase-auth";
import LogoutButton from "@/components/ui/logout-button";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Create", url: "/create", icon: Plus },
  { title: "Saved", url: "/saved", icon: Bookmark },
  { title: "My Deals", url: "/my-deals", icon: User }, // New page added
];

async function getUserInfo() {
  const session = await getSession();
  return {
    email: session?.user?.email || "",
    name:
      session?.user?.user_metadata?.full_name ||
      session?.user?.email?.split("@")[0] ||
      "User",
    initials: (session?.user?.user_metadata?.full_name ||
      session?.user?.email ||
      "U")
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userInfo = await getUserInfo();

  return (
    <AuthRoute>
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="border-r border-blue-200 bg-gradient-to-b from-white via-blue-50 to-blue-100">
          <SidebarHeader className="border-b border-blue-200 p-4">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="relative h-10 w-10 rounded-xl bg-white shadow-lg shadow-blue-200 overflow-hidden">
                <Image
                  src="/images/deal-dive/iconLogo.png"
                  alt="Deal Dive Icon Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="relative h-6 w-[120px]">
                  <Image
                    src="/images/deal-dive/nameLogo.png"
                    alt="Deal Dive Name Logo"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <span className="text-xs text-blue-600">Find local deals</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-blue-700/70 px-3 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="group relative overflow-hidden rounded-lg transition-all duration-200 hover:bg-blue-100 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-200">
                            <item.icon className="h-4 w-4 text-blue-700 group-hover:text-blue-900" />
                          </div>
                          <span className="font-medium text-blue-900">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-blue-200 bg-white/80 px-6 backdrop-blur-xl transition-all">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg transition-all hover:bg-blue-100 hover:scale-105 active:scale-95" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-700">
                Welcome back,{" "}
                <span className="text-blue-900 font-semibold">{userInfo.name}</span>!
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white transition-all hover:ring-blue-200/50 hover:scale-105 active:scale-95">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white text-sm font-semibold">
                      {userInfo.initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border border-blue-200 bg-white/95 backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="font-semibold">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-blue-900">{userInfo.name}</p>
                      <p className="text-xs text-blue-700 font-normal">{userInfo.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-200/40" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg transition-colors hover:bg-blue-100">
                    <Link href="/account" className="flex items-center gap-2 text-blue-900">
                      <User className="h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-200/40" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-100 transition-colors"
                  >
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthRoute>
  );
}
