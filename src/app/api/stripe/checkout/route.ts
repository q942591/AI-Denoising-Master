import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 临时返回一个测试 URL
    return NextResponse.json({
      url: "https://stripe.com",
    });
  } catch (error) {
    console.error("error creating checkout session:", error);
    return NextResponse.json(
      { error: "failed to create checkout session" },
      { status: 500 },
    );
  }
}
