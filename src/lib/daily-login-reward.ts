import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, gte } from "drizzle-orm";

import { db } from "~/db";
import {
  creditTransactionTable,
  notificationsTable,
  userTable,
} from "~/db/schema";

// 每日登录奖励配置
const DAILY_LOGIN_REWARD = {
  CREDITS: 5,
  DESCRIPTION: "每日登录奖励",
  NOTIFICATION_DESCRIPTION:
    "恭喜您获得每日登录奖励 5 积分！明天记得再来领取哦～",
  NOTIFICATION_TITLE: "🎁 每日登录奖励",
};

/**
 * 检查并发放每日登录奖励（用于登录流程）
 */
export async function checkAndGrantDailyReward(userId: string): Promise<void> {
  try {
    // 确保用户存在
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (user.length === 0) {
      console.warn(`用户 ${userId} 不存在，跳过每日奖励检查`);
      return;
    }

    // 检查并发放每日奖励
    const result = await grantDailyLoginReward(userId);

    if (result.success) {
      console.log(
        `✅ 每日登录奖励发放成功: 用户 ${userId} 获得 ${result.credits} 积分`,
      );
    } else {
      console.log(`ℹ️  每日登录奖励: ${result.message}`);
    }
  } catch (error) {
    console.error("检查每日登录奖励失败:", error);
    // 不抛出错误，避免影响登录流程
  }
}

/**
 * 获取用户的每日奖励统计信息
 */
export async function getDailyRewardStats(userId: string): Promise<{
  lastRewardDate?: string;
  todayReceived: boolean;
  totalCredits: number;
  totalDays: number;
}> {
  try {
    // 获取所有每日登录奖励记录
    const rewards = await db
      .select({
        amount: creditTransactionTable.amount,
        createdAt: creditTransactionTable.createdAt,
      })
      .from(creditTransactionTable)
      .where(
        and(
          eq(creditTransactionTable.userId, userId),
          eq(creditTransactionTable.type, "bonus"),
          eq(
            creditTransactionTable.description,
            DAILY_LOGIN_REWARD.DESCRIPTION,
          ),
        ),
      )
      .orderBy(desc(creditTransactionTable.createdAt));

    const totalDays = rewards.length;
    const totalCredits = rewards.reduce(
      (sum, reward) => sum + reward.amount,
      0,
    );
    const lastRewardDate =
      rewards.length > 0
        ? rewards[0].createdAt.toISOString().split("T")[0]
        : undefined;

    // 检查今天是否已领取
    const today = new Date().toISOString().split("T")[0];
    const todayReceived = lastRewardDate === today;

    return {
      lastRewardDate,
      todayReceived,
      totalCredits,
      totalDays,
    };
  } catch (error) {
    console.error("获取每日奖励统计失败:", error);
    return {
      todayReceived: false,
      totalCredits: 0,
      totalDays: 0,
    };
  }
}

/**
 * 获取用户当前积分余额
 */
export async function getUserCreditBalance(userId: string): Promise<number> {
  try {
    const latestTransaction = await db
      .select({ balanceAfter: creditTransactionTable.balanceAfter })
      .from(creditTransactionTable)
      .where(eq(creditTransactionTable.userId, userId))
      .orderBy(desc(creditTransactionTable.createdAt))
      .limit(1);

    return latestTransaction.length > 0 ? latestTransaction[0].balanceAfter : 0;
  } catch (error) {
    console.error("获取用户积分余额失败:", error);
    return 0;
  }
}

/**
 * 为用户发放每日登录奖励
 */
export async function grantDailyLoginReward(userId: string): Promise<{
  credits?: number;
  message: string;
  newBalance?: number;
  success: boolean;
}> {
  try {
    // 检查今天是否已经获得过奖励
    const hasReward = await hasReceivedDailyReward(userId);
    if (hasReward) {
      return {
        message: "今天已经获得过登录奖励了",
        success: false,
      };
    }

    // 获取当前积分余额
    const currentBalance = await getUserCreditBalance(userId);
    const newBalance = currentBalance + DAILY_LOGIN_REWARD.CREDITS;

    // 创建积分交易记录
    const transactionId = createId();
    await db.insert(creditTransactionTable).values({
      amount: DAILY_LOGIN_REWARD.CREDITS,
      balanceAfter: newBalance,
      description: DAILY_LOGIN_REWARD.DESCRIPTION,
      id: transactionId,
      metadata: {
        date: new Date().toISOString().split("T")[0],
        rewardType: "daily_login",
      },
      status: "completed",
      type: "bonus",
      userId,
    });

    // 创建通知
    const notificationId = createId();
    await db.insert(notificationsTable).values({
      description: DAILY_LOGIN_REWARD.NOTIFICATION_DESCRIPTION,
      entityId: transactionId,
      entityType: "credit_transaction",
      id: notificationId,
      isRead: false,
      metadata: {
        credits: DAILY_LOGIN_REWARD.CREDITS,
        newBalance,
        rewardType: "daily_login",
      },
      title: DAILY_LOGIN_REWARD.NOTIFICATION_TITLE,
      type: "credit",
      userId,
    });

    console.log(
      `用户 ${userId} 获得每日登录奖励: ${DAILY_LOGIN_REWARD.CREDITS} 积分`,
    );

    return {
      credits: DAILY_LOGIN_REWARD.CREDITS,
      message: "每日登录奖励发放成功",
      newBalance,
      success: true,
    };
  } catch (error) {
    console.error("发放每日登录奖励失败:", error);
    return {
      message: "发放奖励时出现错误",
      success: false,
    };
  }
}

/**
 * 检查用户今天是否已经获得过登录奖励
 */
export async function hasReceivedDailyReward(userId: string): Promise<boolean> {
  try {
    // 获取今天的开始时间（凌晨0点）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 查询今天是否有登录奖励交易记录
    const todayReward = await db
      .select()
      .from(creditTransactionTable)
      .where(
        and(
          eq(creditTransactionTable.userId, userId),
          eq(creditTransactionTable.type, "bonus"),
          eq(
            creditTransactionTable.description,
            DAILY_LOGIN_REWARD.DESCRIPTION,
          ),
          gte(creditTransactionTable.createdAt, today),
        ),
      )
      .limit(1);

    return todayReward.length > 0;
  } catch (error) {
    console.error("检查每日奖励状态失败:", error);
    return false;
  }
}
