"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// todo: replace with actual reui component imports
// import { Button } from "~/ui/reui/button";
// import { Card } from "~/ui/reui/card";

// 临时保留 shadcn/ui 组件，后续替换为 reui
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";
import { STRIPE_CONFIG } from "~/lib/stripe/config";

interface StripeCheckoutProps {
  userId: string;
}

export function StripeCheckout({ userId }: StripeCheckoutProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/dashboard/billing?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error("failed to create checkout session");
      }

      const { url } = (await response.json()) as { url: string };

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("error creating checkout session:", error);
      alert("failed to start checkout. please try again.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "pro",
      title: "pro plan",
      description: "perfect for growing businesses",
      monthlyPrice: "$29",
      monthlyPriceId: STRIPE_CONFIG.prices.pro.monthly,
      yearlyPrice: "$290",
      yearlyPriceId: STRIPE_CONFIG.prices.pro.yearly,
      features: [
        "unlimited projects",
        "priority support",
        "advanced analytics",
      ],
      popular: false,
    },
    {
      name: "premium",
      title: "premium plan",
      description: "for large organizations",
      monthlyPrice: "$99",
      monthlyPriceId: STRIPE_CONFIG.prices.premium.monthly,
      yearlyPrice: "$990",
      yearlyPriceId: STRIPE_CONFIG.prices.premium.yearly,
      features: [
        "everything in pro",
        "custom integrations",
        "dedicated account manager",
      ],
      popular: true,
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative ${
            plan.popular
              ? "border-primary shadow-lg scale-105"
              : "border-border"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                most popular
              </span>
            </div>
          )}

          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* monthly pricing */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{plan.monthlyPrice}</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <Button
                size="lg"
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleCheckout(plan.monthlyPriceId!)}
                disabled={loading === plan.monthlyPriceId}
              >
                {loading === plan.monthlyPriceId ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    processing...
                  </div>
                ) : (
                  "subscribe monthly"
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {/* yearly pricing */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{plan.yearlyPrice}</div>
                <div className="text-sm text-muted-foreground">per year</div>
                <div className="text-xs text-green-600 font-medium">
                  save 17%
                </div>
              </div>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => handleCheckout(plan.yearlyPriceId!)}
                disabled={loading === plan.yearlyPriceId}
              >
                {loading === plan.yearlyPriceId ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    processing...
                  </div>
                ) : (
                  "subscribe yearly"
                )}
              </Button>
            </div>

            {/* features list */}
            <div className="pt-6 border-t border-border">
              <h4 className="font-semibold mb-4 text-center">
                what's included:
              </h4>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
