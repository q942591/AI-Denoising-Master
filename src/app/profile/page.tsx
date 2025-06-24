import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getCurrentUser } from "~/lib/auth";
import { getFullUser } from "~/lib/queries/users";

import ProfilePageClient from "./page.client";

export const metadata: Metadata = {
  description:
    "View and manage your profile, credits, generation history and account settings",
  title: "Profile - Account Center",
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

    return <ProfilePageClient user={user} />;
  } catch (error) {
    console.error("Error loading profile data:", error);
    // 如果用户数据加载失败，仍然渲染页面但显示错误状态
    const user = await getFullUser(supabaseUser);
    return (
      <ProfilePageClient error="Failed to load profile data" user={user} />
    );
  }
}
