"use client";

import { useState } from "react";

import { STRIPE_CONFIG } from "~/lib/stripe/config";
import { Button } from "~/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/primitives/card";

export function StripeCheckout() {
  const [loading, setLoading] = useState<null | string>(null);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        body: JSON.stringify({
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
          priceId,
          successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
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
      description: "perfect for growing businesses",
      features: [
        "unlimited projects",
        "priority support",
        "advanced analytics",
      ],
      monthlyPrice: "$29",
      monthlyPriceId: STRIPE_CONFIG.prices.pro.monthly,
      name: "pro",
      popular: false,
      title: "pro plan",
      yearlyPrice: "$290",
      yearlyPriceId: STRIPE_CONFIG.prices.pro.yearly,
    },
    {
      description: "for large organizations",
      features: [
        "everything in pro",
        "custom integrations",
        "dedicated account manager",
      ],
      monthlyPrice: "$99",
      monthlyPriceId: STRIPE_CONFIG.prices.premium.monthly,
      name: "premium",
      popular: true,
      title: "premium plan",
      yearlyPrice: "$990",
      yearlyPriceId: STRIPE_CONFIG.prices.premium.yearly,
    },
  ];

  return (
    <div
      className={`
        grid gap-8
        md:grid-cols-2
      `}
    >
      {plans.map((plan) => (
        <Card
          className={`
            relative
            ${
              plan.popular
                ? "scale-105 border-primary shadow-lg"
                : "border-border"
            }
          `}
          key={plan.name}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
              <span
                className={`
                  rounded-full bg-primary px-3 py-1 text-sm font-medium
                  text-primary-foreground
                `}
              >
                most popular
              </span>
            </div>
          )}

          <CardHeader className="pb-8 text-center">
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
                className="w-full"
                disabled={loading === plan.monthlyPriceId}
                onClick={() => handleCheckout(plan.monthlyPriceId!)}
                size="lg"
                variant={plan.popular ? "primary" : "outline"}
              >
                {loading === plan.monthlyPriceId ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                        h-4 w-4 animate-spin rounded-full border-2
                        border-current border-t-transparent
                      `}
                    />
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
                <div className="text-xs font-medium text-green-600">
                  save 17%
                </div>
              </div>
              <Button
                className="w-full"
                disabled={loading === plan.yearlyPriceId}
                onClick={() => handleCheckout(plan.yearlyPriceId!)}
                size="lg"
                variant="outline"
              >
                {loading === plan.yearlyPriceId ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                        h-4 w-4 animate-spin rounded-full border-2
                        border-current border-t-transparent
                      `}
                    />
                    processing...
                  </div>
                ) : (
                  "subscribe yearly"
                )}
              </Button>
            </div>

            {/* features list */}
            <div className="border-t border-border pt-6">
              <h4 className="mb-4 text-center font-semibold">
                what's included:
              </h4>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li className="flex items-center gap-3" key={index}>
                    <div
                      className={`
                        flex h-5 w-5 flex-shrink-0 items-center justify-center
                        rounded-full bg-green-100 text-green-600
                      `}
                    >
                      <svg
                        aria-hidden="true"
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
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
