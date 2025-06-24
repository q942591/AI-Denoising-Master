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

import { DailyRewardWidget } from "../daily-reward/daily-reward-widget";
import { LanguageToggle } from "../language-toggle";
import { NotificationsWidget } from "../notifications/notifications-widget";
import { ThemeToggle } from "../theme-toggle";
import { HeaderUserDropdown } from "./header-user";

// Custom denoising icon component
const DenoisingIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <svg
      aria-label="AI Image Denoising Icon"
      className={`
        transition-all duration-300
        group-hover:scale-110
      `}
      fill="none"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>AI Image Denoising Icon</title>
      {/* Background grid representing noise */}
      <defs>
        <pattern
          className="opacity-30"
          height="2"
          id="noise"
          patternUnits="userSpaceOnUse"
          width="2"
        >
          <circle
            className="opacity-40"
            cx="1"
            cy="1"
            fill="currentColor"
            r="0.5"
          />
        </pattern>

        {/* Gradient for the clean image effect */}
        <linearGradient id="cleanGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Noisy background rectangle */}
      <rect
        className="opacity-50"
        fill="url(#noise)"
        height="12"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
        width="8"
        x="2"
        y="6"
      />

      {/* Clean enhanced rectangle */}
      <rect
        className="shadow-sm"
        fill="url(#cleanGradient)"
        height="12"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
        width="8"
        x="14"
        y="6"
      />

      {/* Arrow indicating transformation */}
      <path
        className="animate-pulse"
        d="M11 11 L13 12 L11 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />

      {/* Sparkle effects around clean image */}
      <circle
        className="animate-pulse opacity-70"
        cx="20"
        cy="8"
        fill="currentColor"
        r="0.8"
      />
      <circle
        className="animate-pulse opacity-60"
        cx="16"
        cy="10"
        fill="currentColor"
        r="0.6"
        style={{ animationDelay: "0.2s" }}
      />
      <circle
        className="animate-pulse opacity-80"
        cx="21"
        cy="15"
        fill="currentColor"
        r="0.7"
        style={{ animationDelay: "0.4s" }}
      />
    </svg>

    {/* Subtle glow effect */}
    <div
      className={`
        absolute inset-0 rounded-full bg-primary/20 opacity-0 blur-sm
        transition-opacity duration-300
        group-hover:opacity-50
      `}
    />
  </div>
);

export function Header(): React.ReactElement {
  const pathname = usePathname();
  const { isLoading, user } = useSupabase();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { href: "/", name: t("Nav.home") },
    { href: "/generate", name: t("Nav.generate") },
    { href: "/pricing", name: t("Nav.pricing") },
    ...(user ? [{ href: "/profile", name: t("Nav.profile") }] : []),
  ];

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
                group flex items-center gap-3 transition-all
                hover:scale-105
              `}
              href="/"
            >
              <DenoisingIcon className="h-6 w-6" />
              <span
                className={cn(
                  "text-xl font-bold transition-all",
                  `
                    bg-gradient-to-r from-primary via-primary/80 to-primary/60
                    bg-clip-text tracking-tight text-transparent
                    group-hover:from-primary/90 group-hover:to-primary/50
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

            {user && !isLoading && <DailyRewardWidget />}

            <LanguageToggle />

            {isLoading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <ThemeToggle />
            )}

            <div
              className={`
                hidden
                md:block
              `}
            >
              {user ? (
                <HeaderUserDropdown
                  isDashboard={false}
                  userEmail={user.email || ""}
                  userImage={user.user_metadata?.avatar_url}
                  userName={
                    user.user_metadata?.name || user.user_metadata?.full_name
                  }
                />
              ) : isLoading ? (
                <Skeleton className="h-10 w-32 rounded-lg" />
              ) : (
                <Link
                  href={`/auth/sign-in?redirect=${encodeURIComponent(
                    pathname
                  )}`}
                >
                  <Button
                    className={`
                      transition-all
                      hover:scale-105 hover:shadow-md
                    `}
                    size="sm"
                  >
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

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

          {!user && (
            <div className="border-b bg-background/30 px-4 py-3">
              <Link
                className={`
                  block rounded-lg bg-primary px-3 py-2 text-base font-medium
                  text-primary-foreground shadow-sm transition-all duration-200
                  hover:scale-105 hover:bg-primary/90 hover:shadow-md
                `}
                href={`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );

  return renderContent();
}
