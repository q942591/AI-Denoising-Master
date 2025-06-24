import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { userTable } from "../users/tables";

// 积分交易类型枚举 - 扩展以包含所有类型
export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "purchase", // 购买积分 (合并原来的recharge)
  "consumption", // 消费积分
  "refund", // 退款
  "bonus", // 奖励积分
  "subscription_grant", // 订阅赠送
  "expiration", // 积分过期
  "adjustment", // 管理员调整
]);

// 交易状态枚举
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending", // 等待处理
  "completed", // 已完成
  "failed", // 失败
  "cancelled", // 已取消
]);

// 积分交易记录表 - 统一所有积分相关的交易
export const creditTransactionTable = pgTable("credit_transaction", {
  amount: integer("amount").notNull(), // 积分数量（正数为增加，负数为减少）
  // 余额信息
  balanceAfter: integer("balance_after").notNull(), // 交易后的余额

  // 时间戳
  createdAt: timestamp("created_at").defaultNow().notNull(),
  currency: varchar("currency", { length: 3 }).default("usd"), // 货币类型
  // 交易描述和元数据
  description: varchar("description", { length: 500 }), // 交易描述

  // 基础信息
  id: text("id").primaryKey(),

  metadata: jsonb("metadata"), // 交易元数据(JSON对象)
  paymentAmount: integer("payment_amount"), // 支付金额（美分），仅购买时有值

  // 支付相关信息（用于购买类型）
  paymentIntentId: varchar("payment_intent_id", { length: 100 }), // Stripe支付ID
  paymentMethod: varchar("payment_method", { length: 50 }), // 支付方式
  // 关联信息
  relatedEntityId: text("related_entity_id"), // 关联实体ID（套餐ID、上传ID等）
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // 关联实体类型

  status: transactionStatusEnum("status").notNull().default("completed"),
  // 交易详情
  type: creditTransactionTypeEnum("type").notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// 积分套餐表 - 优化数据类型
export const creditPackageTable = pgTable("credit_package", {
  // 时间戳
  createdAt: timestamp("created_at").defaultNow().notNull(),

  credits: integer("credits").notNull(), // 积分数量
  currency: varchar("currency", { length: 3 }).notNull().default("usd"),
  description: text("description"), // 套餐描述

  id: text("id").primaryKey(),
  // 状态和排序
  isActive: boolean("is_active").notNull().default(true), // 是否激活

  isPopular: boolean("is_popular").default(false), // 是否热门
  // 套餐基本信息
  name: varchar("name", { length: 100 }).notNull(), // 套餐名称
  // 价格信息
  price: integer("price").notNull(), // 价格（美分）

  sortOrder: integer("sort_order").default(0), // 排序顺序
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 积分套餐功能表 - 优化数据类型
export const creditPackageFeatureTable = pgTable("credit_package_feature", {
  // 时间戳
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // 功能信息
  featureKey: varchar("feature_key", { length: 100 }).notNull(), // 功能键（用于翻译）

  id: text("id").primaryKey(),

  // 状态和排序
  isActive: boolean("is_active").notNull().default(true),
  packageId: text("package_id")
    .notNull()
    .references(() => creditPackageTable.id, { onDelete: "cascade" }),

  sortOrder: integer("sort_order").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 积分消费配置表 - 优化数据类型
export const creditConsumptionConfigTable = pgTable(
  "credit_consumption_config",
  {
    // 配置信息
    actionType: varchar("action_type", { length: 100 }).notNull(), // 操作类型

    // 时间戳
    createdAt: timestamp("created_at").defaultNow().notNull(),
    creditsRequired: integer("credits_required").notNull(), // 所需积分
    description: varchar("description", { length: 500 }), // 描述

    id: text("id").primaryKey(),

    // 状态
    isActive: boolean("is_active").notNull().default(true),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);

// 注意：以下表已删除，原因如下：
// ❌ userCreditBalanceTable - 用户余额可以通过creditTransactionTable实时计算
// ❌ creditRechargeTable - 充值信息已合并到creditTransactionTable中
