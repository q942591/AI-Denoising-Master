import { Mail, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";
import { Textarea } from "~/ui/primitives/textarea";

export default function ContactPage() {
  const t = useTranslations("Contact");

  const contactMethods = [
    {
      contact: "support@example.com",
      description: t("methods.email.description"),
      icon: <Mail className="h-6 w-6" />,
      response: t("methods.email.response"),
      title: t("methods.email.title"),
    },
    {
      contact: t("methods.chat.available"),
      description: t("methods.chat.description"),
      icon: <MessageCircle className="h-6 w-6" />,
      response: t("methods.chat.response"),
      title: t("methods.chat.title"),
    },
    {
      contact: "+1 (555) 123-4567",
      description: t("methods.phone.description"),
      icon: <Phone className="h-6 w-6" />,
      response: t("methods.phone.response"),
      title: t("methods.phone.title"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-16">
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

        <div
          className={`
          grid gap-12
          lg:grid-cols-2
        `}
        >
          {/* 联系方式 */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">{t("methods.title")}</h2>
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className={`
                        flex h-10 w-10 items-center justify-center rounded-full
                        bg-primary/10 text-primary
                      `}
                      >
                        {method.icon}
                      </div>
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-muted-foreground">
                      {method.description}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>{t("methods.contact")}:</strong>{" "}
                        {method.contact}
                      </p>
                      <p>
                        <strong>{t("methods.responseTime")}:</strong>{" "}
                        {method.response}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 联系表单 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("form.title")}</CardTitle>
                <p className="text-muted-foreground">{t("form.description")}</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div
                    className={`
                    grid gap-4
                    sm:grid-cols-2
                  `}
                  >
                    <div>
                      <Label htmlFor="name">{t("form.name")}</Label>
                      <Input
                        id="name"
                        placeholder={t("form.namePlaceholder")}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("form.email")}</Label>
                      <Input
                        id="email"
                        placeholder={t("form.emailPlaceholder")}
                        required
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">{t("form.subject")}</Label>
                    <Input
                      id="subject"
                      placeholder={t("form.subjectPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">{t("form.message")}</Label>
                    <Textarea
                      className="min-h-32"
                      id="message"
                      placeholder={t("form.messagePlaceholder")}
                      required
                    />
                  </div>
                  <Button className="w-full" size="lg" type="submit">
                    {t("form.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ 快速链接 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t("faq.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">{t("faq.description")}</p>
            <Button asChild variant="outline">
              <a href="/faq">{t("faq.link")}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
