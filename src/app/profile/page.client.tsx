"use client";

import {
  Calendar,
  CreditCard,
  Download,
  Image as ImageIcon,
  Settings,
  Sparkles,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { CreditTransaction, UserGenerateRecord } from "~/db/schema";
import type { User } from "~/db/schema/users/types";
import type { UserStats } from "~/lib/queries/profile";

import { Avatar, AvatarFallback, AvatarImage } from "~/ui/primitives/avatar";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Image } from "~/ui/primitives/image";
import { Separator } from "~/ui/primitives/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/primitives/tabs";

interface ProfilePageClientProps {
  error?: string;
  generations: UserGenerateRecord[];
  stats: UserStats;
  transactions: CreditTransaction[];
  user: User;
}

export default function ProfilePageClient({
  error,
  generations,
  stats,
  transactions,
  user,
}: ProfilePageClientProps) {
  const t = useTranslations("Profile");
  const [activeTab, setActiveTab] = useState("gallery");

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN");
  };

  // 获取用户显示名称
  const displayName =
    user.profile?.displayName ||
    user.name ||
    user.email?.split("@")[0] ||
    "用户";

  // 获取用户头像首字母
  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("welcome", { name: displayName })}
        </p>
      </div>

      {/* 用户信息和统计卡片 */}
      <div
        className={`
        mb-8 grid gap-6
        md:grid-cols-2
        lg:grid-cols-4
      `}
      >
        {/* 用户信息卡片 */}
        <Card className="md:col-span-2">
          <CardContent className="flex items-center space-x-4 p-6">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={displayName} src={user.image} />
              <AvatarFallback className="text-lg">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.profile?.bio && (
                <p className="mt-1 text-sm">{user.profile.bio}</p>
              )}
              <div
                className={`
                mt-2 flex items-center text-xs text-muted-foreground
              `}
              >
                <Calendar className="mr-1 h-3 w-3" />
                {t("stats.memberSince")} {formatDate(stats.joinDate)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 积分余额卡片 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("stats.currentBalance")}
              </span>
            </div>
            <p className="text-2xl font-bold">{stats.currentBalance}</p>
          </CardContent>
        </Card>

        {/* 生成统计卡片 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("stats.totalGenerations")}
              </span>
            </div>
            <p className="text-2xl font-bold">{stats.totalGenerations}</p>
            <p className="text-xs text-muted-foreground">
              {t("stats.successfulGenerations")}: {stats.successfulGenerations}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细统计卡片 */}
      <div
        className={`
        mb-8 grid gap-6
        md:grid-cols-2
      `}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{t("stats.creditsEarned")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              +{stats.totalCreditsEarned}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{t("stats.creditsUsed")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              -{stats.totalCreditsUsed}
            </p>
          </CardContent>
        </Card>
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
            {/* 画廊标签页 */}
            <TabsContent className="space-y-6" value="gallery">
              <div>
                <h3 className="text-lg font-semibold">{t("gallery.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("gallery.subtitle")}
                </p>
              </div>

              {generations.length === 0 ? (
                <div
                  className={`
                  flex flex-col items-center justify-center py-12 text-center
                `}
                >
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <h4 className="mt-4 text-lg font-medium">
                    {t("gallery.empty")}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("gallery.emptyDescription")}
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/generate">{t("gallery.startCreating")}</a>
                  </Button>
                </div>
              ) : (
                <div
                  className={`
                  grid gap-4
                  md:grid-cols-2
                  lg:grid-cols-3
                `}
                >
                  {generations.map((generation) => (
                    <Card className="overflow-hidden" key={generation.id}>
                      <div className="aspect-square">
                        {generation.outputUrl && (
                          <Image
                            alt={`Generated image - ${generation.type}`}
                            className="h-full w-full object-cover"
                            height={300}
                            src={generation.outputUrl}
                            width={300}
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {t(`gallery.generation.types.${generation.type}`)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            -{generation.creditConsumed} 积分
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatDateTime(generation.createdAt.toISOString())}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <Button
                            className="flex-1"
                            size="sm"
                            variant="secondary"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            {t("gallery.generation.download")}
                          </Button>
                          {generation.inputUrl && (
                            <Button size="sm" variant="secondary">
                              {t("gallery.generation.viewOriginal")}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 账单标签页 */}
            <TabsContent className="space-y-6" value="billing">
              <div>
                <h3 className="text-lg font-semibold">{t("billing.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("billing.subtitle")}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{t("billing.balance")}</span>
                  <Badge className="text-lg" variant="secondary">
                    {stats.currentBalance}
                  </Badge>
                </div>
                <Button asChild>
                  <a href="/pricing">{t("billing.recharge")}</a>
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium">{t("billing.transactions")}</h4>

                {transactions.length === 0 ? (
                  <div
                    className={`
                    flex flex-col items-center justify-center py-12 text-center
                  `}
                  >
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                    <h4 className="mt-4 text-lg font-medium">
                      {t("billing.empty")}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("billing.emptyDescription")}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {transactions.map((transaction) => (
                      <Card key={transaction.id}>
                        <CardContent
                          className={`
                          flex items-center justify-between p-4
                        `}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  transaction.type === "consumption"
                                    ? "destructive"
                                    : "primary"
                                }
                              >
                                {t(
                                  `billing.transaction.types.${transaction.type}`
                                )}
                              </Badge>
                              <Badge variant="secondary">
                                {t(
                                  `billing.transaction.statuses.${transaction.status}`
                                )}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(
                                transaction.createdAt.toISOString()
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`
                                font-semibold
                                ${
                                  transaction.amount > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              `}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              余额: {transaction.balanceAfter}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 设置标签页 */}
            <TabsContent className="space-y-6" value="settings">
              <div>
                <h3 className="text-lg font-semibold">{t("settings.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.subtitle")}
                </p>
              </div>

              {/* 个人信息设置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5" />
                    <span>{t("settings.profile.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">
                      {t("settings.profile.displayName")}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {displayName}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {t("settings.profile.email")}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("settings.profile.emailNote")}
                    </p>
                  </div>
                  {user.profile?.bio && (
                    <div>
                      <div className="text-sm font-medium">
                        {t("settings.profile.bio")}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.profile.bio}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 偏好设置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>{t("settings.preferences.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">
                      {t("settings.preferences.language")}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.profile?.preferredLocale === "zh"
                        ? "简体中文"
                        : "English"}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {t("settings.preferences.theme")}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(
                        `settings.preferences.themes.${
                          user.profile?.theme || "system"
                        }`
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 密码和账户管理 */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.password.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    密码管理功能正在开发中...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
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
