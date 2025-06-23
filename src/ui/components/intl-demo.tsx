"use client";

import { useTranslations } from "next-intl";

import { LanguageToggle } from "~/ui/components/language-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";

export function IntlDemo() {
  const t = useTranslations();

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* 语言切换器 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">国际化演示</h2>
        <LanguageToggle />
      </div>

      {/* 认证相关翻译 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("Auth.signIn")} & {t("Auth.signUp")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>• {t("Auth.emailAddress")}</p>
          <p>• {t("Auth.password")}</p>
          <p>• {t("Auth.forgotPassword")}</p>
          <p>• {t("Auth.signInDescription")}</p>
        </CardContent>
      </Card>

      {/* 导航相关翻译 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Nav.dashboard")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>• {t("Nav.home")}</p>
          <p>• {t("Nav.products")}</p>
          <p>• {t("Nav.profile")}</p>
          <p>• {t("Nav.settings")}</p>
        </CardContent>
      </Card>

      {/* 通用操作翻译 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Common.loading")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>• {t("Common.save")}</p>
          <p>• {t("Common.cancel")}</p>
          <p>• {t("Common.delete")}</p>
          <p>• {t("Common.edit")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
