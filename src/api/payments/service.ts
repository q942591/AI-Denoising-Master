import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

import { db } from "~/db";
import { stripeCustomerTable, stripeSubscriptionTable } from "~/db/schema";
import { stripe } from "~/lib/stripe/config";

export async function createBillingPortalSession(
  userId: string,
  returnUrl: string,
) {
  try {
    const customer = await getStripeCustomer(userId);

    if (!customer) {
      throw new Error("customer not found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error("error creating billing portal session:", error);
    throw error;
  }
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
) {
  try {
    const customer = await getStripeCustomer(userId);

    if (!customer) {
      throw new Error("customer not found");
    }

    const session = await stripe.checkout.sessions.create({
      cancel_url: cancelUrl,
      customer: customer.customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: successUrl,
    });

    return session;
  } catch (error) {
    console.error("error creating checkout session:", error);
    throw error;
  }
}

export async function createStripeCustomer(
  userId: string,
  email: string,
  name?: string,
) {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
      name,
    });

    await db.insert(stripeCustomerTable).values({
      customerId: customer.id,
      id: createId(),
      userId,
    });

    return customer;
  } catch (error) {
    console.error("error creating stripe customer:", error);
    throw error;
  }
}

export async function getCustomerState(userId: string) {
  const customer = await getStripeCustomer(userId);
  if (!customer) {
    return null;
  }

  try {
    const stripeCustomer = await stripe.customers.retrieve(customer.customerId);
    return stripeCustomer;
  } catch (error) {
    console.error("error fetching stripe customer:", error);
    return null;
  }
}

export async function getStripeCustomer(userId: string) {
  const customer = await db.query.stripeCustomerTable.findFirst({
    where: eq(stripeCustomerTable.userId, userId),
  });
  return customer;
}

export async function getUserSubscriptions(userId: string) {
  const subscriptions = await db.query.stripeSubscriptionTable.findMany({
    where: eq(stripeSubscriptionTable.userId, userId),
  });
  return subscriptions;
}
