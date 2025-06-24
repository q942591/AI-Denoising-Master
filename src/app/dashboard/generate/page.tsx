import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { getCurrentUser } from "~/lib/auth";

import ImageDenoisePageClient from "./page.client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ImageDenoise.meta");

  return {
    description: t("description"),
    title: t("title"),
  };
}

export default async function ImageDenoisePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return <ImageDenoisePageClient />;
}
