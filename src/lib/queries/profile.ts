import "server-only";
import { and, count, desc, eq, sum } from "drizzle-orm";

import { db } from "~/db";
import {
  creditTransactionTable,
  userGenerateRecordsTable,
  userTable,
} from "~/db/schema";

// 用户统计信息类型
export interface UserStats {
  currentBalance: number;
  joinDate: string;
  successfulGenerations: number;
  totalCreditsEarned: number;
  totalCreditsUsed: number;
  totalGenerations: number;
}

// 获取用户积分交易记录（用于账单展示）
export async function getUserCreditTransactions(userId: string, limit = 50) {
  try {
    return await db
      .select()
      .from(creditTransactionTable)
      .where(eq(creditTransactionTable.userId, userId))
      .orderBy(desc(creditTransactionTable.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("获取用户积分交易记录失败:", error);
    return [];
  }
}

// 获取用户生成记录（用于画廊展示）
export async function getUserGenerations(userId: string, limit = 20) {
  try {
    return await db
      .select()
      .from(userGenerateRecordsTable)
      .where(
        and(
          eq(userGenerateRecordsTable.userId, userId),
          eq(userGenerateRecordsTable.status, "completed"),
        ),
      )
      .orderBy(desc(userGenerateRecordsTable.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("获取用户生成记录失败:", error);
    return [];
  }
}

// 获取用户统计信息
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // 获取用户基本信息
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    });

    // 获取积分统计
    const creditStats = await db
      .select({
        totalEarned: sum(creditTransactionTable.amount),
        type: creditTransactionTable.type,
      })
      .from(creditTransactionTable)
      .where(eq(creditTransactionTable.userId, userId))
      .groupBy(creditTransactionTable.type);

    // 获取当前余额（最新交易的balanceAfter）
    const latestTransaction = await db
      .select({ balanceAfter: creditTransactionTable.balanceAfter })
      .from(creditTransactionTable)
      .where(eq(creditTransactionTable.userId, userId))
      .orderBy(desc(creditTransactionTable.createdAt))
      .limit(1);

    // 获取生成记录统计
    const generationStats = await db
      .select({
        count: count(),
        status: userGenerateRecordsTable.status,
      })
      .from(userGenerateRecordsTable)
      .where(eq(userGenerateRecordsTable.userId, userId))
      .groupBy(userGenerateRecordsTable.status);

    // 计算积分统计
    let totalCreditsEarned = 0;
    let totalCreditsUsed = 0;

    for (const stat of creditStats) {
      const amount = Number(stat.totalEarned) || 0;
      if (stat.type === "consumption") {
        totalCreditsUsed += Math.abs(amount); // 消费记录是负数，取绝对值
      } else {
        totalCreditsEarned += amount;
      }
    }

    // 计算生成统计
    const totalGenerations = generationStats.reduce(
      (sum, stat) => sum + stat.count,
      0,
    );
    const successfulGenerations =
      generationStats.find((stat) => stat.status === "completed")?.count || 0;

    return {
      currentBalance: latestTransaction[0]?.balanceAfter || 0,
      joinDate: user?.createdAt.toISOString() || new Date().toISOString(),
      successfulGenerations,
      totalCreditsEarned,
      totalCreditsUsed,
      totalGenerations,
    };
  } catch (error) {
    console.error("获取用户统计信息失败:", error);
    return {
      currentBalance: 0,
      joinDate: new Date().toISOString(),
      successfulGenerations: 0,
      totalCreditsEarned: 0,
      totalCreditsUsed: 0,
      totalGenerations: 0,
    };
  }
}
