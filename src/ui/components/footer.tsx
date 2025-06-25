import { Github, Mail, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { SEO_CONFIG } from "~/app";
import { cn } from "~/lib/cn";

export function Footer({ className }: { className?: string }) {
  const t = useTranslations("Footer");

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div
        className={`
          container mx-auto max-w-7xl px-4 py-12
          sm:px-6
          lg:px-8
        `}
      >
        <div
          className={`
            grid grid-cols-1 gap-8
            md:grid-cols-4
          `}
        >
          {/* 品牌信息 */}
          <div className="space-y-4">
            <Link className="flex items-center gap-2" href="/">
              <span
                className={`
                  bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                  text-xl font-bold tracking-tight text-transparent
                `}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {SEO_CONFIG.description}
            </p>
            {/* 社交媒体链接 */}
            <div className="flex items-center gap-4">
              <Link
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full bg-muted
                  transition-colors
                  hover:bg-primary hover:text-primary-foreground
                `}
                href="https://twitter.com"
                target="_blank"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full bg-muted
                  transition-colors
                  hover:bg-primary hover:text-primary-foreground
                `}
                href="mailto:support@example.com"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 产品功能 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("product.title")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/generate"
                >
                  {t("product.imageDenoising")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/generate"
                >
                  {t("product.superResolution")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/pricing"
                >
                  {t("product.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/image-demo"
                >
                  {t("product.examples")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持与帮助 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("support.title")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/help"
                >
                  {t("support.helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/contact"
                >
                  {t("support.contact")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/faq"
                >
                  {t("support.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 法律信息 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("legal.title")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/privacy"
                >
                  {t("legal.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  className={`
                    text-muted-foreground transition-colors
                    hover:text-foreground
                  `}
                  href="/terms"
                >
                  {t("legal.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="mt-12 border-t pt-8">
          <div
            className={`
              flex flex-col items-center justify-between gap-4
              md:flex-row
            `}
          >
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {SEO_CONFIG.name}.{" "}
              {t("copyright")}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-muted-foreground">
                {t("madeWith")} ❤️ {t("by")} {SEO_CONFIG.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
