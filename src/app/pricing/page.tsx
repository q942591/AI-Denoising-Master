import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { PricingPageClient } from "./page.client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pricing.meta");

  return {
    description: t("description"),
    title: t("title"),
  };
}

export default function PricingPage() {
  return <PricingPageClient />;
}
