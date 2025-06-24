import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { DashscopeImageService } from "~/api/dashscope/ImageService";
import { db } from "~/db";
import { creditTransactionTable, userGenerateRecordsTable } from "~/db/schema";
import { getCurrentUser } from "~/lib/auth";
import { getPublicUrl, uploadFile } from "~/lib/supabase/storage";

const dashscope = new DashscopeImageService();
const BUCKET_NAME = "medias"; // 存储桶名称
const CREDITS_PER_IMAGE = 1; // 每张图片消耗1积分

export async function GET(request: NextRequest) {
  try {
    // check authentication
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get task id from query params
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    try {
      // 查询数据库中的记录
      const record = await db.query.userGenerateRecordsTable.findFirst({
        where: eq(userGenerateRecordsTable.id, taskId),
      });

      if (!record) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      // 如果任务已完成，直接返回结果
      if (record.status === "completed") {
        return NextResponse.json({
          creditsUsed: record.creditConsumed,
          outputUrl: record.outputUrl,
          recordId: record.id,
          status: "completed",
          taskId: record.id,
        });
      }

      // 如果任务失败，返回错误信息
      if (record.status === "failed") {
        return NextResponse.json({
          creditsUsed: record.creditConsumed,
          error: record.errorMessage || "Processing failed",
          recordId: record.id,
          status: "failed",
          taskId: record.id,
        });
      }

      // 如果任务正在处理中，查询Dashscope任务状态
      if (record.status === "processing" && record.transactionId) {
        try {
          const taskResult = await dashscope.queryTask(record.transactionId);

          if (taskResult.output.task_status === "SUCCEEDED") {
            // 任务完成，下载并上传结果到Supabase
            const dashscopeImageUrl = taskResult.output.results?.[0]?.url;

            if (dashscopeImageUrl) {
              try {
                // 下载并上传图片到Supabase
                const supabaseImageUrl = await downloadAndUploadImage(
                  dashscopeImageUrl,
                  user.id,
                  record.id,
                );

                // 更新数据库记录
                await db
                  .update(userGenerateRecordsTable)
                  .set({
                    completedAt: new Date(),
                    outputUrl: supabaseImageUrl,
                    resultMetadata: JSON.stringify({
                      ...taskResult.output,
                      supabaseUrl: supabaseImageUrl,
                    }),
                    status: "completed",
                  })
                  .where(eq(userGenerateRecordsTable.id, taskId));

                return NextResponse.json({
                  creditsUsed: record.creditConsumed,
                  outputUrl: supabaseImageUrl,
                  recordId: record.id,
                  status: "completed",
                  taskId: record.id,
                });
              } catch (uploadError) {
                console.error("Failed to upload result image:", uploadError);

                // 标记为失败
                await db
                  .update(userGenerateRecordsTable)
                  .set({
                    completedAt: new Date(),
                    errorMessage: `Failed to save result: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
                    status: "failed",
                  })
                  .where(eq(userGenerateRecordsTable.id, taskId));

                return NextResponse.json({
                  creditsUsed: record.creditConsumed,
                  error: "Failed to save result image",
                  recordId: record.id,
                  status: "failed",
                  taskId: record.id,
                });
              }
            }
          }

          if (taskResult.output.task_status === "FAILED") {
            // 任务失败，更新数据库记录
            await db
              .update(userGenerateRecordsTable)
              .set({
                completedAt: new Date(),
                errorMessage:
                  taskResult.output.message || "AI processing failed",
                status: "failed",
              })
              .where(eq(userGenerateRecordsTable.id, taskId));

            return NextResponse.json({
              creditsUsed: record.creditConsumed,
              error: taskResult.output.message || "AI processing failed",
              recordId: record.id,
              status: "failed",
              taskId: record.id,
            });
          }
        } catch (queryError) {
          console.error("Dashscope task query error:", queryError);
          // 不直接返回错误，继续返回处理中状态
        }
      }

      // 任务仍在处理中
      return NextResponse.json({
        creditsUsed: record.creditConsumed,
        recordId: record.id,
        status: "processing",
        taskId: record.id,
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: "Failed to query task status" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Task query error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // check authentication
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get request data
    const body = (await request.json()) as { imageUrl: string };
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // validate image URL format
    try {
      new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 },
      );
    }

    // 检查用户积分余额
    try {
      const currentBalance = await getUserCreditBalance(user.id);
      if (currentBalance < CREDITS_PER_IMAGE) {
        return NextResponse.json(
          {
            currentBalance,
            error: "Insufficient credits",
            required: CREDITS_PER_IMAGE,
          },
          { status: 402 }, // Payment Required
        );
      }
    } catch (balanceError) {
      console.error("Failed to check credit balance:", balanceError);
      return NextResponse.json(
        { error: "Failed to verify credit balance" },
        { status: 500 },
      );
    }

    const recordId = createId();

    try {
      // 先扣除积分
      const creditTransactionId = await deductUserCredits(
        user.id,
        CREDITS_PER_IMAGE,
        recordId,
        `Image denoising - Task ${recordId}`,
      );

      // 创建数据库记录
      await db.insert(userGenerateRecordsTable).values({
        creditConsumed: CREDITS_PER_IMAGE,
        id: recordId,
        inputUrl: imageUrl,
        parameters: JSON.stringify({
          creditTransactionId,
          function: "super_resolution",
          model: "wanx2.1-imageedit",
        }),
        status: "pending",
        type: "super_resolution",
        userId: user.id,
      });

      // 调用Dashscope API进行图片降噪
      const editResult = await dashscope.createEditTask({
        base_image_url: imageUrl,
        function: "super_resolution",
        prompt: "图像超分",
        parameters: {
          upscale_factor: 4,
          n: 1,
        }, // 提示词用于降噪
      });

      if (editResult.output?.task_id) {
        // 更新记录状态为处理中，并保存Dashscope任务ID
        await db
          .update(userGenerateRecordsTable)
          .set({
            status: "processing",
            transactionId: editResult.output.task_id,
          })
          .where(eq(userGenerateRecordsTable.id, recordId));

        return NextResponse.json({
          creditsUsed: CREDITS_PER_IMAGE,
          recordId,
          status: "processing",
          taskId: recordId,
        });
      }

      // 任务创建失败，退还积分
      await refundUserCredits(
        user.id,
        CREDITS_PER_IMAGE,
        recordId,
        "Refund for failed AI task creation",
      );

      await db
        .update(userGenerateRecordsTable)
        .set({
          errorMessage: editResult.message || "Failed to create AI task",
          status: "failed",
        })
        .where(eq(userGenerateRecordsTable.id, recordId));

      return NextResponse.json(
        { error: editResult.message || "Failed to create AI task" },
        { status: 500 },
      );
    } catch (aiError) {
      console.error("AI processing error:", aiError);

      // 退还积分
      try {
        await refundUserCredits(
          user.id,
          CREDITS_PER_IMAGE,
          recordId,
          "Refund for AI processing error",
        );
      } catch (refundError) {
        console.error("Failed to refund credits:", refundError);
      }

      // 更新数据库记录为失败状态
      try {
        await db
          .update(userGenerateRecordsTable)
          .set({
            errorMessage:
              aiError instanceof Error ? aiError.message : "Unknown AI error",
            status: "failed",
          })
          .where(eq(userGenerateRecordsTable.id, recordId));
      } catch (dbUpdateError) {
        console.error("Failed to update record status:", dbUpdateError);
      }

      if (
        aiError instanceof Error &&
        aiError.message.includes("DASHSCOPE_API_KEY")
      ) {
        return NextResponse.json(
          { error: "AI service configuration error" },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: "AI processing failed" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Image denoise error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// 扣除用户积分
async function deductUserCredits(
  userId: string,
  amount: number,
  recordId: string,
  description: string,
): Promise<string> {
  const currentBalance = await getUserCreditBalance(userId);

  if (currentBalance < amount) {
    throw new Error(
      `Insufficient credits. Current balance: ${currentBalance}, required: ${amount}`,
    );
  }

  const transactionId = createId();
  const newBalance = currentBalance - amount;

  await db.insert(creditTransactionTable).values({
    amount: -amount, // 负数表示扣除
    balanceAfter: newBalance,
    description,
    id: transactionId,
    relatedEntityId: recordId,
    relatedEntityType: "generation",
    status: "completed",
    type: "consumption",
    userId,
  });

  return transactionId;
}

// 从URL下载文件并上传到Supabase
async function downloadAndUploadImage(
  imageUrl: string,
  userId: string,
  recordId: string,
): Promise<string> {
  try {
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // 创建File对象
    const blob = new Blob([arrayBuffer], { type: contentType });
    const fileExtension = contentType.includes("png") ? "png" : "jpg";
    const fileName = `denoised_${recordId}.${fileExtension}`;
    const file = new File([blob], fileName, { type: contentType });

    // 生成存储路径
    const filePath = `${userId}/generated/${recordId}_${fileName}`;

    // 上传到Supabase
    const { error } = await uploadFile(BUCKET_NAME, filePath, file);
    if (error) {
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    // 获取公共URL
    return await getPublicUrl(BUCKET_NAME, filePath);
  } catch (error) {
    console.error("Error downloading and uploading image:", error);
    throw error;
  }
}

// 获取用户积分余额
async function getUserCreditBalance(userId: string): Promise<number> {
  const transactions = await db.query.creditTransactionTable.findMany({
    limit: 1,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    where: eq(creditTransactionTable.userId, userId),
  });

  return transactions.length > 0 ? transactions[0].balanceAfter : 0;
}

// 退还用户积分
async function refundUserCredits(
  userId: string,
  amount: number,
  recordId: string,
  description: string,
): Promise<string> {
  const currentBalance = await getUserCreditBalance(userId);

  const transactionId = createId();
  const newBalance = currentBalance + amount;

  await db.insert(creditTransactionTable).values({
    amount: amount, // 正数表示增加
    balanceAfter: newBalance,
    description,
    id: transactionId,
    relatedEntityId: recordId,
    relatedEntityType: "generation",
    status: "completed",
    type: "refund",
    userId,
  });

  return transactionId;
}
