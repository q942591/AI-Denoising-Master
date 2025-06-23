import { createId } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "~/db";
import { uploadsTable } from "~/db/schema";
import { getCurrentUser } from "~/lib/auth";
import { getPublicUrl, uploadFile } from "~/lib/supabase/storage";

const BUCKET_NAME = "uploads"; // make sure this bucket exists in your supabase project

export async function POST(request: NextRequest) {
  try {
    // check authentication
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // validate file type
    if (!["image", "video"].includes(type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // validate file size (4MB for images, 64MB for videos)
    const maxSize = type === "image" ? 4 * 1024 * 1024 : 64 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    // generate unique file path
    const fileId = createId();
    const fileExtension = file.name.split(".").pop();
    const filePath = `${user.id}/${type}s/${fileId}.${fileExtension}`;

    // upload to supabase storage
    const { error } = await uploadFile(BUCKET_NAME, filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // get public url
    const publicUrl = getPublicUrl(BUCKET_NAME, filePath);

    // save to database
    try {
      const uploadRecord = await db
        .insert(uploadsTable)
        .values({
          id: fileId,
          path: filePath,
          type: type as "image" | "video",
          url: publicUrl,
          userId: user.id,
        })
        .returning();

      return NextResponse.json({
        id: fileId,
        path: filePath,
        type,
        upload: uploadRecord[0],
        url: publicUrl,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save upload record" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
