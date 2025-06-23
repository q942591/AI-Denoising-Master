import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "~/db";
import { uploadsTable } from "~/db/schema/uploads/tables";
import { getCurrentUser } from "~/lib/auth";
import { deleteFile } from "~/lib/supabase/storage";

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as { id: string };
    if (!body.id) {
      return new NextResponse("Missing media ID", { status: 400 });
    }

    // Get the media item to check ownership and get the path
    const mediaItem = await db.query.uploadsTable.findFirst({
      where: eq(uploadsTable.id, body.id),
    });

    if (!mediaItem) {
      return new NextResponse("Media not found", { status: 404 });
    }

    if (mediaItem.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete from Supabase Storage
    const { error: storageError } = await deleteFile("uploads", mediaItem.path);
    if (storageError) {
      console.error("Storage deletion error:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    await db.delete(uploadsTable).where(eq(uploadsTable.id, body.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting media:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Fetch all media types for the user
    const userMedia = await db
      .select({
        createdAt: uploadsTable.createdAt,
        id: uploadsTable.id,
        path: uploadsTable.path,
        type: uploadsTable.type,
        url: uploadsTable.url,
      })
      .from(uploadsTable)
      .where(eq(uploadsTable.userId, userId))
      .orderBy(uploadsTable.createdAt);

    return NextResponse.json(userMedia);
  } catch (error) {
    console.error("Error fetching user media:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
