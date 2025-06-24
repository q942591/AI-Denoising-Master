"use client";

import { Calendar, CreditCard, Sparkles, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import type { User } from "~/db/schema/users/types";

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Skeleton } from "~/ui/primitives/skeleton";

interface ProfileStatsCardProps {
  user: User;
}

interface UserStats {
  currentBalance: number;
  joinDate: string;
  successfulGenerations: number;
  totalCreditsEarned: number;
  totalCreditsUsed: number;
  totalGenerations: number;
}

export function ProfileStatsCard({ user }: ProfileStatsCardProps) {
  const { supabase } = useSupabase();
  const t = useTranslations("Profile");
  const [stats, setStats] = useState<null | UserStats>(null);
  const [loading, setLoading] = useState(true);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 获取统计数据
  const loadStats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 并行获取所有统计数据
      const [
        { data: creditStats },
        { data: latestTransaction },
        { data: generationStats },
        { data: userInfo },
      ] = await Promise.all([
        // 获取积分统计
        supabase
          .from("credit_transaction")
          .select("amount, type")
          .eq("user_Id", user.id),

        // 获取最新交易记录以获取当前余额
        supabase
          .from("credit_transaction")
          .select("balance_after")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1),

        // 获取生成记录统计
        supabase
          .from("user_generate_records")
          .select("status")
          .eq("user_id", user.id),

        // 获取用户基本信息
        supabase.from("user").select("created_at").eq("id", user.id).single(),
      ]);

      // 计算积分统计
      let totalCreditsEarned = 0;
      let totalCreditsUsed = 0;

      if (creditStats) {
        for (const transaction of creditStats) {
          const amount = Number(transaction.amount) || 0;
          if (transaction.type === "consumption") {
            totalCreditsUsed += Math.abs(amount);
          } else {
            totalCreditsEarned += amount;
          }
        }
      }

      // 计算生成统计
      const totalGenerations = generationStats?.length || 0;
      const successfulGenerations =
        generationStats?.filter((g) => g.status === "completed").length || 0;

      setStats({
        currentBalance: latestTransaction?.[0]?.balance_after || 0,
        joinDate: userInfo?.created_at || new Date().toISOString(),
        successfulGenerations,
        totalCreditsEarned,
        totalCreditsUsed,
        totalGenerations,
      });
    } catch (error) {
      console.error("加载统计数据失败:", error);
      setStats({
        currentBalance: 0,
        joinDate: new Date().toISOString(),
        successfulGenerations: 0,
        totalCreditsEarned: 0,
        totalCreditsUsed: 0,
        totalGenerations: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 加入时间占位 */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* 统计数据网格占位 */}
          <div
            className={`
              grid grid-cols-2 gap-6
              md:grid-cols-4
            `}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="text-center" key={index}>
                <div className="mb-2 flex items-center justify-center space-x-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="mx-auto mb-1 h-8 w-12" />
                {index === 1 && <Skeleton className="mx-auto h-3 w-20" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <span>{t("stats.overview")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 用户基本信息 */}
        <div
          className={`flex items-center space-x-2 text-sm text-muted-foreground`}
        >
          <Calendar className="h-4 w-4" />
          <span>
            {t("stats.memberSince")} {formatDate(stats.joinDate)}
          </span>
        </div>

        {/* 统计数据网格 */}
        <div
          className={`
            grid grid-cols-2 gap-6
            md:grid-cols-4
          `}
        >
          {/* 当前积分 */}
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("stats.currentBalance")}
              </span>
            </div>
            <p className="text-2xl font-bold">{stats.currentBalance}</p>
          </div>

          {/* 总生成次数 */}
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center space-x-1">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("stats.totalGenerations")}
              </span>
            </div>
            <p className="text-2xl font-bold">{stats.totalGenerations}</p>
            <p className="text-xs text-muted-foreground">
              {t("stats.successfulGenerations")}: {stats.successfulGenerations}
            </p>
          </div>

          {/* 获得积分 */}
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center space-x-1">
              <CreditCard className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("stats.creditsEarned")}
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              +{stats.totalCreditsEarned}
            </p>
          </div>

          {/* 已用积分 */}
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center space-x-1">
              <CreditCard className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("stats.creditsUsed")}
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              -{stats.totalCreditsUsed}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
