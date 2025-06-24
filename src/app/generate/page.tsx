import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { getCurrentSupabaseUserOrRedirect } from "~/lib/supabase/supabase-auth";

import ImageDenoisePageClient from "./page.client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ImageDenoise.meta");

  return {
    description: t("description"),
    title: t("title"),
  };
}

export default async function ImageDenoisePage() {
  // 确保用户已登录，如果未登录会自动重定向到登录页面
  await getCurrentSupabaseUserOrRedirect();

  return <ImageDenoisePageClient />;
}
