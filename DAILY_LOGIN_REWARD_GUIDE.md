# 每日登录奖励系统

## 功能概述

每日登录奖励系统为用户提供持续使用平台的激励，用户每天首次登录可获得 **5 积分** 的奖励。

## 主要特性

### 🎁 自动奖励发放

- 用户每天首次登录时自动检测并发放奖励
- 支持邮箱密码登录和 OAuth 第三方登录
- 奖励发放后会在消息中心显示通知

### 🎯 手动领取功能

- Header 右上角显示礼物图标
- 未领取奖励时会显示黄色闪烁提示点
- 点击可查看奖励状态和手动领取

### 📊 统计信息

- 显示累计登录天数
- 显示累计获得的奖励积分
- 显示上次领取日期

## 技术实现

### 1. 核心服务 (`src/lib/daily-login-reward.ts`)

- `hasReceivedDailyReward(userId)` - 检查今天是否已领取
- `grantDailyLoginReward(userId)` - 发放每日奖励
- `checkAndGrantDailyReward(userId)` - 登录流程中的自动检查
- `getDailyRewardStats(userId)` - 获取统计信息

### 2. API 端点 (`src/app/api/daily-reward/route.ts`)

- `GET /api/daily-reward` - 获取奖励统计
- `POST /api/daily-reward` - 手动领取奖励

### 3. 登录集成

- **OAuth 回调** (`src/app/auth/callback/route.ts`) - 第三方登录后自动检查
- **邮箱登录** (`src/app/api/auth/sign-in/route.ts`) - 密码登录后自动检查

### 4. UI 组件

- **每日奖励组件** (`src/ui/components/daily-reward/daily-reward-widget.tsx`)
- **Header 集成** - 已登录用户可见
- **通知系统** - 奖励发放时自动推送通知

## 数据库设计

### 积分交易记录 (`credit_transaction`)

```sql
- type: 'bonus' (奖励类型)
- description: '每日登录奖励'
- amount: 5 (积分数量)
- metadata: { rewardType: 'daily_login', date: 'YYYY-MM-DD' }
```

### 通知记录 (`notifications`)

```sql
- type: 'credit'
- title: '🎁 每日登录奖励'
- description: '恭喜您获得每日登录奖励 5 积分！明天记得再来领取哦～'
- metadata: { credits: 5, rewardType: 'daily_login' }
```

## 使用流程

### 用户视角

1. **首次登录**
   - 用户登录系统
   - 自动获得 5 积分奖励
   - 消息中心收到奖励通知

2. **查看奖励状态**
   - 点击 Header 右上角礼物图标
   - 查看今日是否已领取
   - 查看累计统计信息

3. **手动领取**
   - 如果自动发放失败
   - 可通过礼物图标手动领取
   - 防重复领取机制

### 管理员视角

1. **奖励配置**
   - 修改 `DAILY_LOGIN_REWARD.CREDITS` 调整奖励数量
   - 修改通知文案
   - 调整奖励规则

2. **统计查询**
   - 通过数据库查询用户奖励记录
   - 分析用户登录活跃度
   - 监控系统奖励发放情况

## 安全考虑

- **防重复领取** - 基于数据库记录的日期检查
- **事务安全** - 积分更新和通知创建在同一事务中
- **错误处理** - 奖励发放失败不影响登录流程
- **用户验证** - 所有 API 都需要用户认证

## 配置选项

```typescript
const DAILY_LOGIN_REWARD = {
  CREDITS: 5, // 每日奖励积分数
  DESCRIPTION: "每日登录奖励", // 交易描述
  NOTIFICATION_TITLE: "🎁 每日登录奖励",
  NOTIFICATION_DESCRIPTION: "恭喜您获得每日登录奖励 5 积分！明天记得再来领取哦～",
};
```

## 后续扩展

- 连续登录奖励递增
- 特殊节日奖励加倍
- VIP 用户奖励提升
- 邀请好友额外奖励
- 完成任务获得奖励倍数

## 故障排除

### 常见问题

1. **奖励未自动发放**
   - 检查控制台日志
   - 手动调用 API 领取
   - 确认数据库连接正常

2. **重复领取问题**
   - 检查时区设置
   - 确认日期检查逻辑
   - 查看交易记录时间戳

3. **通知未显示**
   - 检查通知系统配置
   - 确认 WebSocket 连接
   - 刷新通知列表

### 调试命令

```bash
# 查看用户今日奖励记录
curl -H "Authorization: Bearer TOKEN" /api/daily-reward

# 手动领取奖励
curl -X POST -H "Authorization: Bearer TOKEN" /api/daily-reward

# 查看控制台日志
npm run dev
```
