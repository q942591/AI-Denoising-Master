"use client";

import { CreditCard, Image as ImageIcon, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { User } from "~/db/schema/users/types";

import { Card, CardContent, CardHeader } from "~/ui/primitives/card";
import { Tabs, TabsList, TabsTrigger } from "~/ui/primitives/tabs";

import {
  ProfileBillingTab,
  ProfileGalleryTab,
  ProfileSettingsTab,
  ProfileStatsCard,
} from "./components";

interface ProfilePageClientProps {
  error?: string;
  user: User;
}

export default function ProfilePageClient({
  error,
  user,
}: ProfilePageClientProps) {
  const t = useTranslations("Profile");
  const [activeTab, setActiveTab] = useState("gallery");

  // 获取用户显示名称
  const displayName =
    user.profile?.displayName ||
    user.name ||
    user.email?.split("@")[0] ||
    "用户";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("welcome", { name: displayName })}
        </p>
      </div>

      {/* 统计数据卡片 */}
      <div className="mb-8">
        <ProfileStatsCard user={user} />
      </div>

      {/* 标签页内容 */}
      <Card>
        <Tabs onValueChange={setActiveTab} value={activeTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                className="flex items-center space-x-2"
                value="gallery"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{t("tabs.gallery")}</span>
              </TabsTrigger>
              <TabsTrigger
                className="flex items-center space-x-2"
                value="billing"
              >
                <CreditCard className="h-4 w-4" />
                <span>{t("tabs.billing")}</span>
              </TabsTrigger>
              <TabsTrigger
                className="flex items-center space-x-2"
                value="settings"
              >
                <Settings className="h-4 w-4" />
                <span>{t("tabs.settings")}</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <ProfileGalleryTab />
            <ProfileBillingTab />
            <ProfileSettingsTab user={user} />
          </CardContent>
        </Tabs>
      </Card>

      {error && (
        <Card className="mt-8 border-destructive">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              ⚠️ 数据加载出现问题: {error}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
