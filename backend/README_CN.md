# Prompt Studio API

一个强大的 AI 提示词管理后端 API，支持提示词管理、集合组织和模型配置。使用 Fastify、TypeScript、Prisma 和 PostgreSQL 构建。

## 功能特性

### 核心功能
- **提示词管理**: 创建、编辑和组织提示词，支持版本控制
- **集合管理**: 将相关提示词组织到集合中
- **分享功能**: 使用短代码和可选密码保护分享提示词
- **模型管理**: 众包式 AI 模型目录，支持多个提供商
- **用户认证**: 支持邮箱/密码和 OAuth（Google、GitHub）认证
- **版本控制**: 跟踪提示词变更的详细历史记录

### 技术特性
- 基于 Fastify 的 RESTful API
- PostgreSQL 数据库配合 Prisma ORM
- 基于 JWT 的认证系统，支持刷新令牌
- 请求限流和安全响应头
- 请求日志和错误处理
- Docker 支持，多阶段构建
- 健康检查端点

## 技术栈

- **运行时**: Node.js 20+
- **框架**: Fastify 4.x
- **语言**: TypeScript
- **数据库**: PostgreSQL 16
- **ORM**: Prisma 5.x
- **缓存**: Redis 7（可选）
- **认证**: @fastify/jwt
- **验证**: Zod

## 环境要求

- Node.js 20 或更高版本
- PostgreSQL 16 或更高版本
- Redis 7（可选，用于缓存）
- npm 或 yarn

## 快速开始

### 1. 克隆并安装

```bash
# 安装依赖
npm install
```

### 2. 环境配置

复制示例环境文件并配置：

```bash
cp .env.example .env
```

更新 `.env` 配置：

```env
# 服务器
PORT=3001
NODE_ENV=development

# 数据库
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/prompt_studio?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 或运行迁移（生产环境推荐）
npm run db:migrate
```

### 4. 运行应用

```bash
# 开发模式（支持热重载）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

API 将在 `http://localhost:3001` 可用

## Docker 部署

### 使用 Docker Compose（推荐）

最简单的运行整个技术栈的方式：

```bash
# 启动所有服务（API + PostgreSQL + Redis + Adminer）
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止所有服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

服务地址：
- **API**: http://localhost:3001
- **Adminer**（数据库管理界面）: http://localhost:8080（使用 `--profile tools` 启用）
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Docker Compose 包含工具

启动包含数据库管理工具的完整环境：

```bash
docker-compose --profile tools up -d
```

### 开发模式

用于支持热重载的开发环境：

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 构建 Docker 镜像

```bash
# 构建镜像
docker build -t prompt-studio-api .

# 运行容器
docker run -p 3001:3001 --env-file .env prompt-studio-api
```

## 项目结构

```
prompt-studio-api/
├── src/
│   ├── app.ts                 # 应用入口
│   ├── config/                # 配置文件
│   │   ├── index.ts           # 集中配置
│   │   └── database.ts        # 数据库配置
│   ├── middlewares/           # 自定义中间件
│   │   ├── errorHandler.ts   # 全局错误处理
│   │   ├── rateLimit.ts       # 请求限流
│   │   ├── requestLogger.ts   # 请求日志
│   │   └── security.ts        # 安全响应头
│   ├── modules/               # 功能模块
│   │   ├── auth/              # 认证
│   │   ├── prompts/           # 提示词管理
│   │   ├── collections/       # 集合管理
│   │   ├── shares/            # 分享功能
│   │   └── models/            # AI 模型管理
│   ├── types/                 # TypeScript 类型定义
│   └── utils/                 # 工具函数
├── prisma/
│   ├── schema.prisma          # 数据库模式
│   ├── migrations/            # 数据库迁移
│   └── seed.ts                # 数据库种子
├── scripts/
│   └── init-db.sql            # 数据库初始化
├── Dockerfile                 # 生产环境 Docker 镜像
├── docker-compose.yml         # 生产环境 compose 文件
├── docker-compose.dev.yml     # 开发环境 compose 文件
└── .dockerignore              # Docker 忽略模式
```

## API 端点

### 健康检查和信息
- `GET /` - API 信息
- `GET /health` - 健康检查

### 认证
- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 邮箱/密码登录
- `POST /api/auth/refresh` - 刷新访问令牌
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### 提示词
- `GET /api/prompts` - 列出提示词
- `POST /api/prompts` - 创建提示词
- `GET /api/prompts/:id` - 获取提示词详情
- `PUT /api/prompts/:id` - 更新提示词
- `DELETE /api/prompts/:id` - 删除提示词
- `GET /api/prompts/:id/versions` - 获取提示词版本
- `POST /api/prompts/:id/versions` - 创建新版本

### 集合
- `GET /api/collections` - 列出集合
- `POST /api/collections` - 创建集合
- `GET /api/collections/:id` - 获取集合详情
- `PUT /api/collections/:id` - 更新集合
- `DELETE /api/collections/:id` - 删除集合

### 分享
- `POST /api/shares` - 创建分享链接
- `GET /api/shares/:code` - 获取分享的提示词
- `DELETE /api/shares/:id` - 删除分享

### 模型
- `GET /api/models/providers` - 列出 AI 模型提供商
- `GET /api/models` - 列出 AI 模型
- `POST /api/models/providers` - 添加新提供商（需认证）
- `POST /api/models` - 添加新模型（需认证）

## 数据库模式

### 核心模型
- **User**: 用户账户，支持 OAuth
- **RefreshToken**: JWT 刷新令牌
- **VerificationToken**: 邮箱验证和密码重置令牌
- **Prompt**: 提示词定义和配置
- **PromptVersion**: 提示词版本历史
- **Collection**: 提示词集合/文件夹
- **Share**: 可分享的提示词链接
- **ModelProvider**: AI 模型提供商（OpenAI、Anthropic 等）
- **Model**: AI 模型，包含功能和定价

查看 `prisma/schema.prisma` 了解完整的模式定义。

## 开发

### 数据库管理

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送模式变更（开发环境）
npm run db:push

# 创建迁移
npm run db:migrate

# 打开 Prisma Studio（图形界面）
npm run db:studio
```

