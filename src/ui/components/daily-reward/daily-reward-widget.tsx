"use client";

import { Coins, Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Button } from "~/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu";

interface DailyRewardStats {
  lastRewardDate?: string;
  todayReceived: boolean;
  totalCredits: number;
  totalDays: number;
}

export function DailyRewardWidget() {
  const t = useTranslations("DailyReward");
  const [stats, setStats] = useState<DailyRewardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // 使用useCallback来稳定loadStats函数引用
  const loadStats = useCallback(async () => {
    try {
      const response = await fetch("/api/daily-reward");
      if (!response.ok) {
        throw new Error("获取统计信息失败");
      }
      const data = (await response.json()) as { stats: DailyRewardStats };
      setStats(data.stats);
    } catch (err) {
      console.error("加载每日奖励统计失败:", err);
      setError(t("loadFailed"));
    }
  }, [t]);

  // 手动领取每日奖励
  const claimDailyReward = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/daily-reward", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = (await response.json()) as {
        credits?: number;
        message?: string;
        success: boolean;
      };

      if (data.success) {
        // 刷新统计信息
        await loadStats();

        // 可以添加成功提示
        console.log("每日奖励领取成功:", data.credits, "积分");
      } else {
        console.log("每日奖励领取失败:", data.message);
        setError(data.message || t("claimFailed"));
      }
    } catch (err) {
      console.error("领取每日奖励失败:", err);
      setError(t("claimFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时加载统计信息
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // 如果还没有统计信息，不显示组件
  if (!stats && !error) {
    return null;
  }

  const canClaim = stats && !stats.todayReceived;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative" variant="ghost">
          <Gift className="h-5 w-5" />
          {canClaim && (
            <span
              className={`
                absolute -top-1 -right-1 flex h-3 w-3 animate-pulse items-center
                justify-center rounded-full bg-gradient-to-r from-yellow-400
                to-orange-500
              `}
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Gift className="h-4 w-4" />
          {t("title")}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="space-y-4 p-4">
          {/* 奖励状态显示 */}
          <div className="text-center">
            {canClaim ? (
              <div className="space-y-2">
                <div className="text-2xl">🎁</div>
                <p className="text-sm font-medium text-green-600">
                  {t("todayAvailable")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("loginToEarn")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl">✅</div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("todayReceived")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("comeBackTomorrow")}
                </p>
              </div>
            )}
          </div>

          {/* 领取按钮 */}
          {canClaim && (
            <Button
              className={`
                w-full bg-gradient-to-r from-yellow-400 to-orange-500
                hover:from-yellow-500 hover:to-orange-600
              `}
              disabled={isLoading}
              onClick={claimDailyReward}
              size="sm"
            >
              {isLoading ? (
                t("claiming")
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  {t("claimButton")}
                </>
              )}
            </Button>
          )}

          {/* 错误信息 */}
          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <DropdownMenuSeparator />

          {/* 统计信息 */}
          {stats && (
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{t("stats.totalDays")}:</span>
                <span className="font-medium">
                  {stats.totalDays} {t("stats.days")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("stats.totalCredits")}:</span>
                <span className="font-medium">
                  {stats.totalCredits} {t("stats.credits")}
                </span>
              </div>
              {stats.lastRewardDate && (
                <div className="flex justify-between">
                  <span>{t("stats.lastClaim")}:</span>
                  <span className="font-medium">{stats.lastRewardDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
