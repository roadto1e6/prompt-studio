# Prompt Studio API

Prompt Studio 后端 API，基于 Fastify + TypeScript + Prisma 构建。

## 技术栈

- **Fastify 4** - 高性能 Web 框架
- **TypeScript 5** - 类型安全
- **Prisma 5** - 数据库 ORM
- **PostgreSQL 16** - 主数据库
- **Redis 7** - 缓存
- **Zod** - 请求验证
- **JWT** - 认证
- **bcrypt** - 密码加密

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 生成 Prisma 客户端
npm run db:generate

# 同步数据库结构
npm run db:push

# 启动开发服务器
npm run dev
```

开发服务器运行在 `http://localhost:3001`

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (热重载) |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run db:generate` | 生成 Prisma 客户端 |
| `npm run db:push` | 同步数据库结构 |
| `npm run db:studio` | 打开 Prisma Studio |
| `npm run db:migrate` | 运行数据库迁移 |

## 项目结构

```
src/
├── app.ts              # 应用入口
├── config/             # 配置
│   └── index.ts
│
├── middlewares/        # 中间件
│   ├── auth.ts         # JWT 认证
│   └── error.ts        # 错误处理
│
├── modules/            # 功能模块
│   ├── auth/           # 认证模块
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts
│   │   └── auth.service.ts
│   │
│   ├── prompts/        # 提示词模块
│   │   ├── prompt.routes.ts
│   │   ├── prompt.schema.ts
│   │   └── prompt.service.ts
│   │
│   ├── collections/    # 集合模块
│   │   ├── collection.routes.ts
│   │   ├── collection.schema.ts
│   │   └── collection.service.ts
│   │
│   ├── shares/         # 分享模块
│   │   ├── share.routes.ts
│   │   ├── share.schema.ts
│   │   └── share.service.ts
│   │
│   └── models/         # AI 模型模块
│       ├── model.routes.ts
│       ├── model.schema.ts
│       └── model.service.ts
│
├── types/              # 类型定义
│   └── index.ts
│
└── utils/              # 工具函数
    └── index.ts

prisma/
├── schema.prisma       # 数据库 Schema
└── migrations/         # 迁移文件
```

## API 端点

| 模块 | 前缀 | 说明 |
|------|------|------|
| Health | `/health` | 健康检查 |
| Auth | `/api/auth` | 认证 (登录、注册、OAuth) |
| Prompts | `/api/prompts` | 提示词 CRUD |
| Collections | `/api/collections` | 集合管理 |
| Shares | `/api/shares` | 分享功能 |
| Models | `/api/models` | AI 模型目录 |

### 认证端点

```
POST   /api/auth/register     # 注册
POST   /api/auth/login        # 登录
POST   /api/auth/refresh      # 刷新 Token
POST   /api/auth/logout       # 登出
GET    /api/auth/me           # 获取当前用户
GET    /api/auth/google       # Google OAuth
GET    /api/auth/github       # GitHub OAuth
```

### 提示词端点

```
GET    /api/prompts           # 获取列表
POST   /api/prompts           # 创建
GET    /api/prompts/:id       # 获取详情
PUT    /api/prompts/:id       # 更新
DELETE /api/prompts/:id       # 删除
POST   /api/prompts/:id/versions  # 创建版本
```

### 集合端点

```
GET    /api/collections       # 获取列表
POST   /api/collections       # 创建
GET    /api/collections/:id   # 获取详情
PUT    /api/collections/:id   # 更新
DELETE /api/collections/:id   # 删除
```

### 分享端点

```
POST   /api/shares            # 创建分享
GET    /api/shares/:code      # 获取分享内容
POST   /api/shares/:code/verify  # 验证密码
GET    /api/shares/my         # 我的分享列表
DELETE /api/shares/:id        # 删除分享
```

## 环境变量

参考 `.env.example` 配置：

```env
# 服务器配置
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# 数据库
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/prompt_studio?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=redis123

# JWT (至少 32 字符)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# OAuth - Google (可选)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# OAuth - GitHub (可选)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback

# 前端地址 (OAuth 回调用)
FRONTEND_URL=http://localhost:5173
```

## Docker 部署

后端容器启动时会自动执行数据库迁移 (`prisma db push`)。

详见 [主 README](../README.md) 的 Docker 部署章节。
