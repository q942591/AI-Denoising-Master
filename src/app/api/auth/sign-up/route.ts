import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "~/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = (await request.json()) as {
      email: string;
      name: string;
      password: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    // 注册用户
    const { data, error } = await supabase.auth.signUp({
      email,
      options: {
        data: {
          name: name || email.split("@")[0],
        },
      },
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 注册成功，用户记录将在邮箱验证后的回调中创建
    return NextResponse.json({
      message:
        "Registration successful. Please check your email for verification.",
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
