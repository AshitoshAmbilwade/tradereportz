"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  LineChart,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/trades", icon: TrendingUp, label: "Trades" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/reports", icon: FileText, label: "Reports" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const PROTECTED_ROUTES = NAV_ITEMS.map((n) => n.path);

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-1 ring-primary/20">
      {initials}
    </div>
  );
}

function AppLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 animate-pulse">
        <LineChart className="h-7 w-7" strokeWidth={2} />
      </div>
      <div className="flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, authInitialized, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Client-side fallback guard (middleware handles server-side)
  useEffect(() => {
    if (!authInitialized) return;
    if (!isAuthenticated && isProtectedRoute) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authInitialized, isAuthenticated, isProtectedRoute, pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Show full-screen loader while session is being resolved on protected pages
  if (!authInitialized && isProtectedRoute) {
    return <AppLoadingScreen />;
  }

  // Not authenticated on a protected route — show loader while the redirect fires
  if (authInitialized && !isAuthenticated && isProtectedRoute) {
    return <AppLoadingScreen />;
  }

  // Public pages (login / signup / landing) — render without sidebar
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card shadow-sm text-foreground transition-colors hover:bg-accent"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Sidebar overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border/60
          shadow-xl transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LineChart size={16} strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              TradeReportz
            </span>
          </div>
          <button
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* User profile block */}
        {user && (
          <div className="px-4 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name ?? user.email} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground leading-tight">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <span className={`
                inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider
                ${user.subscriptionPlan === "pro"
                  ? "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/25"
                  : "bg-primary/10 text-primary ring-1 ring-primary/20"}
              `}>
                {user.subscriptionPlan === "pro" ? "⚡ Pro" : "Free Plan"}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"}
                `}
              >
                <Icon
                  size={17}
                  className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-border/50 px-3 py-4 space-y-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col min-w-0 overflow-auto">
        {/* Top bar (mobile spacing) */}
        <div className="sticky top-0 z-30 flex h-14 items-center border-b border-border/50 bg-background/95 backdrop-blur-sm px-6 lg:hidden">
          <div className="ml-10 flex items-center gap-2">
            <LineChart size={16} className="text-primary" strokeWidth={2.5} />
            <span className="text-sm font-bold tracking-tight">TradeReportz</span>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
