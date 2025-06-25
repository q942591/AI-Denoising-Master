# 🎨 Relivator - AI图像处理平台

[演示](http://localhost:3002) — [GitHub](https://github.com/blefnk/relivator) — [文档](https://deepwiki.com/blefnk/relivator-nextjs-template)

> **Relivator** 是一个先进的AI图像处理平台，专注于图像去噪、增强和修复。基于Next.js构建，提供专业级的图像处理服务。

## ✨ 核心功能

### 🖼️ 图像处理

- **AI图像去噪** - 智能去除图像噪点和模糊
- **图像增强** - 提升图像清晰度和质量
- **实时对比** - 拖拽式前后效果对比
- **批量处理** - 支持多张图片同时处理

### 🎯 用户体验

- **图像对比滑动器** - 直观展示处理效果
- **实时预览** - 即时查看处理结果
- **进度追踪** - 详细的处理进度显示
- **响应式设计** - 完美适配所有设备

### 💎 示例展示

- **人像处理** - 专业人像图像优化
- **风景增强** - 自然风光质量提升
- **老照片修复** - 复古照片清晰化
- **多场景支持** - 室内外各种场景

## 🛠️ 技术栈

### 🧱 核心框架

- **[Next.js 15.3](https://nextjs.org)** - React全栈框架
- **[React 19.1](https://react.dev)** - 用户界面库
- **[TypeScript 5.8](https://typescriptlang.org)** - 类型安全

### 🎨 用户界面

- **[Tailwind CSS 4.1](https://tailwindcss.com)** - 原子化CSS框架
- **[Shadcn/ui](https://ui.shadcn.com)** - 组件库
- **[Lucide Icons](https://lucide.dev)** - 图标系统
- **[Framer Motion](https://framer.com/motion)** - 动画库

### 🔐 认证与数据

- **[Supabase Auth](https://supabase.com/auth)** - 用户认证
- **[Drizzle ORM](https://orm.drizzle.team)** - 数据库ORM
- **[PostgreSQL](https://postgresql.org)** - 关系型数据库
- **[Supabase Storage](https://supabase.com/storage)** - 文件存储

### 💳 支付与订阅

- **[Stripe](https://stripe.com)** - 支付处理
- **订阅管理** - 灵活的套餐系统
- **积分系统** - 基于使用量的计费

### 🌐 国际化与部署

- **[Next-intl](https://next-intl.dev)** - 国际化支持
- **[Vercel](https://vercel.com)** - 部署平台
- **PWA支持** - 渐进式Web应用

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Bun 或 npm/yarn
- PostgreSQL数据库

### 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/blefnk/relivator.git
   cd relivator
   ```

2. **安装依赖**

   ```bash
   bun install
   # 或者
   npm install
   ```

3. **配置环境变量**

   ```bash
   cp .env.example .env
   ```

   配置以下必需的环境变量：

   ```env
   # 数据库配置
   DATABASE_URL="your_postgresql_url"
   
   # Supabase配置
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   
   # Stripe配置
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="your_webhook_secret"
   
   # AI服务配置（可选）
   DASHSCOPE_API_KEY="your_dashscope_api_key"
   ```

4. **初始化数据库**

   ```bash
   bun db:push
   bun db:seed
   ```

5. **启动开发服务器**

   ```bash
   bun dev
   ```

6. **打开浏览器**
   访问 [http://localhost:3000](http://localhost:3000)

## 📋 可用命令

| 命令 | 描述 |
|------|------|
| `bun dev` | 启动开发服务器 |
| `bun build` | 构建生产版本 |
| `bun start` | 启动生产服务器 |
| `bun db:push` | 应用数据库架构变更 |
| `bun db:studio` | 打开数据库可视化编辑器 |
| `bun db:seed` | 填充示例数据 |
| `bun db:migrate:users` | 迁移用户数据 |
| `bun db:migrate:schema` | 迁移数据库架构 |
| `bun ui` | 添加shadcn组件 |
| `bun check` | 运行类型检查和代码检查 |

## 🎯 项目结构

```
src/
├── app/                    # Next.js应用路由
│   ├── api/               # API路由
│   ├── auth/              # 认证页面
│   ├── examples/          # 示例展示页面
│   ├── generate/          # 图像处理页面
│   ├── pricing/           # 定价页面
│   └── profile/           # 用户资料页面
├── components/            # 共享组件
├── db/                    # 数据库配置和架构
├── lib/                   # 工具函数和配置
├── ui/                    # UI组件库
├── types/                 # TypeScript类型定义
└── utils/                 # 通用工具函数
```

## 🔧 核心功能配置

### 图像对比组件

```typescript
import { ImageComparisonSlider } from "~/ui/components/image-comparison-slider";

<ImageComparisonSlider
  beforeImage="original_image_url"
  afterImage="processed_image_url"
  beforeLabel="处理前"
  afterLabel="处理后"
  dragToCompareText="拖拽对比效果"
  improvement="92%"
/>
```

### 认证配置

项目使用Supabase进行用户认证，支持：

- 邮箱/密码登录
- OAuth登录（Google等）
- 会话管理
- 权限控制

### 支付集成

集成Stripe支付系统：

- 订阅套餐管理
- 一次性支付
- 积分系统
- 发票和收据

## 🎨 界面特色

### 现代化设计

- **渐变色彩** - 蓝紫粉科技渐变
- **毛玻璃效果** - 现代视觉体验
- **动态动画** - 流畅的交互动效
- **响应式布局** - 完美适配所有设备

### 图标系统

- **SVG图标** - 矢量图标支持无限缩放
- **多平台适配** - 支持所有浏览器和设备
- **PWA支持** - 可安装的Web应用
- **品牌一致性** - 统一的视觉形象

## 🌍 国际化

项目支持多语言：

- **中文（简体）** - 默认语言
- **英文** - 完整翻译
- **可扩展** - 易于添加新语言

翻译文件位于 `messages/` 目录：

```
messages/
├── zh.json    # 中文翻译
└── en.json    # 英文翻译
```

## 📊 数据模型

### 用户系统

- 用户信息管理
- 积分系统
- 处理历史
- 订阅状态

### 图像处理

- 上传记录
- 处理任务
- 结果存储
- 使用统计

### 支付系统

- 订阅管理
- 交易记录
- 发票系统
- 退款处理

## 🔐 安全特性

- **CSRF保护** - 跨站请求伪造防护
- **XSS防护** - 跨站脚本攻击防护
- **SQL注入防护** - 参数化查询
- **文件上传安全** - 类型和大小验证
- **访问控制** - 基于角色的权限管理

## 🚀 部署指南

### Vercel部署（推荐）

1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 自定义部署

1. 构建项目：`bun build`
2. 启动服务：`bun start`
3. 配置反向代理（Nginx等）

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 打开Pull Request

## 📄 许可证

MIT © 2025 [Nazar Kornienko (blefnk)](https://github.com/blefnk), [Reliverse](https://github.com/reliverse)

## 🌟 支持项目

如果这个项目对你有帮助，请考虑：

- ⭐ [给项目加星](https://github.com/blefnk/relivator)
- 🐛 [报告问题](https://github.com/blefnk/relivator/issues)
- 💡 [提出建议](https://github.com/blefnk/relivator/discussions)
- 🦄 [赞助开发](https://github.com/sponsors/blefnk)

## 🔗 相关链接

- [Reliverse生态系统](https://github.com/reliverse)
- [Versator项目](https://github.com/blefnk/versator)
- [项目文档](https://docs.reliverse.org)
- [社区Discord](https://discord.gg/Pb8uKbwpsJ)

---

<div align="center">
  <p>用 ❤️ 打造的AI图像处理平台</p>
  <p>让每张图片都更精彩</p>
</div>
