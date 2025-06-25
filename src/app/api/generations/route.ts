import { NextResponse } from "next/server";

import { getUserGenerations } from "~/lib/queries/profile";
import { getCurrentSupabaseUser } from "~/lib/supabase/supabase-auth";

export async function GET() {
  try {
    // 获取当前用户
    const user = await getCurrentSupabaseUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 获取用户的生成记录
    const generations = await getUserGenerations(user.id, 20);

    return NextResponse.json(generations);
  } catch (error) {
    console.error("Failed to fetch generations:", error);
    return NextResponse.json(
      { error: "Failed to fetch generations" },
      { status: 500 },
    );
  }
}
