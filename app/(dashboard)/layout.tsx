import Link from "next/link";
import { Home, Plus, TrendingUp, Bookmark, Search, User } from "lucide-react";
import AuthRoute from "@/app/components/protected-route/auth-route";
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
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create",
    url: "/create",
    icon: Plus,
  },
  {
    title: "Hot Deals",
    url: "/hot",
    icon: TrendingUp,
  },
  {
    title: "Saved",
    url: "/saved",
    icon: Bookmark,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();

  return (
    <AuthRoute>
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background to-accent/5">
          <SidebarHeader className="border-b border-border/40 p-4">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold tracking-tight">
                  Deal Dive
                </span>
                <span className="text-xs text-muted-foreground">
                  Find local deals
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="group relative overflow-hidden rounded-lg transition-all duration-200 hover:bg-accent/50 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 px-3 py-2.5"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/50 transition-colors group-hover:bg-primary/10">
                            <item.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-gradient-to-br from-background via-background to-accent/5">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl transition-all">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg transition-all hover:bg-accent/50 hover:scale-105 active:scale-95" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Welcome back,{" "}
                <span className="text-foreground font-semibold">
                  {userInfo.name}
                </span>
                ! 👋
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-background transition-all hover:ring-primary/20 hover:scale-105 active:scale-95">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                      {userInfo.initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border border-border/40 bg-background/95 backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="font-semibold">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{userInfo.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        {userInfo.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg transition-colors hover:bg-accent/50">
                    <Link href="/account" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
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