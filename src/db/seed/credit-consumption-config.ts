import { createId } from "@paralleldrive/cuid2";

import { db } from "~/db";
import { creditConsumptionConfigTable } from "~/db/schema/credits/tables";

// 积分消费配置种子数据
const creditConsumptionConfigs = [
  {
    actionType: "colorize_image",
    creditsRequired: 5,
    description: "AI 图像上色 - 将黑白照片转换为彩色",
    id: createId(),
    isActive: 1,
  },
  {
    actionType: "enhance_image",
    creditsRequired: 3,
    description: "图像增强 - 提升图像质量和清晰度",
    id: createId(),
    isActive: 1,
  },
  {
    actionType: "super_resolution",
    creditsRequired: 4,
    description: "超分辨率 - 放大图像并保持细节",
    id: createId(),
    isActive: 1,
  },
  {
    actionType: "restore_image",
    creditsRequired: 6,
    description: "图像修复 - 修复老照片的损坏和褪色",
    id: createId(),
    isActive: 1,
  },
  {
    actionType: "emoji_video",
    creditsRequired: 8,
    description: "表情包视频生成 - 生成动态表情包",
    id: createId(),
    isActive: 1,
  },
  {
    actionType: "live_portrait",
    creditsRequired: 10,
    description: "LivePortrait 视频生成 - 人像口型同步视频",
    id: createId(),
    isActive: 1,
  },
  {
    actionType: "video_retalk",
    creditsRequired: 12,
    description: "视频口型替换 - 视频人物口型重新同步",
    id: createId(),
    isActive: 1,
  },
];

export async function seedCreditConsumptionConfig() {
  console.log("🌱 开始播种积分消费配置数据...");

  try {
    // 检查是否已有数据
    const existingConfigs = await db
      .select()
      .from(creditConsumptionConfigTable);

    if (existingConfigs.length > 0) {
      console.log("⚠️  积分消费配置数据已存在，跳过播种");
      return;
    }

    // 插入种子数据
    await db
      .insert(creditConsumptionConfigTable)
      .values(creditConsumptionConfigs);

    console.log(
      `✅ 成功插入 ${creditConsumptionConfigs.length} 个积分消费配置`,
    );
    console.log("⚙️  积分消费配置详情:");
    for (const config of creditConsumptionConfigs) {
      console.log(
        `   - ${config.actionType}: ${config.creditsRequired} 积分 - ${config.description}`,
      );
    }
  } catch (error) {
    console.error("❌ 积分消费配置播种失败:", error);
    throw error;
  }
}

// 如果直接运行此文件
if (import.meta.main) {
  await seedCreditConsumptionConfig();
  process.exit(0);
}
