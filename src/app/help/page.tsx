import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";

export default function HelpPage() {
  const t = useTranslations("Help");

  const helpCategories = [
    {
      items: [
        {
          answer: t("gettingStarted.howToUse.answer"),
          question: t("gettingStarted.howToUse.question"),
        },
        {
          answer: t("gettingStarted.fileFormats.answer"),
          question: t("gettingStarted.fileFormats.question"),
        },
        {
          answer: t("gettingStarted.processing.answer"),
          question: t("gettingStarted.processing.question"),
        },
      ],
      title: t("gettingStarted.title"),
    },
    {
      items: [
        {
          answer: t("credits.howToEarn.answer"),
          question: t("credits.howToEarn.question"),
        },
        {
          answer: t("credits.howToUse.answer"),
          question: t("credits.howToUse.question"),
        },
        {
          answer: t("credits.expiry.answer"),
          question: t("credits.expiry.question"),
        },
      ],
      title: t("credits.title"),
    },
    {
      items: [
        {
          answer: t("technical.quality.answer"),
          question: t("technical.quality.question"),
        },
        {
          answer: t("technical.speed.answer"),
          question: t("technical.speed.question"),
        },
        {
          answer: t("technical.privacy.answer"),
          question: t("technical.privacy.question"),
        },
      ],
      title: t("technical.title"),
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
        </div>

        {/* 帮助分类 */}
        <div className="space-y-8">
          {helpCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="mb-6 text-2xl font-bold">{category.title}</h2>
              <div className="grid gap-4">
                {category.items.map((item, itemIndex) => (
                  <Card key={itemIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 联系支持 */}
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
                <strong>{t("contact.email")}:</strong> support@example.com
              </p>
              <p>
                <strong>{t("contact.response")}:</strong>{" "}
                {t("contact.responseTime")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
