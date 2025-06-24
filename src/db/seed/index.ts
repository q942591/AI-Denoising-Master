import { seedCreditConsumptionConfig } from "./credit-consumption-config";
import { seedCreditPackageFeatures } from "./credit-package-features";
import { seedCreditPackages } from "./credit-packages";

/**
 * 播种所有种子数据的主函数
 */
export async function seedAllData() {
  console.log("🌱 开始播种所有种子数据...");
  console.log("=".repeat(60));

  try {
    // 1. 首先播种积分套餐（基础数据）
    await seedCreditPackages();
    console.log("");

    // 2. 播种积分套餐功能特性（依赖套餐数据）
    await seedCreditPackageFeatures();
    console.log("");

    // 3. 播种积分消费配置
    await seedCreditConsumptionConfig();
    console.log("");

    console.log("=".repeat(60));
    console.log("🎉 所有种子数据播种完成！");
    console.log("");
    console.log("📊 数据播种总结：");
    console.log("✅ 积分套餐 - 定义了4个套餐（入门、标准、热门、专业）");
    console.log("✅ 套餐功能 - 为每个套餐配置了相应的功能特性");
    console.log("✅ 消费配置 - 定义了各种AI操作的积分消费规则");
    console.log("");
    console.log("🚀 下一步：");
    console.log("• 运行 'bun db:push' 同步数据库结构");
    console.log("• 检查价格页面显示是否正常");
    console.log("• 测试支付流程和积分扣减");
  } catch (error) {
    console.error("❌ 种子数据播种失败:", error);
    throw error;
  }
}

// 如果直接运行此文件
if (import.meta.main) {
  await seedAllData();
  process.exit(0);
}
