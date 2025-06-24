import type { NextRequest } from "next/server";

// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "./lib/supabase/server";

// 创建国际化中间件
// const intlMiddleware = createIntlMiddleware({
//   defaultLocale: "en",
//   localePrefix: "never", // 重要：不在URL中显示语言前缀
//   locales: ["en", "zh"],
// });

// 需要认证的页面路径
const protectedPaths = [
  "/profile",
  "/generate", // 图像降噪页面需要登录
];

export async function middleware(req: NextRequest) {
  // 先处理国际化
  // const intlResponse = intlMiddleware(req);

  // 如果国际化中间件返回了响应（比如重定向），直接返回
  // if (intlResponse) {
  //   return intlResponse;
  // }

  const res = NextResponse.next();
  const supabase = await createSupabaseServerClient();

  // refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // 如果是受保护的路径且用户未登录
  if (isProtectedPath && !session) {
    // 构建登录URL，包含原始请求的完整路径作为重定向参数
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // 如果用户已登录且访问认证页面，重定向到仪表板
  if (session && pathname.startsWith("/auth/sign")) {
    // 检查是否有重定向参数
    const redirectTo = req.nextUrl.searchParams.get("redirect");
    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    // 否则重定向到默认页面
    return NextResponse.redirect(new URL("/generate", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
