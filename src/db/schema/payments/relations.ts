import { relations } from "drizzle-orm";

import { userTable } from "../users/tables";
import { stripeCustomerTable, stripeSubscriptionTable } from "./tables";

export const stripeCustomerRelations = relations(
  stripeCustomerTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [stripeCustomerTable.userId],
      references: [userTable.id],
    }),
  }),
);

export const stripeSubscriptionRelations = relations(
  stripeSubscriptionTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [stripeSubscriptionTable.userId],
      references: [userTable.id],
    }),
  }),
);

export const extendUserRelations = relations(userTable, ({ many }) => ({
  stripeCustomers: many(stripeCustomerTable),
  stripeSubscriptions: many(stripeSubscriptionTable),
}));
