"use client";

import { Settings, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { User } from "~/db/schema/users/types";

import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { TabsContent } from "~/ui/primitives/tabs";

interface ProfileSettingsTabProps {
  user: User;
}

export function ProfileSettingsTab({ user }: ProfileSettingsTabProps) {
  const t = useTranslations("Profile");

  // 获取用户显示名称
  const displayName =
    user.profile?.displayName ||
    user.name ||
    user.email?.split("@")[0] ||
    "用户";

  return (
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
            <p className="mt-1 text-sm text-muted-foreground">{displayName}</p>
          </div>
          <div>
            <div className="text-sm font-medium">
              {t("settings.profile.email")}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
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
              {user.profile?.preferredLocale === "zh" ? "简体中文" : "English"}
            </p>
          </div>
          <div>
            <div className="text-sm font-medium">
              {t("settings.preferences.theme")}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                `settings.preferences.themes.${user.profile?.theme || "system"}`
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
  );
}
