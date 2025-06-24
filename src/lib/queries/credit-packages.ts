import { eq } from "drizzle-orm";

import { db } from "~/db";
import {
  creditPackageFeatureTable,
  creditPackageTable,
} from "~/db/schema/credits/tables";

// 积分套餐类型（包含功能特性）
export interface CreditPackageWithFeatures {
  credits: number;
  currency: string;
  description: null | string;
  features: string[]; // 功能特性键列表
  id: string;
  isActive: boolean;
  isPopular: boolean | null;
  name: string;
  price: number;
  sortOrder: null | number;
}

/**
 * 根据ID获取单个积分套餐（包含功能特性）
 */
export async function getCreditPackageById(
  packageId: string,
): Promise<CreditPackageWithFeatures | null> {
  try {
    // 1. 获取套餐基本信息
    const [pkg] = await db
      .select()
      .from(creditPackageTable)
      .where(eq(creditPackageTable.id, packageId));

    if (!pkg) {
      return null;
    }

    // 2. 获取功能特性
    const features = await db
      .select({
        featureKey: creditPackageFeatureTable.featureKey,
      })
      .from(creditPackageFeatureTable)
      .where(eq(creditPackageFeatureTable.packageId, pkg.id))
      .orderBy(creditPackageFeatureTable.sortOrder);

    return {
      ...pkg,
      features: features.map((f) => f.featureKey),
    };
  } catch (error) {
    console.error("获取积分套餐失败:", error);
    throw error;
  }
}

/**
 * 获取所有激活的积分套餐（包含功能特性）
 */
export async function getCreditPackagesWithFeatures(): Promise<
  CreditPackageWithFeatures[]
> {
  try {
    // 1. 获取所有激活的套餐
    const packages = await db
      .select()
      .from(creditPackageTable)
      .where(eq(creditPackageTable.isActive, true))
      .orderBy(creditPackageTable.sortOrder);

    // 2. 为每个套餐获取功能特性
    const packagesWithFeatures: CreditPackageWithFeatures[] = [];

    for (const pkg of packages) {
      // 获取该套餐的所有功能特性
      const features = await db
        .select({
          featureKey: creditPackageFeatureTable.featureKey,
        })
        .from(creditPackageFeatureTable)
        .where(eq(creditPackageFeatureTable.packageId, pkg.id))
        .orderBy(creditPackageFeatureTable.sortOrder);

      packagesWithFeatures.push({
        ...pkg,
        features: features.map((f) => f.featureKey),
      });
    }

    return packagesWithFeatures;
  } catch (error) {
    console.error("获取积分套餐失败:", error);
    throw error;
  }
}

/**
 * 获取热门套餐
 */
export async function getPopularCreditPackage(): Promise<CreditPackageWithFeatures | null> {
  try {
    const [pkg] = await db
      .select()
      .from(creditPackageTable)
      .where(eq(creditPackageTable.isPopular, true))
      .limit(1);

    if (!pkg) {
      return null;
    }

    const features = await db
      .select({
        featureKey: creditPackageFeatureTable.featureKey,
      })
      .from(creditPackageFeatureTable)
      .where(eq(creditPackageFeatureTable.packageId, pkg.id))
      .orderBy(creditPackageFeatureTable.sortOrder);

    return {
      ...pkg,
      features: features.map((f) => f.featureKey),
    };
  } catch (error) {
    console.error("获取热门套餐失败:", error);
    throw error;
  }
}
