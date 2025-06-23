import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { userTable } from "../users/tables";

export const stripeCustomerTable = pgTable("stripe_customer", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  customerId: text("customer_id").notNull().unique(),
  id: text("id").primaryKey(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const stripeSubscriptionTable = pgTable("stripe_subscription", {
  cancelAt: timestamp("cancel_at"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  currentPeriodStart: timestamp("current_period_start"),
  id: text("id").primaryKey(),
  metadata: text("metadata"), // JSON string for additional data
  priceId: text("price_id"),
  productId: text("product_id"),
  status: text("status").notNull(), // active, canceled, incomplete, past_due, etc.
  subscriptionId: text("subscription_id").notNull().unique(),
  trialEnd: timestamp("trial_end"),
  trialStart: timestamp("trial_start"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});
