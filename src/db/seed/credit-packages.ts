import cuid2 from "@paralleldrive/cuid2";

import { db } from "~/db";
import { creditPackageTable } from "~/db/schema/credits/tables";

// 积分套餐种子数据 - 根据pricing-plans.tsx和数据库schema定义
const creditPackagesData = [
  {
    credits: 100,
    currency: "usd",
    description:
      "入门级体验包，适合偶尔使用AI功能的个人用户。可完成约20张图片上色、15张图片超分辨率或25张图片增强处理。包含基础图像处理功能，积分永不过期，新手友好。",
    id: cuid2.createId(),
    isActive: true, // 修复: 使用boolean而不是number
    isPopular: false, // 修复: 使用boolean而不是number
    name: "入门套餐",
    price: 999, // $9.99 in cents
    sortOrder: 1,
  },
  {
    credits: 300,
    currency: "usd",
    description:
      "🔥 最受欢迎的选择！适合常规使用的用户，性价比最高。可完成约60张图片上色、45张图片超分辨率或75张图片增强处理。包含优先客服支持，相比单次购买节省17%费用。",
    id: cuid2.createId(),
    isActive: true, // 修复: 使用boolean而不是number
    isPopular: true, // 修复: 使用boolean而不是number - 标记为热门
    name: "标准套餐",
    price: 2499, // $24.99 in cents
    sortOrder: 2,
  },
  {
    credits: 600,
    currency: "usd",
    description:
      "专业用户和小团队的理想选择，超值优惠包。可完成约120张图片上色、90张图片超分辨率或150张图片增强处理。包含所有AI功能、优先处理队列、批量操作支持，相比单次购买节省33%费用。",
    id: cuid2.createId(),
    isActive: true, // 修复: 使用boolean而不是number
    isPopular: false, // 修复: 使用boolean而不是number
    name: "热门套餐",
    price: 3999, // $39.99 in cents
    sortOrder: 3,
  },
  {
    credits: 1200,
    currency: "usd",
    description:
      "👑 企业级用户的终极选择，功能全面解锁。可完成约240张图片上色、180张图片超分辨率或300张图片增强处理。包含API访问权限、LivePortrait视频生成、批量处理、专属客服、自定义模型训练，相比单次购买节省42%费用。",
    id: cuid2.createId(),
    isActive: true, // 修复: 使用boolean而不是number
    isPopular: false, // 修复: 使用boolean而不是number
    name: "专业套餐",
    price: 6999, // $69.99 in cents
    sortOrder: 4,
  },
];

export async function seedCreditPackages() {
  console.log("🌱 开始播种积分套餐数据...");

  try {
    // 检查是否已有数据
    const existingPackages = await db.select().from(creditPackageTable);

    if (existingPackages.length > 0) {
      console.log("⚠️  积分套餐数据已存在，跳过播种");
      return;
    }

    // 插入种子数据
    await db.insert(creditPackageTable).values(creditPackagesData);

    console.log(`✅ 成功插入 ${creditPackagesData.length} 个积分套餐`);
    console.log("📦 积分套餐详情:");
    for (const pkg of creditPackagesData) {
      console.log(
        `   ${pkg.isPopular ? "🔥" : "📦"} ${pkg.name}: ${pkg.credits} 积分 = $${pkg.price / 100}`,
      );
      console.log(`      ${pkg.description.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error("❌ 积分套餐播种失败:", error);
    throw error;
  }
}

// 如果直接运行此文件
if (import.meta.main) {
  await seedCreditPackages();
  process.exit(0);
}