### 脚本命令

- `npm run dev` - 启动开发服务器（支持热重载）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run db:generate` - 生成 Prisma 客户端
- `npm run db:push` - 推送模式到数据库
- `npm run db:migrate` - 运行数据库迁移
- `npm run db:studio` - 打开 Prisma Studio

## 环境变量

查看 `.env.example` 了解所有可用的环境变量。

### 必需变量
- `DATABASE_URL` - PostgreSQL 连接字符串
- `JWT_SECRET` - JWT 令牌的密钥（最少 32 字符）

### 可选变量
- `REDIS_URL` - Redis 连接字符串（用于缓存）
- `GOOGLE_CLIENT_ID` - Google OAuth 客户端 ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth 客户端密钥
- `GITHUB_CLIENT_ID` - GitHub OAuth 客户端 ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth 客户端密钥
- `CORS_ORIGIN` - 允许的 CORS 源

## 安全特性

- 所有端点的请求限流
- 安全响应头（HSTS、CSP 等）
- 基于 JWT 的认证，支持刷新令牌
- 使用 bcrypt 进行密码哈希
- CORS 保护
- 使用 Zod 进行请求验证
- SQL 注入保护（Prisma）
- XSS 保护

## 性能优化

- 多阶段 Docker 构建，减小镜像体积
- 数据库连接池
- 索引优化的数据库查询
- 高效的 JSON 序列化
- 可选的 Redis 缓存

## 监控

### 健康检查

```bash
curl http://localhost:3001/health
```

响应：
```json
{
  "status": "ok",
  "timestamp": "2024-12-17T12:00:00.000Z",
  "uptime": 123.456,
  "memory": {
    "rss": 50000000,
    "heapTotal": 30000000,
    "heapUsed": 20000000,
    "external": 1000000
  }
}
```

### 日志

应用使用 Pino 进行结构化日志记录：
- 开发环境：美化输出的日志
- 生产环境：JSON 格式日志，便于日志聚合

## 故障排除

### 数据库连接问题

```bash
# 检查 PostgreSQL 是否运行
docker-compose ps postgres

# 查看 PostgreSQL 日志
docker-compose logs postgres

# 测试数据库连接
psql postgresql://postgres:postgres123@localhost:5432/prompt_studio
```

### 端口已被占用

```bash
# 在 .env 中更改端口
PORT=3002

# 或在 docker-compose.yml 中使用不同端口
API_PORT=3002
```

### Prisma 问题

```bash
# 重置数据库（警告：删除所有数据）
npx prisma migrate reset

# 重新生成 Prisma 客户端
npm run db:generate
```

## 生产部署

### 环境检查清单
- [ ] 设置强密码的 `JWT_SECRET`（至少 32 字符）
- [ ] 配置生产数据库 URL
- [ ] 设置 `NODE_ENV=production`
- [ ] 配置 CORS 源
- [ ] 设置 SSL/TLS
- [ ] 配置适当的日志
- [ ] 设置数据库备份
- [ ] 配置 Redis 缓存
- [ ] 设置监控和告警

### 数据库迁移

```bash
# 在生产环境运行迁移
npm run db:migrate

# 或直接使用 Prisma
npx prisma migrate deploy
```

### Docker 生产部署

```bash
# 构建生产镜像
docker build -t prompt-studio-api:latest .

# 使用生产环境配置运行
docker run -d \
  --name prompt-studio-api \
  -p 3001:3001 \
  --env-file .env.production \
  prompt-studio-api:latest
```

## 贡献

欢迎贡献！请遵循以下指南：
1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 编写或更新测试
5. 提交 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 支持

如有问题和疑问：
- GitHub Issues: [创建 Issue](https://github.com/yourusername/prompt-studio-api/issues)
- 文档：查看 `/docs` 文件夹了解详细文档

## 路线图

- [ ] GraphQL API 支持
- [ ] WebSocket 支持实时更新
- [ ] 使用 Elasticsearch 的高级搜索
- [ ] 提示词模板市场
- [ ] 团队协作功能
- [ ] 按用户的 API 速率限制
- [ ] 分析和使用统计
- [ ] 提示词测试和评估工具

## 致谢

使用以下技术构建：
- [Fastify](https://fastify.io/) - 快速且低开销的 Web 框架
- [Prisma](https://www.prisma.io/) - 下一代 ORM
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的类型化超集
- [PostgreSQL](https://www.postgresql.org/) - 强大的开源数据库
