"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SEO_CONFIG } from "~/app";
import { useSupabase } from "~/components/providers/SupabaseProvider";
import { cn } from "~/lib/cn";
import { Button } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

import { LanguageToggle } from "../language-toggle";
import { NotificationsWidget } from "../notifications/notifications-widget";
import { ThemeToggle } from "../theme-toggle";
import { HeaderUserDropdown } from "./header-user";

interface HeaderProps {
  children?: React.ReactNode;
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const { isLoading, user } = useSupabase();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavigation = [
    { href: "/", name: t("Nav.home") },
    // { href: "/products", name: t("Nav.products") },
    { href: "/pricing", name: t("Nav.pricing") },
  ];

  const dashboardNavigation = [
    { href: "/dashboard/stats", name: t("Nav.stats") },
    { href: "/dashboard/generate", name: t("Nav.generate") },
    { href: "/dashboard/profile", name: t("Nav.profile") },
    { href: "/dashboard/settings", name: t("Nav.settings") },
    { href: "/dashboard/uploads", name: t("Nav.uploads") },
    { href: "/admin/summary", name: t("Nav.admin") },
  ];

  const isDashboard =
    user &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")); // todo: remove /admin when admin role is implemented
  const navigation = isDashboard ? dashboardNavigation : mainNavigation;

  const renderContent = () => (
    <header
      className={`
        sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md
        transition-all duration-200
        supports-[backdrop-filter]:bg-background/60
      `}
    >
      <div
        className={`
          container mx-auto max-w-7xl px-4
          sm:px-6
          lg:px-8
        `}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              className={`
                group flex items-center gap-2 transition-all
                hover:scale-105
              `}
              href="/"
            >
              <span
                className={cn(
                  "text-xl font-bold transition-all",
                  !isDashboard
                    ? `
                      bg-gradient-to-r from-primary via-primary/80 to-primary/60
                      bg-clip-text tracking-tight text-transparent
                      group-hover:from-primary/90 group-hover:to-primary/50
                    `
                    : `
                      text-foreground
                      group-hover:text-primary
                    `
                )}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <nav
              className={`
                hidden
                md:flex
              `}
            >
              <ul className="flex items-center gap-6">
                {isLoading
                  ? Array.from({ length: navigation.length }).map((_, i) => (
                      <li key={i}>
                        <Skeleton className="h-6 w-20" />
                      </li>
                    ))
                  : navigation.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname?.startsWith(item.href));

                      return (
                        <li key={item.name}>
                          <Link
                            className={cn(
                              `
                                relative text-sm font-medium transition-all
                                duration-200
                                after:absolute after:-bottom-1 after:left-0
                                after:h-0.5 after:w-0 after:bg-primary
                                after:transition-all after:duration-200
                                hover:scale-105 hover:text-primary
                                hover:after:w-full
                              `,
                              isActive
                                ? `
                                  font-semibold text-primary
                                  after:w-full
                                `
                                : "text-muted-foreground"
                            )}
                            href={item.href}
                          >
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <NotificationsWidget />
            )}

            {showAuth && (
              <div
                className={`
                  hidden
                  md:block
                `}
              >
                {user ? (
                  <HeaderUserDropdown
                    isDashboard={!!isDashboard}
                    userEmail={user.email || ""}
                    userImage={user.user_metadata?.avatar_url}
                    userName={
                      user.user_metadata?.name || user.user_metadata?.full_name
                    }
                  />
                ) : isLoading ? (
                  <Skeleton className="h-10 w-32 rounded-lg" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/sign-in">
                      <Button
                        className={`
                          transition-all
                          hover:scale-105 hover:bg-primary/10
                        `}
                        size="sm"
                        variant="ghost"
                      >
                        {t("Auth.signIn")}
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        className={`
                          transition-all
                          hover:scale-105 hover:shadow-md
                        `}
                        size="sm"
                      >
                        {t("Auth.signUp")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <LanguageToggle />

            {!isDashboard &&
              (isLoading ? (
                <Skeleton className="h-9 w-9 rounded-full" />
              ) : (
                <ThemeToggle />
              ))}

            {/* Mobile menu button */}
            <Button
              className={`
                transition-all
                hover:scale-105 hover:bg-primary/10
                md:hidden
              `}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size="sm"
              variant="ghost"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className={`
            duration-200 animate-in slide-in-from-top-2
            md:hidden
          `}
        >
          <div
            className={`
              space-y-1 border-b bg-background/50 px-4 py-3 backdrop-blur-sm
            `}
          >
            {isLoading
              ? Array.from({ length: navigation.length }).map((_, i) => (
                  <div className="py-2" key={i}>
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))
              : navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <Link
                      className={cn(
                        `
                          block rounded-lg px-3 py-2 text-base font-medium
                          transition-all duration-200
                          hover:scale-105
                        `,
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : `
                            text-foreground
                            hover:bg-primary/5 hover:text-primary
                          `
                      )}
                      href={item.href}
                      key={item.name}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
          </div>

          {showAuth && !user && (
            <div className="space-y-2 border-b bg-background/30 px-4 py-3">
              <Link
                className={`
                  block rounded-lg px-3 py-2 text-base font-medium
                  transition-all duration-200
                  hover:scale-105 hover:bg-primary/5 hover:text-primary
                `}
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("Auth.signIn")}
              </Link>
              <Link
                className={`
                  block rounded-lg bg-primary px-3 py-2 text-base font-medium
                  text-primary-foreground shadow-sm transition-all duration-200
                  hover:scale-105 hover:bg-primary/90 hover:shadow-md
                `}
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("Auth.signUp")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );

  return renderContent();
}
