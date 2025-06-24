import { SYSTEM_CONFIG } from "~/app";
import { getCurrentSupabaseUserOrRedirect } from "~/lib/supabase/supabase-auth";

import { SignInPageClient } from "./page.client";

interface PageProps {
  searchParams: { redirect?: string };
}

export default async function SignInPage({ searchParams }: PageProps) {
  const user = await getCurrentSupabaseUserOrRedirect(
    undefined,
    undefined, // 不要在这里重定向，让客户端组件处理
    true // 忽略认证检查，因为这是登录页面
  );

  // 如果用户已登录，重定向到指定页面或默认页面
  if (user) {
    const redirectTo =
      searchParams.redirect || SYSTEM_CONFIG.redirectAfterSignIn;
    // 这里需要使用 redirect 函数进行服务端重定向
    const { redirect } = await import("next/navigation");
    redirect(redirectTo);
  }

  return <SignInPageClient />;
}
