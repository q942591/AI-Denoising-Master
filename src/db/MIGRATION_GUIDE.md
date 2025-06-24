# 数据库Schema迁移指南

## 概述

本指南详细说明了如何将现有的数据库结构迁移到优化后的架构。主要目标是简化数据结构、提升性能并增强可维护性。

## 🎯 迁移目标

### 1. 用户系统优化

- **删除冗余表**：移除与Supabase Auth重复的认证相关表
- **简化用户表**：只保留业务扩展字段
- **完全集成**：与Supabase Auth无缝集成

### 2. 积分系统重构

- **表数量优化**：从5个表减少到3个表
- **统一交易流程**：所有积分操作记录在统一的交易表中
- **实时计算**：用户余额改为实时计算

### 3. 数据类型优化

- **类型改进**：boolean替代integer，varchar限制长度
- **元数据存储**：使用jsonb存储结构化数据

## 📊 主要变更详情

### 用户系统变更

#### 删除的表

```sql
-- 这些表的功能现在由Supabase Auth处理
❌ sessionTable
❌ accountTable  
❌ verificationTable
❌ twoFactorTable
```

#### 保留的表（简化）

```sql
✅ userTable - 只包含业务扩展字段：
  - id (Supabase Auth用户ID)
  - displayName
  - bio
  - preferredLocale
  - theme
  - isActive
  - lastLoginAt
  - totalUploads
  - totalCreditsUsed
  - createdAt
  - updatedAt
```

### 积分系统变更

#### 删除的表

```sql
❌ userCreditBalanceTable - 改为实时计算
❌ creditRechargeTable - 合并到交易表
```

#### 优化的表

```sql
✅ creditTransactionTable - 统一所有积分操作：
  - 扩展交易类型：purchase, consumption, bonus, adjustment
  - 添加支付字段：paymentIntentId, paymentMethod, paymentAmount
  - 优化数据类型：boolean替代integer
```

### 上传系统增强

```sql
✅ uploadsTable - 添加完整元数据：
  - fileName, fileSize, mimeType
  - status: uploading, completed, failed, processing
  - 扩展媒体类型支持
```

## 🚀 执行步骤

### 步骤1：备份现有数据

```bash
# 备份数据库（请根据实际情况调整）
pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 步骤2：运行迁移脚本

```bash
# 查看用户迁移指南
bun db:migrate:users

# 查看Schema迁移指南  
bun db:migrate:schema
```

### 步骤3：同步数据库结构

```bash
# 推送新的schema到数据库
bun db:push

# 或者生成迁移文件
bun db:generate
bun db:migrate
```

### 步骤4：数据迁移（如需要）

#### 迁移充值记录到交易表

```sql
-- 示例SQL：将旧的充值记录迁移到新的交易表
INSERT INTO credit_transaction (
  id, user_id, type, amount, status, description,
  payment_intent_id, payment_method, payment_amount, currency,
  created_at, updated_at
)
SELECT 
  id,
  user_id,
  'purchase' as type,
  amount,
  status,
  CONCAT('迁移的充值记录: ', amount, ' 积分') as description,
  payment_intent_id,
  payment_method,
  price as payment_amount,
  currency,
  created_at,
  updated_at
FROM credit_recharge
WHERE NOT EXISTS (
  SELECT 1 FROM credit_transaction ct 
  WHERE ct.related_entity_id = credit_recharge.id
);
```

## ✅ 验证清单

### 用户系统验证

- [ ] Supabase Auth登录正常工作
- [ ] 用户扩展信息可以正确读取和更新
- [ ] 新用户注册流程正常
- [ ] 用户权限和角色功能正常

### 积分系统验证

- [ ] 积分余额计算准确
- [ ] 充值流程正常工作
- [ ] 积分消费记录正确
- [ ] 交易历史查询正常

### 上传系统验证

- [ ] 文件上传功能正常
- [ ] 文件元数据正确记录
- [ ] 文件状态追踪准确
- [ ] 媒体类型识别正确

## 📈 预期收益

### 性能提升

- **查询优化**：减少表连接，提高查询效率
- **存储优化**：删除冗余数据，节省存储空间
- **索引优化**：更清晰的数据关系，更好的索引策略

### 维护性提升

- **代码简化**：统一的数据模型和查询逻辑
- **调试便利**：清晰的数据流和错误追踪
- **文档完善**：完整的迁移记录和使用指南

### 扩展性提升

- **灵活架构**：易于添加新的交易类型和功能
- **统一接口**：一致的API设计和数据访问模式
- **未来兼容**：为后续功能扩展预留空间

## ⚠️ 注意事项

### 重要提醒

1. **数据备份**：迁移前必须完整备份数据库
2. **逐步迁移**：建议分阶段进行，而非一次性全部更新
3. **测试验证**：在生产环境部署前充分测试
4. **监控观察**：部署后密切监控系统性能和错误

### 常见问题

1. **用户认证**：确保所有用户已在Supabase Auth中注册
2. **积分余额**：迁移后需要验证积分余额的准确性
3. **API更新**：相关的API端点可能需要更新
4. **前端适配**：前端代码可能需要调整以适应新的数据结构

## 📞 支持

如果在迁移过程中遇到问题，请：

1. 检查迁移日志和错误信息
2. 参考相关文档和代码注释
3. 在测试环境中重现问题
4. 寻求技术团队支持

---

*迁移完成后，请保留此文档作为参考，并及时更新相关的开发文档。*
