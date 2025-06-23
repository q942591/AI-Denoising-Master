import { type NextRequest, NextResponse } from "next/server";

import { createBillingPortalSession } from "~/api/payments/service";
import { getCurrentUser } from "~/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "authentication required" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as { returnUrl: string };
    const { returnUrl } = body;

    if (!returnUrl) {
      return NextResponse.json(
        { error: "return url is required" },
        { status: 400 },
      );
    }

    const session = await createBillingPortalSession(user.id, returnUrl);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("error creating billing portal session:", error);
    return NextResponse.json(
      { error: "failed to create billing portal session" },
      { status: 500 },
    );
  }
}
