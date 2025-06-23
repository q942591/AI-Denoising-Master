"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <Card key={plan.name}>
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>monthly</span>
                <span className="font-bold">{plan.monthlyPrice}/month</span>
              </div>
              <Button
                className="w-full"
                onClick={() => handleCheckout(plan.monthlyPriceId!)}
                disabled={loading === plan.monthlyPriceId}
              >
                {loading === plan.monthlyPriceId
                  ? "loading..."
                  : "subscribe monthly"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>yearly</span>
                <span className="font-bold">{plan.yearlyPrice}/year</span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleCheckout(plan.yearlyPriceId!)}
                disabled={loading === plan.yearlyPriceId}
              >
                {loading === plan.yearlyPriceId
                  ? "loading..."
                  : "subscribe yearly"}
              </Button>
            </div>

            <div className="pt-4">
              <h4 className="font-medium mb-2">features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
