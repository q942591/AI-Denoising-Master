import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/ui/primitives/accordion";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";

export default function FAQPage() {
  const t = useTranslations("FAQ");

  const faqCategories = [
    {
      items: [
        {
          answer: t("general.what.answer"),
          question: t("general.what.question"),
        },
        {
          answer: t("general.how.answer"),
          question: t("general.how.question"),
        },
        {
          answer: t("general.formats.answer"),
          question: t("general.formats.question"),
        },
        {
          answer: t("general.quality.answer"),
          question: t("general.quality.question"),
        },
      ],
      title: t("general.title"),
    },
    {
      items: [
        {
          answer: t("credits.what.answer"),
          question: t("credits.what.question"),
        },
        {
          answer: t("credits.how.answer"),
          question: t("credits.how.question"),
        },
        {
          answer: t("credits.cost.answer"),
          question: t("credits.cost.question"),
        },
        {
          answer: t("credits.expiry.answer"),
          question: t("credits.expiry.question"),
        },
        {
          answer: t("credits.refund.answer"),
          question: t("credits.refund.question"),
        },
      ],
      title: t("credits.title"),
    },
    {
      items: [
        {
          answer: t("technical.time.answer"),
          question: t("technical.time.question"),
        },
        {
          answer: t("technical.size.answer"),
          question: t("technical.size.question"),
        },
        {
          answer: t("technical.privacy.answer"),
          question: t("technical.privacy.question"),
        },
        {
          answer: t("technical.api.answer"),
          question: t("technical.api.question"),
        },
      ],
      title: t("technical.title"),
    },
    {
      items: [
        {
          answer: t("account.create.answer"),
          question: t("account.create.question"),
        },
        {
          answer: t("account.login.answer"),
          question: t("account.login.question"),
        },
        {
          answer: t("account.reset.answer"),
          question: t("account.reset.question"),
        },
        {
          answer: t("account.delete.answer"),
          question: t("account.delete.question"),
        },
      ],
      title: t("account.title"),
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

        {/* FAQ 分类 */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`${categoryIndex}-${itemIndex}`}
                    >
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="leading-relaxed text-muted-foreground">
                          {item.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 联系支持 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t("contact.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              {t("contact.description")}
            </p>
            <div
              className={`
                flex flex-col gap-4
                sm:flex-row
              `}
            >
              <Button asChild>
                <a href="/contact">{t("contact.button")}</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/help">{t("contact.help")}</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
