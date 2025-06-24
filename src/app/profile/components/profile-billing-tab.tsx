"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CreditCard, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

// 数据库原始格式的类型定义（使用 camelCase 命名）
interface DatabaseCreditTransaction {
  amount: number;
  balance_after: number;
  created_at: string;
  description: string;
  id: string;
  status: "cancelled" | "completed" | "failed" | "pending";
  type:
    | "adjustment"
    | "bonus"
    | "consumption"
    | "expiration"
    | "purchase"
    | "refund"
    | "subscription_grant";
  updated_at: string;
  user_id: string;
}

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { Badge } from "~/ui/primitives/badge";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { DataGrid, DataGridContainer } from "~/ui/primitives/data-grid";
import { DataGridTable } from "~/ui/primitives/data-grid-table";
import { Separator } from "~/ui/primitives/separator";
import { Skeleton } from "~/ui/primitives/skeleton";
import { TabsContent } from "~/ui/primitives/tabs";

export function ProfileBillingTab() {
  const { supabase, user } = useSupabase();
  const t = useTranslations("Profile");
  const [transactions, setTransactions] = useState<DatabaseCreditTransaction[]>(
    []
  );
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // 定义表格列
  const transactionColumns: ColumnDef<DatabaseCreditTransaction>[] = useMemo(
    () => [
      {
        accessorKey: "type",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.type === "consumption" ? "destructive" : "primary"
            }
          >
            {t(`billing.transaction.types.${row.original.type}`)}
          </Badge>
        ),
        header: t("billing.transaction.type"),
      },
      {
        accessorKey: "description",
        header: t("billing.transaction.description"),
      },
      {
        accessorKey: "amount",
        cell: ({ row }) => (
          <span
            className={
              row.original.amount > 0 ? "text-green-600" : "text-red-600"
            }
          >
            {row.original.amount > 0 ? "+" : ""}
            {row.original.amount}
          </span>
        ),
        header: t("billing.transaction.amount"),
      },
      {
        accessorKey: "balance_after",
        header: t("billing.transaction.balance"),
      },
      {
        accessorKey: "created_at",
        cell: ({ row }) => formatDateTime(row.original.created_at),
        header: t("billing.transaction.date"),
      },
      {
        accessorKey: "status",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {t(`billing.transaction.statuses.${row.original.status}`)}
          </Badge>
        ),
        header: t("billing.transaction.status"),
      },
    ],
    [t]
  );

  // 创建表格实例
  const table = useReactTable({
    columns: transactionColumns,
    data: transactions,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("zh-CN");
    } catch (error) {
      console.error("日期格式化错误:", error);
      return dateString;
    }
  };

  // 加载交易记录
  const loadTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setCurrentBalance(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 并行获取交易记录和当前余额
      const [{ data: transactionData }, { data: latestTransaction }] =
        await Promise.all([
          // 获取交易记录
          supabase
            .from("credit_transaction")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50),

          // 获取最新余额
          supabase
            .from("credit_transaction")
            .select("balance_after")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1),
        ]);

      if (transactionData) {
        setTransactions(transactionData);
      }

      if (latestTransaction?.[0]) {
        setCurrentBalance(latestTransaction[0].balance_after);
      }
    } catch (error) {
      console.error("加载交易记录失败:", error);
      setTransactions([]);
      setCurrentBalance(0);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // 设置实时订阅
  useEffect(() => {
    if (!user) return;

    // 初始加载数据
    loadTransactions();

    // 订阅实时更新
    const channel = supabase
      .channel(`credit_transaction:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          filter: `userId=eq.${user.id}`,
          schema: "public",
          table: "credit_transaction",
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === "INSERT" && newRecord) {
            setTransactions((prev) => [
              newRecord as DatabaseCreditTransaction,
              ...prev,
            ]);
            // 更新余额
            setCurrentBalance(
              (newRecord as DatabaseCreditTransaction).balance_after
            );
          } else if (eventType === "UPDATE" && newRecord) {
            setTransactions((prev) =>
              prev.map((record) =>
                record.id === newRecord.id
                  ? (newRecord as DatabaseCreditTransaction)
                  : record
              )
            );
            // 更新余额
            setCurrentBalance(
              (newRecord as DatabaseCreditTransaction).balance_after
            );
          } else if (eventType === "DELETE" && oldRecord) {
            setTransactions((prev) =>
              prev.filter((record) => record.id !== oldRecord.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadTransactions, supabase]);

  if (loading) {
    return (
      <TabsContent className="space-y-6" value="billing">
        <div>
          <Skeleton className="mb-2 h-7 w-32" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>

        <Separator />

        <div>
          <Skeleton className="mb-4 h-6 w-24" />

          {/* 交易记录占位 */}
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="mb-1 h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="mb-1 h-5 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent className="space-y-6" value="billing">
      <div>
        <h3 className="text-lg font-semibold">{t("billing.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("billing.subtitle")}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">{t("billing.balance")}</span>
          <Badge className="text-lg" variant="secondary">
            {currentBalance}
          </Badge>
        </div>
        <Button asChild>
          <a href="/pricing">{t("billing.recharge")}</a>
        </Button>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium">{t("billing.transactions")}</h4>

        {transactions.length === 0 ? (
          <div
            className={`
              flex flex-col items-center justify-center py-12 text-center
            `}
          >
            <CreditCard className="h-12 w-12 text-muted-foreground" />
            <h4 className="mt-4 text-lg font-medium">{t("billing.empty")}</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("billing.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <DataGridContainer>
              <DataGrid recordCount={transactions.length} table={table}>
                <DataGridTable />
              </DataGrid>
            </DataGridContainer>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
