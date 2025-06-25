"use client";

import { useTranslations } from "next-intl";

import { ImageComparisonSlider } from "~/ui/components/image-comparison-slider";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";

export default function ExamplesPage() {
  const t = useTranslations("Examples");

  // 静态示例数据
  const examples = [
    {
      afterImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=95",
      beforeImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=30",
      credits: 3,
      date: "2024-01-15",
      description: t("examples.portrait.description"),
      id: 1,
      improvement: "92%",
      processTime: "2.1s",
      type: t("examples.portrait.title"),
    },
    {
      afterImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=95",
      beforeImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=25",
      credits: 4,
      date: "2024-01-14",
      description: t("examples.landscape.description"),
      id: 2,
      improvement: "89%",
      processTime: "1.8s",
      type: t("examples.landscape.title"),
    },
    {
      afterImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop&auto=format&q=90",
      beforeImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&auto=format&q=20",
      credits: 5,
      date: "2024-01-13",
      description: t("examples.indoor.description"),
      id: 3,
      improvement: "95%",
      processTime: "2.5s",
      type: t("examples.indoor.title"),
    },
    {
      afterImage:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop&auto=format&q=85",
      beforeImage:
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=225&fit=crop&auto=format&q=15&blur=3&sepia=100",
      credits: 4,
      date: "2024-01-12",
      description: t("examples.old.description"),
      id: 4,
      improvement: "88%",
      processTime: "3.2s",
      type: t("examples.old.title"),
    },
    {
      afterImage:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=600&fit=crop&auto=format&q=95",
      beforeImage:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop&auto=format&q=25",
      credits: 2,
      date: "2024-01-11",
      description: t("examples.document.description"),
      id: 5,
      improvement: "91%",
      processTime: "1.5s",
      type: t("examples.document.title"),
    },
    {
      afterImage:
        "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&h=600&fit=crop&auto=format&q=90",
      beforeImage:
        "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=400&h=300&fit=crop&auto=format&q=20",
      credits: 3,
      date: "2024-01-10",
      description: t("examples.product.description"),
      id: 6,
      improvement: "93%",
      processTime: "2.0s",
      type: t("examples.product.title"),
    },
  ];

  return (
    <div
      className={`
        min-h-screen bg-gradient-to-br from-background via-background
        to-background/80
      `}
    >
      <div className="container mx-auto px-4 py-12">
        {/* 页面头部 */}
        <div className="mb-16 text-center">
          <h1
            className={`
              mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500
              bg-clip-text text-4xl font-bold text-transparent
              md:text-5xl
            `}
          >
            {t("title")}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* 统计数据 */}
        <div
          className={`
            mb-16 grid grid-cols-1 gap-6
            md:grid-cols-3
          `}
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-2 text-3xl font-bold text-primary">
                12,500+
              </div>
              <div className="text-muted-foreground">
                {t("stats.processed")}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-2 text-3xl font-bold text-primary">2.1s</div>
              <div className="text-muted-foreground">{t("stats.avgTime")}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-2 text-3xl font-bold text-primary">91%</div>
              <div className="text-muted-foreground">
                {t("stats.avgImprovement")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 示例网格 */}
        <div
          className={`
            mb-16 grid grid-cols-1 gap-8
            md:grid-cols-2
          `}
        >
          {examples.map((example) => (
            <Card
              className={`
                group overflow-hidden border-0 bg-card/50 transition-all
                duration-300
                hover:shadow-lg hover:shadow-primary/5
              `}
              key={example.id}
            >
              {/* 图像对比滑动组件 */}
              <ImageComparisonSlider
                afterAlt={t("comparison.afterAlt")}
                afterImage={example.afterImage}
                afterLabel={t("comparison.after")}
                beforeAlt={t("comparison.beforeAlt")}
                beforeImage={example.beforeImage}
                beforeLabel={t("comparison.before")}
                className={`
                  h-72
                  md:h-80
                  lg:h-96
                `}
                dragToCompareText={t("comparison.dragToCompare")}
                improvement={example.improvement}
              />
            </Card>
          ))}
        </div>

        {/* CTA 部分 */}
        <Card
          className={`
            border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5
            to-pink-500/5 text-center
          `}
        >
          <CardContent className="py-12">
            <h2
              className={`
                mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500
                bg-clip-text text-3xl font-bold text-transparent
              `}
            >
              {t("cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {t("cta.description")}
            </p>
            <div
              className={`
                flex flex-col justify-center gap-4
                sm:flex-row
              `}
            >
              <Button className="min-w-32" size="lg">
                {t("cta.try")}
              </Button>
              <Button className="min-w-32" size="lg" variant="outline">
                {t("cta.pricing")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
