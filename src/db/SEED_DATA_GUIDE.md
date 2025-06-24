# 积分套餐种子数据指南

## 概述

本指南详细说明了积分套餐系统的种子数据配置，包括套餐定义、功能特性和消费配置。所有数据都已根据pricing-plans.tsx组件的期望进行优化。

## 🏗️ 数据结构

### 1. 积分套餐 (Credit Packages)

位置：`src/db/seed/credit-packages.ts`

```typescript
interface CreditPackage {
  id: string;           // 唯一标识符
  name: string;         // 套餐名称
  credits: number;      // 积分数量
  price: number;        // 价格（美分）
  currency: string;     // 货币类型（默认: usd）
  description: string;  // 套餐描述
  isActive: boolean;    // 是否激活
  isPopular: boolean;   // 是否热门
  sortOrder: number;    // 排序顺序
}
```

### 2. 套餐功能特性 (Package Features)

位置：`src/db/seed/credit-package-features.ts`

```typescript
interface PackageFeature {
  id: string;           // 唯一标识符  
  packageId: string;    // 关联的套餐ID
  featureKey: string;   // 功能键（用于国际化）
  isActive: boolean;    // 是否激活
  sortOrder: number;    // 排序顺序
}
```

### 3. 积分消费配置 (Consumption Config)

位置：`src/db/seed/credit-consumption-config.ts`

```typescript
interface ConsumptionConfig {
  id: string;           // 唯一标识符
  actionType: string;   // 操作类型
  creditsRequired: number; // 所需积分
  description: string;  // 描述
  isActive: boolean;    // 是否激活
}
```

## 📦 套餐配置详情

### 入门套餐 (100积分 - $9.99)

- **目标用户**：偶尔使用AI功能的个人用户
- **功能特性**：
  - 基础积分包
  - 图像处理
  - 图像上色
  - 积分永不过期
- **适用场景**：约20张图片上色、15张超分辨率或25张增强处理

### 标准套餐 (300积分 - $24.99) 🔥 热门

- **目标用户**：常规使用的用户
- **功能特性**：
  - 基础积分包
  - 图像处理
  - 图像上色
  - 图像修复
  - 积分永不过期
  - 优先客服支持
- **适用场景**：约60张图片上色、45张超分辨率或75张增强处理
- **优势**：相比单次购买节省17%费用

### 热门套餐 (600积分 - $39.99)

- **目标用户**：专业用户和小团队
- **功能特性**：
  - 基础积分包
  - 图像处理
  - 图像上色
  - 图像修复
  - 图像增强
  - 积分永不过期
  - 优先客服支持
- **适用场景**：约120张图片上色、90张超分辨率或150张增强处理
- **优势**：相比单次购买节省33%费用

### 专业套餐 (1200积分 - $69.99) 👑

- **目标用户**：企业级用户
- **功能特性**：
  - 基础积分包
  - 图像处理
  - 图像上色
  - 图像修复
  - 图像增强
  - 超分辨率处理
  - 批量处理
  - 积分永不过期
  - 优先客服支持
  - API访问权限
- **适用场景**：约240张图片上色、180张超分辨率或300张增强处理
- **优势**：相比单次购买节省42%费用

## 🔧 功能特性键映射

| 功能键 | 描述 | 应用套餐 |
|--------|------|----------|
| `basic_credits` | 基础积分包 | 所有套餐 |
| `image_processing` | 图像处理 | 所有套餐 |
| `colorization` | 图像上色 | 所有套餐 |
| `no_expiry` | 积分永不过期 | 所有套餐 |
| `restoration` | 图像修复 | 标准、热门、专业 |
| `priority_support` | 优先客服支持 | 标准、热门、专业 |
| `enhancement` | 图像增强 | 热门、专业 |
| `super_resolution` | 超分辨率 | 专业 |
| `bulk_processing` | 批量处理 | 专业 |
| `api_access` | API访问 | 专业 |

## 💰 积分消费配置

| 操作类型 | 所需积分 | 描述 |
|----------|----------|------|
| `image_colorize` | 5 | 黑白图像上色 |
| `image_upscale` | 8 | 图像超分辨率 |
| `image_enhance` | 6 | 图像增强 |
| `image_restore` | 10 | 图像修复 |
| `video_generate` | 50 | LivePortrait视频生成 |

## 🚀 使用方法

### 1. 播种所有数据

```bash
# 播种所有种子数据
bun db:seed

# 或者分别播种
bun db:seed:credits    # 积分套餐
bun db:seed:features   # 套餐功能
bun db:seed:config     # 消费配置
```

### 2. 查询套餐数据

```typescript
import { getCreditPackagesWithFeatures } from "~/lib/queries/credit-packages";

// 获取所有激活的套餐（包含功能特性）
const packages = await getCreditPackagesWithFeatures();

// 获取热门套餐
const popularPackage = await getPopularCreditPackage();
```

### 3. 在组件中使用

```typescript
import { PricingPlans } from "~/ui/components/pricing/pricing-plans";
import { getCreditPackagesWithFeatures } from "~/lib/queries/credit-packages";

export default async function PricingPage() {
  const packages = await getCreditPackagesWithFeatures();
  
  return (
    <PricingPlans 
      packages={packages}
      onSelectPlan={(plan) => {
        // 处理套餐选择
      }}
    />
  );
}
```

## ✅ 数据验证

### 检查套餐数据

- [ ] 所有套餐都有正确的布尔值类型（isActive, isPopular）
- [ ] 价格以美分为单位存储
- [ ] 套餐按sortOrder正确排序
- [ ] 热门标签只标记在一个套餐上

### 检查功能特性

- [ ] 每个套餐都有对应的功能特性记录
- [ ] 功能键与国际化文件中的键匹配
- [ ] 功能特性按sortOrder正确排序

### 检查消费配置

- [ ] 所有AI操作都有对应的积分消费配置
- [ ] 积分消费量合理（不会太高或太低）
- [ ] 配置项都处于激活状态

## 🔄 与前端集成

### PricingPlans组件兼容性

- ✅ 支持DatabasePackage接口（现在是CreditPackageWithFeatures）
- ✅ 自动处理功能特性翻译
- ✅ 支持原价计算和折扣显示
- ✅ 提供回退数据以防数据库为空

### 国际化支持

所有功能特性键都设计为与next-intl兼容：

```json
// messages/zh.json
{
  "Pricing": {
    "features": {
      "basic_credits": "{credits} 积分",
      "image_processing": "图像处理",
      "colorization": "图像上色",
      "no_expiry": "积分永不过期"
    }
  }
}
```

## 📈 扩展指南

### 添加新套餐

1. 在`credit-packages.ts`中添加套餐数据
2. 在`credit-package-features.ts`中定义功能映射
3. 在`pricing-plans.tsx`中添加图标映射（如需要）
4. 更新国际化文件

### 添加新功能特性

1. 在`AVAILABLE_FEATURES`中定义新键
2. 在相应套餐的`PACKAGE_FEATURES`中添加
3. 在国际化文件中添加翻译

### 修改消费配置

1. 在`credit-consumption-config.ts`中添加或修改配置
2. 确保与实际AI操作逻辑匹配

---

*数据更新后，请确保运行相应的种子脚本并验证前端显示效果。*
