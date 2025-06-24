import { type NextRequest, NextResponse } from "next/server";

import {
  getDailyRewardStats,
  grantDailyLoginReward,
} from "~/lib/daily-login-reward";
import { createSupabaseServerClient } from "~/lib/supabase/server";

// 获取每日奖励统计信息
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 获取用户的每日奖励统计
    const stats = await getDailyRewardStats(user.id);

    return NextResponse.json({
      stats,
      success: true,
    });
  } catch (error) {
    console.error("获取每日奖励统计错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 手动领取每日奖励
export async function POST(_request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 尝试发放每日奖励
    const result = await grantDailyLoginReward(user.id);

    if (result.success) {
      return NextResponse.json({
        credits: result.credits,
        message: result.message,
        newBalance: result.newBalance,
        success: true,
      });
    }

    return NextResponse.json(
      {
        message: result.message,
        success: false,
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("每日奖励API错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
