import type { InferSelectModel } from "drizzle-orm";

import type {
  creditConsumptionConfigTable,
  creditPackageFeatureTable,
  creditPackageTable,
  creditTransactionTable,
} from "./tables";

// 积分消费配置类型
export type CreditConsumptionConfig = InferSelectModel<
  typeof creditConsumptionConfigTable
>;

// 积分消费请求类型
export interface CreditConsumptionRequest {
  actionType: string;
  metadata?: Record<string, any>;
  relatedEntityId?: string;
  relatedEntityType?: string;
  userId: string;
}

// 积分套餐类型
export type CreditPackage = InferSelectModel<typeof creditPackageTable>;

// 积分套餐功能类型
export type CreditPackageFeature = InferSelectModel<
  typeof creditPackageFeatureTable
>;

// 套餐购买请求类型
export interface CreditPurchaseRequest {
  metadata?: Record<string, any>;
  packageId: string;
  paymentMethod?: string;
}

// 积分交易记录类型
export type CreditTransaction = InferSelectModel<typeof creditTransactionTable>;

// 积分交易类型 - 更新枚举值
export type CreditTransactionType =
  | "adjustment" // 管理员调整
  | "bonus" // 奖励积分
  | "consumption" // 消费积分
  | "expiration" // 积分过期
  | "purchase" // 购买积分 (合并原来的recharge)
  | "refund" // 退款
  | "subscription_grant"; // 订阅赠送

// 交易状态类型
export type TransactionStatus =
  | "cancelled"
  | "completed"
  | "failed"
  | "pending";

// 用户积分余额信息（从交易记录计算得出）
export interface UserCreditBalance {
  currentBalance: number;
  lastTransactionAt?: Date;
  totalBonus: number;
  totalConsumed: number;
  totalPurchased: number;
  userId: string;
}

// 注意：已删除的类型
// ❌ CreditRecharge - 表已删除
// ❌ CreditRechargeStatus - 合并到 TransactionStatus
// ❌ UserCreditBalance (原来的表类型) - 改为计算类型
