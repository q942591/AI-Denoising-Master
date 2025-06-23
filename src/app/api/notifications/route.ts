import type { NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "~/db";
import { notificationsTable } from "~/db/schema";
import { createSupabaseServerClient } from "~/lib/supabase/server";

// 删除通知
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      // 清除所有通知
      await db
        .delete(notificationsTable)
        .where(eq(notificationsTable.userId, user.id));
    } else if (id) {
      // 删除单个通知
      await db
        .delete(notificationsTable)
        .where(
          and(
            eq(notificationsTable.id, id),
            eq(notificationsTable.userId, user.id),
          ),
        );
    } else {
      return Response.json({ error: "缺少必要参数" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("删除通知失败:", error);
    return Response.json({ error: "删除通知失败" }, { status: 500 });
  }
}

// 获取通知列表
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未授权" }, { status: 401 });
    }

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, user.id))
      .orderBy(notificationsTable.createdAt);

    return Response.json({ notifications });
  } catch (error) {
    console.error("获取通知失败:", error);
    return Response.json({ error: "获取通知失败" }, { status: 500 });
  }
}

// 标记通知为已读
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未授权" }, { status: 401 });
    }

    const body = (await request.json()) as { id?: string; markAll?: boolean };
    const { id, markAll } = body;

    if (markAll) {
      // 标记所有通知为已读
      await db
        .update(notificationsTable)
        .set({ isRead: true, updatedAt: new Date() })
        .where(eq(notificationsTable.userId, user.id));
    } else if (id) {
      // 标记单个通知为已读
      await db
        .update(notificationsTable)
        .set({ isRead: true, updatedAt: new Date() })
        .where(
          and(
            eq(notificationsTable.id, id),
            eq(notificationsTable.userId, user.id),
          ),
        );
    } else {
      return Response.json({ error: "缺少必要参数" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("更新通知失败:", error);
    return Response.json({ error: "更新通知失败" }, { status: 500 });
  }
}
