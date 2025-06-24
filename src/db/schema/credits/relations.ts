import { relations } from "drizzle-orm";

import { userTable } from "../users/tables";
import {
  creditPackageFeatureTable,
  creditPackageTable,
  creditTransactionTable,
} from "./tables";

// 积分交易记录表关系
export const creditTransactionRelations = relations(
  creditTransactionTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [creditTransactionTable.userId],
      references: [userTable.id],
    }),
    // 通过 relatedEntityId 和 relatedEntityType 可以关联到不同类型的实体
    // 例如：套餐购买时关联到 creditPackageTable
    // 消费时可以关联到 uploadsTable 或 generationTable
  }),
);

// 积分套餐表关系
export const creditPackageRelations = relations(
  creditPackageTable,
  ({ many }) => ({
    features: many(creditPackageFeatureTable),
    // 购买该套餐的交易记录
    transactions: many(creditTransactionTable),
  }),
);

// 积分套餐功能表关系
export const creditPackageFeatureRelations = relations(
  creditPackageFeatureTable,
  ({ one }) => ({
    package: one(creditPackageTable, {
      fields: [creditPackageFeatureTable.packageId],
      references: [creditPackageTable.id],
    }),
  }),
);

// 扩展用户关系以包含积分相关信息
export const extendUserCreditRelations = relations(userTable, ({ many }) => ({
  creditTransactions: many(creditTransactionTable),
}));

// 注意：以下关系已删除：
// ❌ userCreditBalanceRelations - 表已删除
// ❌ creditRechargeRelations - 表已删除，功能合并到 creditTransactionTable
