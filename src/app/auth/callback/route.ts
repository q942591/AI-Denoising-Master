import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { SYSTEM_CONFIG } from "~/app";
import { db } from "~/db";
import { userTable } from "~/db/schema";
import { createSupabaseServerClient } from "~/lib/supabase/server";

// 处理 Supabase Auth 重定向回调
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // 获取重定向路径
  const redirectPath = requestUrl.searchParams.get("redirect");

  // 如果没有授权码，重定向到登录页面
  if (!code) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 交换授权码获取会话
    const { error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      throw sessionError;
    }

    // 获取用户信息
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Failed to get user after session exchange");
    }

    // 确保用户存在于数据库中
    try {
      const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.id, user.id),
      });

      if (!existingUser) {
        // 创建新用户记录
        await db.insert(userTable).values({
          displayName:
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
          id: user.id,
          lastLoginAt: new Date(),
          preferredLocale: "en", // 默认语言，可以后续根据用户设置修改
        });
        console.log("Created new user record for:", user.id);
      } else {
        // 更新最后登录时间
        await db
          .update(userTable)
          .set({
            // 更新显示名称（如果有变化）
            displayName:
              user.user_metadata?.name ||
              user.user_metadata?.full_name ||
              existingUser.displayName,
            lastLoginAt: new Date(),
          })
          .where(eq(userTable.id, user.id));
        console.log("Updated login time for existing user:", user.id);
      }
    } catch (dbError) {
      console.error("Database error during user creation/update:", dbError);
      // 不阻止登录流程，但记录错误
    }

    // 如果有重定向路径，则使用它；否则使用系统配置的重定向地址
    const redirectUrl = redirectPath
      ? new URL(redirectPath, request.url)
      : new URL(SYSTEM_CONFIG.redirectAfterSignIn, request.url);

    // 授权成功后重定向到指定地址
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Auth callback error:", error);
    // 授权失败重定向到登录页面
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=callback_error", request.url),
    );
  }
}
