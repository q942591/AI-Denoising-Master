"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { PaymentForm } from "~/ui/components/payments/payment-form";
import {
  type PricingPlan,
  PricingPlans,
} from "~/ui/components/pricing/pricing-plans";
import { Button } from "~/ui/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/ui/primitives/dialog";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function PricingPageClient() {
  const t = useTranslations("Pricing");
  const router = useRouter();
  const { user } = useSupabase();
  const [selectedPlan, setSelectedPlan] = useState<null | PricingPlan>(null);
  const [clientSecret, setClientSecret] = useState<null | string>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const handleSelectPlan = async (plan: PricingPlan) => {
    // 检查用户是否已登录
    if (!user) {
      toast.error(t("payment.loginRequired"));
      router.push("/auth/sign-in");
      return;
    }

    setSelectedPlan(plan);
    setIsCreatingPayment(true);

    try {
      // Create payment intent
      const response = await fetch("/api/credits/recharge", {
        body: JSON.stringify({
          credits: plan.credits,
          currency: "usd",
          packageName: plan.name,
          price: plan.price,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(t("payment.failed"));
      }

      const data: any = await response.json();
      setClientSecret(data.clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error("Payment creation failed:", error);
      toast.error(t("payment.error"));
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success(t("payment.success"));
    setIsPaymentModalOpen(false);
    setClientSecret(null);
    setSelectedPlan(null);
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setClientSecret(null);
    setSelectedPlan(null);
  };

  const stripeOptions = {
    appearance: {
      theme: "stripe" as const,
      variables: {
        borderRadius: "8px",
        colorBackground: "hsl(var(--background))",
        colorDanger: "hsl(var(--destructive))",
        colorPrimary: "hsl(var(--primary))",
        colorText: "hsl(var(--foreground))",
        fontFamily: "var(--font-sans)",
        spacingUnit: "4px",
      },
    },
    clientSecret: clientSecret || undefined,
  };

  return (
    <div
      className={`
        min-h-screen bg-gradient-to-br from-background via-background
        to-primary/5
      `}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Page title */}
        <div className="mb-20 text-center">
          <div
            className={`
              mb-8 duration-700 animate-in fade-in-0 slide-in-from-bottom-4
            `}
          >
            <h1
              className={`
                mb-6 bg-gradient-to-r from-foreground via-foreground
                to-primary/80 bg-clip-text text-4xl font-bold tracking-tight
                text-transparent
                md:text-6xl
              `}
            >
              {t("page.title")}
            </h1>
            <div
              className={`
                mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary
                to-primary/60
              `}
            />
          </div>
          <p
            className={`
              mx-auto max-w-3xl text-xl text-muted-foreground duration-700
              animate-in fade-in-0 slide-in-from-bottom-4
              [animation-delay:200ms]
              [animation-fill-mode:both]
            `}
          >
            {t("page.subtitle")}
          </p>
        </div>

        {/* Pricing plans */}
        <div
          className={`
            duration-700 animate-in fade-in-0 slide-in-from-bottom-4
            [animation-delay:400ms]
            [animation-fill-mode:both]
          `}
        >
          <PricingPlans className="mb-20" onSelectPlan={handleSelectPlan} />
        </div>

        {/* FAQ */}
        <div
          className={`
            mx-auto max-w-5xl duration-700 animate-in fade-in-0
            slide-in-from-bottom-4
            [animation-delay:600ms]
            [animation-fill-mode:both]
          `}
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">{t("faq.title")}</h2>
            <div
              className={`
                mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary
                to-primary/60
              `}
            />
          </div>
          <div
            className={`
              grid grid-cols-1 gap-6
              md:grid-cols-2
              lg:grid-cols-3
            `}
          >
            <div
              className={`
                group rounded-xl bg-gradient-to-br from-card to-card/50 p-6
                shadow-sm transition-all duration-300
                hover:shadow-lg hover:shadow-primary/10
              `}
            >
              <h3
                className={`
                  mb-3 font-semibold text-primary transition-colors
                  group-hover:text-primary/80
                `}
              >
                {t("faq.howToUse.question")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("faq.howToUse.answer")}
              </p>
            </div>
            <div
              className={`
                group rounded-xl bg-gradient-to-br from-card to-card/50 p-6
                shadow-sm transition-all duration-300
                hover:shadow-lg hover:shadow-primary/10
              `}
            >
              <h3
                className={`
                  mb-3 font-semibold text-primary transition-colors
                  group-hover:text-primary/80
                `}
              >
                {t("faq.expiry.question")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("faq.expiry.answer")}
              </p>
            </div>
            <div
              className={`
                group rounded-xl bg-gradient-to-br from-card to-card/50 p-6
                shadow-sm transition-all duration-300
                hover:shadow-lg hover:shadow-primary/10
              `}
            >
              <h3
                className={`
                  mb-3 font-semibold text-primary transition-colors
                  group-hover:text-primary/80
                `}
              >
                {t("faq.paymentMethods.question")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("faq.paymentMethods.answer")}
              </p>
            </div>
            <div
              className={`
                group rounded-xl bg-gradient-to-br from-card to-card/50 p-6
                shadow-sm transition-all duration-300
                hover:shadow-lg hover:shadow-primary/10
              `}
            >
              <h3
                className={`
                  mb-3 font-semibold text-primary transition-colors
                  group-hover:text-primary/80
                `}
              >
                {t("faq.refund.question")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("faq.refund.answer")}
              </p>
            </div>
            <div
              className={`
                group rounded-xl bg-gradient-to-br from-card to-card/50 p-6
                shadow-sm transition-all duration-300
                hover:shadow-lg hover:shadow-primary/10
                md:col-span-2
                lg:col-span-1
              `}
            >
              <h3
                className={`
                  mb-3 font-semibold text-primary transition-colors
                  group-hover:text-primary/80
                `}
              >
                {t("faq.bonusCredits.question")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("faq.bonusCredits.answer")}
              </p>
            </div>
          </div>
        </div>

        {/* Payment dialog */}
        <Dialog onOpenChange={handleCloseModal} open={isPaymentModalOpen}>
          <DialogContent
            className={`
              duration-200 animate-in zoom-in-95
              sm:max-w-md
            `}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {t("payment.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {selectedPlan && (
                  <span>
                    {t("payment.description", {
                      credits: selectedPlan.credits,
                      planName: selectedPlan.name,
                      price: selectedPlan.price,
                    })}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {isCreatingPayment ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      h-6 w-6 animate-spin rounded-full border-2 border-primary
                      border-t-transparent
                    `}
                  />
                  <span className="text-muted-foreground">
                    {t("payment.creating")}
                  </span>
                </div>
              </div>
            ) : clientSecret ? (
              <Elements options={stripeOptions} stripe={stripePromise}>
                <PaymentForm
                  amount={selectedPlan?.price || 0}
                  onError={handlePaymentError}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            ) : (
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  {t("payment.failed")}
                </p>
                <Button
                  className={`
                    transition-all
                    hover:scale-105
                  `}
                  onClick={handleCloseModal}
                  variant="outline"
                >
                  {t("payment.close")}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
