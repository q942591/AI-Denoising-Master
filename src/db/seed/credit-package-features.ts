import cuid2 from "@paralleldrive/cuid2";

import { db } from "~/db";
import {
  creditPackageFeatureTable,
  creditPackageTable,
} from "~/db/schema/credits/tables";

// 定义所有可用的功能特性（英文键，用于国际化）
const AVAILABLE_FEATURES = {
  API_ACCESS: "api_access", // API access
  // 基础功能
  BASIC_CREDITS: "basic_credits", // {credits} credits
  // 高级功能
  BULK_PROCESSING: "bulk_processing", // Bulk processing
  COLORIZATION: "colorization", // Image colorization

  CUSTOM_TRAINING: "custom_training", // Custom model training
  ENHANCEMENT: "enhancement", // Image enhancement
  IMAGE_PROCESSING: "image_processing", // Image processing

  LIVE_PORTRAIT: "live_portrait", // LivePortrait video generation
  NO_EXPIRY: "no_expiry", // Credits never expire
  PRIORITY_SUPPORT: "priority_support", // Priority support
  // 增强功能
  RESTORATION: "restoration", // Image restoration
  SUPER_RESOLUTION: "super_resolution", // Super resolution
} as const;

// 定义每个套餐包含的功能
const PACKAGE_FEATURES = {
  basic: [
    AVAILABLE_FEATURES.BASIC_CREDITS,
    AVAILABLE_FEATURES.IMAGE_PROCESSING,
    AVAILABLE_FEATURES.COLORIZATION,
    AVAILABLE_FEATURES.NO_EXPIRY,
  ],
  popular: [
    AVAILABLE_FEATURES.BASIC_CREDITS,
    AVAILABLE_FEATURES.IMAGE_PROCESSING,
    AVAILABLE_FEATURES.COLORIZATION,
    AVAILABLE_FEATURES.RESTORATION,
    AVAILABLE_FEATURES.ENHANCEMENT,
    AVAILABLE_FEATURES.NO_EXPIRY,
    AVAILABLE_FEATURES.PRIORITY_SUPPORT,
  ],
  professional: [
    AVAILABLE_FEATURES.BASIC_CREDITS,
    AVAILABLE_FEATURES.IMAGE_PROCESSING,
    AVAILABLE_FEATURES.COLORIZATION,
    AVAILABLE_FEATURES.RESTORATION,
    AVAILABLE_FEATURES.ENHANCEMENT,
    AVAILABLE_FEATURES.SUPER_RESOLUTION,
    AVAILABLE_FEATURES.BULK_PROCESSING,
    AVAILABLE_FEATURES.NO_EXPIRY,
    AVAILABLE_FEATURES.PRIORITY_SUPPORT,
    AVAILABLE_FEATURES.API_ACCESS,
    AVAILABLE_FEATURES.LIVE_PORTRAIT,
    AVAILABLE_FEATURES.CUSTOM_TRAINING,
  ],
  standard: [
    AVAILABLE_FEATURES.BASIC_CREDITS,
    AVAILABLE_FEATURES.IMAGE_PROCESSING,
    AVAILABLE_FEATURES.COLORIZATION,
    AVAILABLE_FEATURES.RESTORATION,
    AVAILABLE_FEATURES.NO_EXPIRY,
    AVAILABLE_FEATURES.PRIORITY_SUPPORT,
  ],
} as const;

export async function seedCreditPackageFeatures() {
  console.log("🌱 开始播种积分套餐功能数据...");

  try {
    // 检查是否已有功能数据
    const existingFeatures = await db.select().from(creditPackageFeatureTable);

    if (existingFeatures.length > 0) {
      console.log("⚠️  积分套餐功能数据已存在，跳过播种");
      return;
    }

    // 获取所有套餐
    const packages = await db.select().from(creditPackageTable);

    if (packages.length === 0) {
      console.log("❌ 未找到积分套餐数据，请先运行积分套餐种子数据");
      return;
    }

    // 为每个套餐创建功能数据
    const featureData: {
      featureKey: string;
      id: string;
      isActive: boolean; // 修复: 使用boolean而不是number
      packageId: string;
      sortOrder: number;
    }[] = [];

    for (const pkg of packages) {
      // 根据套餐名称确定功能列表
      let features: readonly string[] = [];

      switch (pkg.name) {
        case "专业套餐":
          features = PACKAGE_FEATURES.professional;
          break;
        case "入门套餐":
          features = PACKAGE_FEATURES.basic;
          break;
        case "标准套餐":
          features = PACKAGE_FEATURES.standard;
          break;
        case "热门套餐":
          features = PACKAGE_FEATURES.popular;
          break;
        default:
          console.log(`⚠️  未知套餐名称: ${pkg.name}`);
          continue;
      }

      // 为每个功能创建记录
      features.forEach((featureKey, index) => {
        featureData.push({
          featureKey,
          id: cuid2.createId(),
          isActive: true, // 修复: 使用boolean而不是number
          packageId: pkg.id,
          sortOrder: index + 1,
        });
      });
    }

    // 插入功能数据
    if (featureData.length > 0) {
      await db.insert(creditPackageFeatureTable).values(featureData);
    }

    console.log(`✅ 成功插入 ${featureData.length} 个套餐功能`);
    console.log("🔧 套餐功能详情:");

    // 按套餐分组显示功能
    const packageFeatureMap = new Map<string, string[]>();
    for (const feature of featureData) {
      const pkg = packages.find((p) => p.id === feature.packageId);
      const packageName = pkg?.name || "Unknown";
      if (!packageFeatureMap.has(packageName)) {
        packageFeatureMap.set(packageName, []);
      }
      packageFeatureMap.get(packageName)!.push(feature.featureKey);
    }

    for (const [packageName, features] of packageFeatureMap) {
      console.log(`   📦 ${packageName}: ${features.length} 个功能`);
      for (const feature of features) {
        console.log(`      - ${feature}`);
      }
    }
  } catch (error) {
    console.error("❌ 积分套餐功能播种失败:", error);
    throw error;
  }
}

// 如果直接运行此文件
if (import.meta.main) {
  await seedCreditPackageFeatures();
  process.exit(0);
}

export { AVAILABLE_FEATURES, PACKAGE_FEATURES };
