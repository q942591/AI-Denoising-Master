# 用户Schema重构说明

## 重构概述

这次重构将用户认证系统从自定义实现迁移到完全依赖Supabase Auth，大幅简化了用户表结构并删除了冗余的认证相关表。

## 主要变更

### 🗑️ 删除的表

以下表已完全删除，因为Supabase Auth已经提供了这些功能：

- `sessionTable` - 会话管理由Supabase处理
- `accountTable` - OAuth和本地账户由Supabase管理
- `verificationTable` - 邮箱验证由Supabase管理
- `twoFactorTable` - MFA由Supabase支持

### 🔄 简化的用户表

新的`userTable`只包含业务特定的扩展字段：

```typescript
{
  // 基础字段
  id: string (主键，对应Supabase Auth用户ID)
  createdAt: timestamp
  updatedAt: timestamp
  
  // 业务扩展字段
  displayName?: string    // 用户显示名称
  bio?: string           // 用户简介
  
  // 用户偏好
  preferredLocale: string // 偏好语言 (默认: "en")
  theme: string          // 主题偏好 (默认: "system")
  
  // 业务状态
  isActive: number       // 账户激活状态 (默认: 1)
  lastLoginAt?: timestamp // 最后登录时间
  
  // 统计信息
  totalUploads: number      // 总上传次数 (默认: 0)
  totalCreditsUsed: number  // 总积分使用量 (默认: 0)
}
```

### 📊 Supabase Auth管理的字段

以下字段现在由Supabase Auth表管理，不再存储在我们的自定义表中：

- `email` - 用户邮箱
- `emailVerified` - 邮箱验证状态
- `name` - 用户姓名
- `image/avatar` - 用户头像
- `createdAt` - 账户创建时间（Auth维度）
- `lastSignIn` - 最后登录时间（Auth维度）

## 新的API设计

### 类型定义

```typescript
// 用户扩展信息（我们的数据库）
type UserProfile = InferSelectModel<typeof userTable>;

// 完整用户信息（Supabase Auth + 扩展信息）
interface User {
  // Supabase Auth字段
  id: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  image?: string;
  
  // 业务扩展字段
  profile?: UserProfile;
}
```

### 核心函数

```typescript
// 获取用户扩展信息
getUserProfile(userId: string): Promise<UserProfile | null>

// 创建/更新用户扩展信息
upsertUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null>

// 合并Supabase用户和扩展信息
mergeSupabaseUserWithProfile(supabaseUser: SupabaseUser, profile: UserProfile | null): User

// 获取完整用户信息
getFullUser(supabaseUser: SupabaseUser): Promise<User>

// 更新统计信息
incrementUserStats(userId: string, stats: { uploadsIncrement?: number; creditsUsedIncrement?: number }): Promise<void>

// 更新最后登录时间
updateLastLogin(userId: string): Promise<void>
```

## 迁移步骤

### 1. 运行迁移脚本

```bash
# 检查现有数据和验证新表结构
bun db:migrate:users
```

### 2. 同步数据库结构

```bash
# 删除旧表，创建新表结构
bun db:push
```

### 3. 验证功能

确保以下功能正常工作：

- ✅ Supabase Auth登录/注册
- ✅ 用户扩展信息读写
- ✅ 其他表的用户关联（credits、uploads等）

## 使用示例

### 在组件中获取用户信息

```typescript
// 客户端组件
import { useCurrentUser } from "~/lib/auth-client";

function UserProfile() {
  const { user } = useCurrentUser();
  // user 包含 Supabase Auth 信息
  
  // 获取扩展信息需要额外查询
  const profile = await getUserProfile(user.id);
}

// 服务端组件
import { getCurrentUser } from "~/lib/auth";
import { getFullUser } from "~/lib/queries/users";

async function ServerUserProfile() {
  const supabaseUser = await getCurrentUser();
  if (!supabaseUser) return null;
  
  const fullUser = await getFullUser(supabaseUser);
  // fullUser 包含完整的用户信息
}
```

### 更新用户信息

```typescript
// 更新用户扩展信息
await upsertUserProfile(userId, {
  displayName: "新的显示名称",
  bio: "用户简介",
  preferredLocale: "zh",
  theme: "dark"
});

// 增加统计信息
await incrementUserStats(userId, {
  uploadsIncrement: 1,
  creditsUsedIncrement: 5
});
```

## 注意事项

1. **认证完全依赖Supabase** - 所有登录、注册、密码重置等操作都通过Supabase Auth API
2. **用户ID一致性** - 我们的`userTable.id`必须与Supabase Auth的`user.id`保持一致
3. **扩展信息按需创建** - 用户在Supabase Auth注册后，扩展信息可以按需创建
4. **向后兼容** - 现有的业务逻辑可以通过新的API函数平滑迁移

## 优势

- ✅ **减少冗余** - 删除了重复的认证相关表和字段
- ✅ **提升安全性** - 认证安全由Supabase专业团队维护
- ✅ **简化维护** - 不再需要维护复杂的认证逻辑
- ✅ **更好的扩展性** - 专注于业务特定的用户数据
- ✅ **降低复杂度** - 数据库结构更加清晰简洁
