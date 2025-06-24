import type { NextRequest } from "next/server";

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

// 创建国际化中间件
const intlMiddleware = createIntlMiddleware({
  defaultLocale: "en",
  localePrefix: "never", // 重要：不在URL中显示语言前缀
  locales: ["en", "zh"],
});

export async function middleware(req: NextRequest) {
  // 先处理国际化
  const intlResponse = intlMiddleware(req);

  // 如果国际化中间件返回了响应（比如重定向），直接返回
  if (intlResponse) {
    return intlResponse;
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
