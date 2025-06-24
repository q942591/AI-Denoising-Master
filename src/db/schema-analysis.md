# 数据库Schema分析报告

## 📊 整体架构概览

当前数据库包含以下主要模块：

- **用户系统** (`users`) - 已优化，与Supabase Auth集成
- **积分系统** (`credits`) - 5个表，较为复杂
- **通知系统** (`notifications`) - 1个表，设计合理
- **支付系统** (`payments`) - 2个表，与积分系统有重叠
- **上传系统** (`uploads`) - 1个表，设计简洁
- **生成系统** (`generations`) - 1个表，与积分系统关联

## 🔍 发现的问题

### 1. 积分系统过度设计 🚨

**问题：** 积分系统包含5个表，存在功能重叠和冗余

```
❌ 当前结构：
- userCreditBalanceTable (用户积分余额) 
- creditTransactionTable (积分交易记录)
- creditRechargeTable (积分充值记录) ← 冗余
- creditPackageTable (积分套餐)
- creditPackageFeatureTable (套餐功能)
```

**具体问题：**

- `creditRechargeTable` 与 `creditTransactionTable` 功能重叠
- `userCreditBalanceTable` 中的统计字段可以通过交易记录计算得出
- 积分充值既记录在 `creditRechargeTable` 又记录在 `creditTransactionTable`

### 2. 支付系统与积分系统分离 ⚠️

**问题：** 支付系统独立存在，与积分充值逻辑分离

```
❌ 当前状态：
payments/
├── stripeCustomerTable
└── stripeSubscriptionTable

credits/
└── creditRechargeTable (包含支付信息)
```

**具体问题：**

- 支付信息分散在两个模块
- 积分充值表重复存储支付相关字段
- 缺乏一致的支付流程追踪

### 3. 生成系统缺乏与积分的强关联 ⚠️

**问题：** 生成记录与积分交易关联较弱

```
❌ 当前关联：
userGenerateRecordsTable.transactionId -> creditTransactionTable.id
但缺乏反向关联和约束
```

### 4. 上传系统信息不完整 ⚠️

**问题：** 上传表缺乏文件大小、状态等重要字段

```
❌ 缺少字段：
- fileSize (文件大小)
- fileName (原始文件名)
- mimeType (文件MIME类型)
- status (上传状态)
```

## 🎯 优化建议

### 建议1：简化积分系统架构

**合并充值和交易记录：**

```typescript
// ✅ 优化后的积分系统 (3个表)
- creditTransactionTable (统一的交易记录)
- creditPackageTable (积分套餐)
- creditPackageFeatureTable (套餐功能)

// 🗑️ 删除冗余表：
- userCreditBalanceTable (通过交易记录计算余额)
- creditRechargeTable (合并到交易记录)
```

### 建议2：重新设计支付集成

**创建统一的支付系统：**

```typescript
// ✅ 新的支付表结构
paymentTable {
  id: string
  userId: string
  type: 'credit_purchase' | 'subscription'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  stripePaymentIntentId?: string
  relatedEntityId?: string // 关联的套餐ID或订阅ID
  metadata: json
}
```

### 建议3：增强上传表信息

```typescript
// ✅ 完善的上传表
uploadsTable {
  id: string
  userId: string
  fileName: string        // 原始文件名
  fileSize: number        // 文件大小(字节)
  mimeType: string        // MIME类型
  status: 'uploading' | 'completed' | 'failed'
  path: string           // 存储路径
  url: string            // 访问URL
  type: 'image' | 'video'
  metadata?: json        // 额外元数据
}
```

### 建议4：优化数据类型使用

**问题字段：**

- `isActive`, `isPopular` 使用 `integer` 应改为 `boolean`
- 大量 `text` 字段缺乏长度限制
- 缺少必要的索引定义

## 🚀 推荐的重构方案

### 阶段1：简化积分系统

1. **删除冗余表**
   - 删除 `userCreditBalanceTable`
   - 删除 `creditRechargeTable`

2. **增强交易表**
   - 添加支付相关字段
   - 增加更多交易类型

3. **添加计算函数**
   - 实时计算用户积分余额
   - 优化查询性能

### 阶段2：统一支付系统

1. **创建统一支付表**
2. **移除积分表中的支付字段**
3. **建立清晰的关联关系**

### 阶段3：完善业务表

1. **增强上传表字段**
2. **优化生成记录关联**
3. **添加必要索引**

## 📋 具体实施计划

### 优先级1：积分系统优化 (高优先级)

- 影响：减少表数量，提升性能
- 风险：中等 (需要数据迁移)
- 时间：1-2天

### 优先级2：支付系统重构 (中优先级)  

- 影响：统一支付流程，便于维护
- 风险：低 (新增表，不影响现有逻辑)
- 时间：1天

### 优先级3：字段类型优化 (低优先级)

- 影响：提升类型安全和性能
- 风险：低
- 时间：半天

## 🎯 预期收益

**性能提升：**

- 减少表数量 (从11个表减少到9个表)
- 减少冗余查询
- 优化积分余额计算

**维护性提升：**

- 统一的支付流程
- 清晰的数据关系
- 更好的类型安全

**扩展性提升：**

- 灵活的交易类型支持
- 统一的元数据存储
- 更好的审计追踪
