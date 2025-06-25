import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, gte } from "drizzle-orm";

import { db } from "~/db";
import {
  creditTransactionTable,
  notificationsTable,
  userTable,
} from "~/db/schema";

// daily login reward configuration
const DAILY_LOGIN_REWARD = {
  CREDITS: 5,
  DESCRIPTION: "Daily Login Reward",
  NOTIFICATION_DESCRIPTION:
    "Congratulations! You've received 5 credits for your daily login. Remember to come back tomorrow!",
  NOTIFICATION_TITLE: "🎁 Daily Login Reward",
};

/**
 * check and grant daily login reward (used in login flow)
 */
export async function checkAndGrantDailyReward(userId: string): Promise<void> {
  try {
    // ensure user exists
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (user.length === 0) {
      console.warn(`user ${userId} does not exist, skip daily reward check`);
      return;
    }

    // check and grant daily reward
    const result = await grantDailyLoginReward(userId);

    if (result.success) {
      console.log(
        `✅ daily login reward granted successfully: user ${userId} received ${result.credits} credits`,
      );
    } else {
      console.log(`ℹ️  daily login reward: ${result.message}`);
    }
  } catch (error) {
    console.error("failed to check daily login reward:", error);
    // don't throw error to avoid affecting login flow
  }
}

/**
 * get user's daily reward statistics
 */
export async function getDailyRewardStats(userId: string): Promise<{
  lastRewardDate?: string;
  todayReceived: boolean;
  totalCredits: number;
  totalDays: number;
}> {
  try {
    // get all daily login reward records
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

    // check if already received today
    const today = new Date().toISOString().split("T")[0];
    const todayReceived = lastRewardDate === today;

    return {
      lastRewardDate,
      todayReceived,
      totalCredits,
      totalDays,
    };
  } catch (error) {
    console.error("failed to get daily reward statistics:", error);
    return {
      todayReceived: false,
      totalCredits: 0,
      totalDays: 0,
    };
  }
}

/**
 * get user's current credit balance
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
    console.error("failed to get user credit balance:", error);
    return 0;
  }
}

/**
 * grant daily login reward to user
 */
export async function grantDailyLoginReward(userId: string): Promise<{
  credits?: number;
  message: string;
  newBalance?: number;
  success: boolean;
}> {
  try {
    // check if already received reward today
    const hasReward = await hasReceivedDailyReward(userId);
    if (hasReward) {
      return {
        message: "Already received login reward today",
        success: false,
      };
    }

    // get current credit balance
    const currentBalance = await getUserCreditBalance(userId);
    const newBalance = currentBalance + DAILY_LOGIN_REWARD.CREDITS;

    // create credit transaction record
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

    // create notification
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
      `user ${userId} received daily login reward: ${DAILY_LOGIN_REWARD.CREDITS} credits`,
    );

    return {
      credits: DAILY_LOGIN_REWARD.CREDITS,
      message: "Daily login reward granted successfully",
      newBalance,
      success: true,
    };
  } catch (error) {
    console.error("failed to grant daily login reward:", error);
    return {
      message: "Error occurred while granting reward",
      success: false,
    };
  }
}

/**
 * check if user has already received daily login reward today
 */
export async function hasReceivedDailyReward(userId: string): Promise<boolean> {
  try {
    // get today's start time (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // query if there's a login reward transaction record today
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
    console.error("failed to check daily reward status:", error);
    return false;
  }
}
