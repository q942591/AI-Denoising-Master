import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getCurrentUser } from "~/lib/auth";
import {
  getUserCreditTransactions,
  getUserGenerations,
  getUserStats,
} from "~/lib/queries/profile";
import { getFullUser } from "~/lib/queries/users";

import ProfilePageClient from "./page.client";

export const metadata: Metadata = {
  description: "查看和管理您的个人资料、积分、生成记录和账户设置",
  title: "个人资料 - 账户中心",
};

export default async function ProfilePage() {
  // 获取当前用户，如果未登录则重定向到登录页面
  const supabaseUser = await getCurrentUser();
  if (!supabaseUser) {
    redirect("/auth/sign-in");
  }

  try {
    // 获取完整用户信息
    const user = await getFullUser(supabaseUser);

    // 并行获取用户数据
    const [stats, generations, transactions] = await Promise.all([
      getUserStats(supabaseUser.id),
      getUserGenerations(supabaseUser.id),
      getUserCreditTransactions(supabaseUser.id),
    ]);

    return (
      <ProfilePageClient
        generations={generations}
        stats={stats}
        transactions={transactions}
        user={user}
      />
    );
  } catch (error) {
    console.error("Error loading profile data:", error);
    // 如果数据加载失败，仍然渲染页面但显示错误状态
    const user = await getFullUser(supabaseUser);
    return (
      <ProfilePageClient
        error="Failed to load profile data"
        generations={[]}
        stats={{
          currentBalance: 0,
          joinDate: new Date().toISOString(),
          successfulGenerations: 0,
          totalCreditsEarned: 0,
          totalCreditsUsed: 0,
          totalGenerations: 0,
        }}
        transactions={[]}
        user={user}
      />
    );
  }
}
