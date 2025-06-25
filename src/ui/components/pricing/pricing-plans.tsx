"use client";

import { Check, Crown, Star, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// 使用统一的数据库套餐类型
import type { CreditPackageWithFeatures } from "~/lib/queries/credit-packages";

import { cn } from "~/lib/utils";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/ui/primitives/card";

interface PricingPlan {
  badge?: string;
  credits: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  id: string;
  isPopular?: boolean;
  name: string;
  originalPrice?: number; // 原价（美分）
  price: number; // 价格（美分）
}

interface PricingPlansProps {
  className?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
  packages?: CreditPackageWithFeatures[]; // 从数据库获取的套餐数据
}

// 获取套餐图标
const getPackageIcon = (packageName: string) => {
  switch (packageName) {
    case "专业套餐":
    case "热门套餐":
      return <Crown className="h-6 w-6" />;
    case "入门套餐":
      return <Zap className="h-6 w-6" />;
    case "标准套餐":
      return <Star className="h-6 w-6" />;
    default:
      return <Zap className="h-6 w-6" />;
  }
};

// 计算原价（用于显示折扣）
const calculateOriginalPrice = (price: number, credits: number) => {
  // 假设基础价格是每100积分$10
  const basePrice = Math.ceil((credits / 100) * 1000); // 转换为美分
  return basePrice > price ? basePrice : undefined;
};

// 根据套餐名称获取默认功能列表
const getDefaultFeatures = (packageName: string): string[] => {
  switch (packageName) {
    case "专业套餐":
      return [
        "basic_credits",
        "image_processing",
        "colorization",
        "restoration",
        "enhancement",
        "super_resolution",
        "bulk_processing",
        "no_expiry",
        "priority_support",
        "api_access",
      ];
    case "入门套餐":
      return ["basic_credits", "image_processing", "colorization", "no_expiry"];
    case "标准套餐":
      return [
        "basic_credits",
        "image_processing",
        "colorization",
        "restoration",
        "no_expiry",
        "priority_support",
      ];
    case "热门套餐":
      return [
        "basic_credits",
        "image_processing",
        "colorization",
        "restoration",
        "enhancement",
        "no_expiry",
        "priority_support",
      ];
    default:
      return ["basic_credits", "image_processing"];
  }
};

// 转换数据库数据为组件所需格式
const convertDatabasePackages = (
  packages: CreditPackageWithFeatures[],
  t: any
): PricingPlan[] => {
  return packages.map((pkg) => {
    const isPopular = pkg.isPopular === true; // 修复: 与boolean类型比较
    const originalPrice = calculateOriginalPrice(pkg.price, pkg.credits);

    // 使用数据库中的features，如果没有则使用默认功能列表
    const features =
      pkg.features.length > 0 ? pkg.features : getDefaultFeatures(pkg.name);

    return {
      badge: isPopular ? t("mostPopular") : undefined,
      credits: pkg.credits,
      description: pkg.description || "",
      features: features.map((featureKey: string) => {
        if (featureKey === "basic_credits") {
          return t("features.basic_credits", { credits: pkg.credits });
        }
        return t(`features.${featureKey}`);
      }),
      icon: getPackageIcon(pkg.name),
      id: pkg.id,
      isPopular,
      name: pkg.name,
      originalPrice,
      price: pkg.price,
    };
  });
};

// 回退的硬编码数据
const getFallbackPricingPlans = (t: any): PricingPlan[] => [
  {
    credits: 100,
    description: t("basicDescription"),
    features: [
      t("features.basic_credits", { credits: 100 }),
      t("features.image_processing"),
      t("features.colorization"),
      t("features.no_expiry"),
    ],
    icon: <Zap className="h-6 w-6" />,
    id: "basic",
    name: t("basic"),
    price: 999, // $9.99
  },
  {
    badge: t("mostPopular"),
    credits: 300,
    description: t("standardDescription"),
    features: [
      t("features.basic_credits", { credits: 300 }),
      t("features.image_processing"),
      t("features.colorization"),
      t("features.restoration"),
      t("features.no_expiry"),
      t("features.priority_support"),
    ],
    icon: <Star className="h-6 w-6" />,
    id: "standard",
    isPopular: true,
    name: t("standard"),
    originalPrice: 2997, // $29.97
    price: 2499, // $24.99
  },
  {
    badge: t("bestValue"),
    credits: 600,
    description: t("popularDescription"),
    features: [
      t("features.basic_credits", { credits: 600 }),
      t("features.image_processing"),
      t("features.colorization"),
      t("features.restoration"),
      t("features.enhancement"),
      t("features.no_expiry"),
      t("features.priority_support"),
    ],
    icon: <Crown className="h-6 w-6" />,
    id: "popular",
    name: t("popular"),
    originalPrice: 5994, // $59.94
    price: 3999, // $39.99
  },
  {
    credits: 1200,
    description: t("professionalDescription"),
    features: [
      t("features.basic_credits", { credits: 1200 }),
      t("features.image_processing"),
      t("features.colorization"),
      t("features.restoration"),
      t("features.enhancement"),
      t("features.super_resolution"),
      t("features.bulk_processing"),
      t("features.no_expiry"),
      t("features.priority_support"),
      t("features.api_access"),
    ],
    icon: <Crown className="h-6 w-6" />,
    id: "professional",
    name: t("professional"),
    originalPrice: 11988, // $119.88
    price: 6999, // $69.99
  },
];

export function PricingPlans({
  className,
  onSelectPlan,
  packages,
}: PricingPlansProps) {
  const t = useTranslations("Pricing");
  const [selectedPlan, setSelectedPlan] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<null | string>(null);

  // 优先使用数据库数据，否则使用回退数据
  const pricingPlans =
    packages && packages.length > 0
      ? convertDatabasePackages(packages, t)
      : getFallbackPricingPlans(t);

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan.id);
    setIsLoading(plan.id);

    try {
      await onSelectPlan?.(plan);
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* 标题部分 */}
      <div className="mb-16 text-center">
        <h2
          className={`
            mb-6 text-4xl font-bold tracking-tight text-white
            md:text-5xl
          `}
        >
          {t("title")}
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      {/* 定价卡片网格 */}
      <div
        className={`
          grid grid-cols-1 gap-6
          md:grid-cols-2
          lg:grid-cols-4
        `}
      >
        {pricingPlans.map((plan) => {
          const discount = calculateDiscount(plan.price, plan.originalPrice);
          const isSelected = selectedPlan === plan.id;
          const loading = isLoading === plan.id;

          return (
            <Card
              className={cn(
                `
                  relative flex h-full min-h-[600px] flex-col border-gray-700
                  bg-gray-900 transition-all duration-300
                  hover:shadow-lg hover:shadow-primary/20
                `,
                plan.isPopular &&
                  `scale-105 border-blue-500 shadow-md shadow-blue-500/20`,
                isSelected && "ring-2 ring-primary"
              )}
              key={plan.id}
            >
              {/* 热门标签 */}
              {plan.badge && (
                <div
                  className={`
                    absolute -top-3 left-1/2 -translate-x-1/2 transform
                  `}
                >
                  <Badge
                    className={cn(
                      "px-3 py-1 text-xs font-medium",
                      plan.isPopular && "border-blue-500 bg-blue-600 text-white"
                    )}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="relative flex-shrink-0 p-6 text-center">
                {/* 图标 */}
                <div className="mb-4 flex justify-center">
                  <div
                    className={cn(
                      `
                        flex h-12 w-12 items-center justify-center rounded-full
                        border-2 shadow-sm transition-all duration-300
                      `,
                      plan.isPopular
                        ? `
                          border-blue-500/30 bg-blue-500/20 text-blue-400
                          shadow-blue-500/20
                        `
                        : `border-gray-600 bg-gray-800 text-gray-300`
                    )}
                  >
                    {plan.icon}
                  </div>
                </div>

                {/* 标题 */}
                <h3
                  className={cn(
                    "mb-2 text-xl font-bold tracking-tight",
                    plan.isPopular ? "text-blue-400" : "text-white"
                  )}
                >
                  {plan.name}
                </h3>

                {/* 描述 */}
                <p className="mb-4 text-sm text-gray-400">{plan.description}</p>

                {/* 价格 */}
                <div className="mb-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span
                      className={cn(
                        "text-3xl font-bold tracking-tight",
                        plan.isPopular ? "text-blue-400" : "text-white"
                      )}
                    >
                      {formatPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* 折扣标签 */}
                {discount > 0 && (
                  <div className="mb-2">
                    <span
                      className={`
                        inline-flex items-center rounded-full bg-green-100 px-2
                        py-1 text-xs font-semibold text-green-700
                        dark:bg-green-900/20 dark:text-green-400
                      `}
                    >
                      {t("discount", { percent: discount })}
                    </span>
                  </div>
                )}

                {/* 积分数量 */}
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-semibold text-white">
                    {plan.credits}
                  </span>
                  <span className="text-sm text-gray-400">{t("credits")}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 px-6 pb-4">
                {/* 功能列表 */}
                <ul className="space-y-2">
                  {plan.features
                    .slice(0, 6)
                    .map((feature: string, index: number) => (
                      <li className="flex items-start gap-2" key={index}>
                        <Check
                          className={`
                            mt-0.5 h-4 w-4 flex-shrink-0 text-green-500
                          `}
                        />
                        <span className={`text-sm text-gray-300`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  {plan.features.length > 6 && (
                    <li className="text-sm text-gray-400">
                      + {plan.features.length - 6} more features
                    </li>
                  )}
                </ul>
              </CardContent>

              <CardFooter className="flex-shrink-0">
                <Button
                  className={cn(
                    "w-full",
                    plan.isPopular
                      ? `
                        bg-blue-600 text-white
                        hover:bg-blue-700
                      `
                      : `
                        border-gray-600 bg-gray-800 text-gray-300
                        hover:bg-gray-700
                      `
                  )}
                  disabled={loading}
                  onClick={() => handleSelectPlan(plan)}
                  size="lg"
                  variant={plan.isPopular ? "primary" : "outline"}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                          h-4 w-4 animate-spin rounded-full border-2
                          border-current border-t-transparent
                        `}
                      />
                      {t("payment.processing")}
                    </div>
                  ) : (
                    t("selectPlan")
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div className="mt-12 text-center">
        <div className="mx-auto max-w-4xl rounded-lg bg-muted/50 p-6">
          <h4 className="mb-3 font-semibold">{t("usageInstructions.title")}</h4>
          <div
            className={`
              grid grid-cols-1 gap-4 text-sm text-muted-foreground
              md:grid-cols-4
            `}
          >
            <div>{t("usageInstructions.step1")}</div>
            <div>{t("usageInstructions.step2")}</div>
            <div>{t("usageInstructions.step3")}</div>
            <div>{t("usageInstructions.step4")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { PricingPlan };
