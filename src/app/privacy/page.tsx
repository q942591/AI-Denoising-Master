import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  const sections = [
    {
      content: t("collection.content"),
      title: t("collection.title"),
    },
    {
      content: t("usage.content"),
      title: t("usage.title"),
    },
    {
      content: t("sharing.content"),
      title: t("sharing.title"),
    },
    {
      content: t("storage.content"),
      title: t("storage.title"),
    },
    {
      content: t("security.content"),
      title: t("security.title"),
    },
    {
      content: t("rights.content"),
      title: t("rights.title"),
    },
    {
      content: t("cookies.content"),
      title: t("cookies.title"),
    },
    {
      content: t("changes.content"),
      title: t("changes.title"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* 页面标题 */}
        <div className="mb-12 text-center">
          <h1
            className={`
            mb-4 text-4xl font-bold tracking-tight
            md:text-5xl
          `}
          >
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("lastUpdated")}: {t("date")}
          </p>
        </div>

        {/* 隐私政策内容 */}
        <div className="space-y-8">
          {/* 简介 */}
          <Card>
            <CardContent className="pt-6">
              <p className="leading-relaxed text-muted-foreground">
                {t("introduction")}
              </p>
            </CardContent>
          </Card>

          {/* 政策章节 */}
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 leading-relaxed text-muted-foreground">
                  {section.content.split("\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 联系信息 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t("contact.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              {t("contact.description")}
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>{t("contact.email")}:</strong> privacy@example.com
              </p>
              <p>
                <strong>{t("contact.address")}:</strong>{" "}
                {t("contact.addressText")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
