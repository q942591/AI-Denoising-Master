"use client";

import { Download, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

// 数据库原始格式的类型定义（使用下划线命名）
interface DatabaseUserGenerateRecord {
  completed_at: null | string;
  created_at: string;
  credit_consumed: number;
  error_message: null | string;
  id: string;
  input_url: string;
  output_url: null | string;
  parameters: null | string;
  result_metadata: null | string;
  status: "completed" | "failed" | "pending" | "processing";
  transaction_id: null | string;
  type: "colorization" | "super_resolution";
  updated_at: string;
  user_id: string;
}

import { useSupabase } from "~/components/providers/SupabaseProvider";
import { Button } from "~/ui/primitives/button";
import { Card, CardContent } from "~/ui/primitives/card";
import { Image } from "~/ui/primitives/image";
import { Skeleton } from "~/ui/primitives/skeleton";
import { TabsContent } from "~/ui/primitives/tabs";

export function ProfileGalleryTab() {
  const { supabase, user } = useSupabase();
  const t = useTranslations("Profile");
  const [generations, setGenerations] = useState<DatabaseUserGenerateRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    try {
      // 如果已经是字符串，直接解析
      const date = new Date(dateString);
      return date.toLocaleString("zh-CN");
    } catch (error) {
      console.error("日期格式化错误:", error);
      return dateString; // 如果解析失败，返回原始字符串
    }
  };

  // 加载用户生成记录
  const loadGenerations = useCallback(async () => {
    if (!user) {
      setGenerations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_generate_records")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        throw new Error(`加载生成记录失败: ${error.message}`);
      }

      setGenerations(data || []);
    } catch (error) {
      console.error("加载生成记录失败:", error);
      setGenerations([]);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // 设置实时订阅
  useEffect(() => {
    if (!user) return;

    // 初始加载数据
    loadGenerations();

    // 订阅实时更新
    const channel = supabase
      .channel(`user_generate_records:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          filter: `user_id=eq.${user.id}`,
          schema: "public",
          table: "user_generate_records",
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === "INSERT" && newRecord) {
            // 只添加已完成的记录
            if (newRecord.status === "completed") {
              setGenerations((prev) => [
                newRecord as DatabaseUserGenerateRecord,
                ...prev,
              ]);
            }
          } else if (eventType === "UPDATE" && newRecord) {
            setGenerations((prev) =>
              prev.map((record) =>
                record.id === newRecord.id
                  ? (newRecord as DatabaseUserGenerateRecord)
                  : record
              )
            );
          } else if (eventType === "DELETE" && oldRecord) {
            setGenerations((prev) =>
              prev.filter((record) => record.id !== oldRecord.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadGenerations, supabase]);

  if (loading) {
    return (
      <TabsContent className="space-y-6" value="gallery">
        <div>
          <Skeleton className="mb-2 h-7 w-32" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* 加载中的瀑布流卡片占位 */}
        <div
          className={`
            columns-1 gap-4 space-y-4
            sm:columns-2
            lg:columns-3
            xl:columns-4
          `}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              className="mb-4 break-inside-avoid overflow-hidden"
              key={index}
            >
              {/* 图片占位 - 不同高度模拟真实瀑布流 */}
              <Skeleton
                className="w-full"
                style={{ height: `${200 + (index % 3) * 100}px` }}
              />

              <CardContent className="p-4">
                {/* 标签和积分占位 */}
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>

                {/* 时间占位 */}
                <Skeleton className="mb-3 h-4 w-24" />

                {/* 按钮占位 */}
                <div className="flex space-x-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent className="space-y-6" value="gallery">
      <div>
        <h3 className="text-lg font-semibold">{t("gallery.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("gallery.subtitle")}</p>
      </div>

      {generations.length === 0 ? (
        <div
          className={`
            flex flex-col items-center justify-center py-12 text-center
          `}
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <h4 className="mt-4 text-lg font-medium">{t("gallery.empty")}</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("gallery.emptyDescription")}
          </p>
          <Button asChild className="mt-4">
            <a href="/generate">{t("gallery.startCreating")}</a>
          </Button>
        </div>
      ) : (
        <div
          className={`
            columns-1 gap-4 space-y-4
            sm:columns-2
            lg:columns-3
            xl:columns-4
          `}
        >
          {generations.map((generation) => (
            <Card
              className="mb-4 break-inside-avoid overflow-hidden"
              key={generation.id}
            >
              <div className="relative overflow-hidden">
                {generation.output_url && (
                  <Image
                    alt={`Generated image - ${generation.type}`}
                    className="h-full w-full object-cover"
                    height={300}
                    src={generation.output_url}
                    width={300}
                  />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-end">
                  <span className="text-xs text-muted-foreground">
                    -{generation.credit_consumed} Credits
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDateTime(generation.created_at)}
                </p>
                <div className="mt-3 flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={async () => {
                      if (generation.output_url) {
                        try {
                          const response = await fetch(generation.output_url);
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `generated_${generation.id}.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error("下载失败:", error);
                          // 降级到直接打开链接
                          window.open(generation.output_url, "_blank");
                        }
                      }
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    {t("gallery.generation.download")}
                  </Button>
                  {generation.input_url && (
                    <Button
                      onClick={() => {
                        if (generation.input_url) {
                          window.open(generation.input_url, "_blank");
                        }
                      }}
                      size="sm"
                      variant="secondary"
                    >
                      {t("gallery.generation.viewOriginal")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
