import type { Metadata } from "next";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";

import { SEO_CONFIG } from "~/app";
import "~/css/globals.css";
import { IntlProvider } from "~/components/providers/intl-provider";
import { NotificationsProvider } from "~/components/providers/notifications-provider";
import { StagewiseProvider } from "~/components/providers/stagewise-provider";
import { SupabaseProvider } from "~/components/providers/SupabaseProvider";
import { Footer } from "~/ui/components/footer";
import { Header } from "~/ui/components/header/header";
import { ThemeProvider } from "~/ui/components/theme-provider";
import { Toaster } from "~/ui/primitives/sonner";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Relivator",
  },
  description: `${SEO_CONFIG.description}`,
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { sizes: "any", url: "/favicon.ico" },
      { type: "image/svg+xml", url: "/favicon.svg" },
      { sizes: "16x16", type: "image/png", url: "/favicon-16x16.png" },
      { sizes: "32x32", type: "image/png", url: "/favicon-32x32.png" },
    ],
    other: [
      {
        color: "#3b82f6",
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#3b82f6",
  },
  themeColor: [
    { color: "#3b82f6", media: "(prefers-color-scheme: light)" },
    { color: "#1e40af", media: "(prefers-color-scheme: dark)" },
  ],
  title: `${SEO_CONFIG.fullName}`,
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen bg-gradient-to-br from-white to-slate-100
          text-neutral-900 antialiased
          selection:bg-primary/80
          dark:from-neutral-950 dark:to-neutral-900 dark:text-neutral-100
        `}
      >
        <IntlProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
          >
            <SupabaseProvider>
              <NotificationsProvider>
                <Header />
                <main className={`flex min-h-screen flex-col`}>{children}</main>
                <Footer />
                <Toaster />
              </NotificationsProvider>
            </SupabaseProvider>
          </ThemeProvider>
        </IntlProvider>
        <SpeedInsights />
        <StagewiseProvider />
      </body>
    </html>
  );
}
