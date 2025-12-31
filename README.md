# Prompt Studio

现代化的 AI 提示词管理平台，支持版本控制、集合管理和分享功能。基于 React + TypeScript + Fastify + PostgreSQL 构建。

## 功能特性

### 核心功能
- **提示词管理**: 创建、编辑、组织和版本控制 AI 提示词
- **版本控制**: 详细的版本历史和差异对比
- **集合管理**: 自定义颜色和图标的集合分类
- **分享功能**: 短码分享、密码保护、过期时间设置
- **多语言支持**: 中英文界面切换
- **主题切换**: 深色/浅色模式无缝切换
- **模型管理**: 支持多家 AI 提供商 (OpenAI, Anthropic, Google, DeepSeek 等)

### 用户体验
- **快捷键**: 高效的键盘快捷操作
- **响应式设计**: 桌面端和移动端适配
- **实时搜索**: 即时过滤搜索
- **导入导出**: 便捷的备份和迁移
- **Markdown 预览**: 系统提示词支持 Markdown 渲染
- **全屏编辑**: 沉浸式编辑体验

### 认证系统
- **邮箱密码**: 安全的传统认证
- **OAuth**: Google 和 GitHub 登录
- **密码重置**: 安全的找回流程
- **会话管理**: 自动 Token 刷新

## 技术栈

### 前端
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **CSS Modules** 样式方案
- **Zustand** 状态管理
- **Lucide React** 图标库
- **date-fns** 日期处理

### 后端
- **Fastify 4** 高性能 Node.js 框架
- **PostgreSQL 16** 主数据库
- **Redis 7** 缓存和会话管理
- **Prisma 5** 类型安全 ORM
- **JWT** 无状态认证
- **Zod** 运行时验证

### 部署
- **Docker** + **Docker Compose** 容器化部署
- **Nginx** 反向代理和静态文件服务
- **多阶段构建** 优化镜像体积

## 项目结构

```
prompt-studio/
├── frontend/              # React 前端应用
│   ├── src/
│   │   ├── components/    # 通用组件 (ui, layout, shared)
│   │   ├── features/      # 业务功能模块
│   │   ├── services/      # API 服务层
│   │   ├── stores/        # Zustand 状态管理
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── i18n/          # 国际化
│   │   └── types/         # TypeScript 类型
│   ├── .env.example       # 环境变量模板
│   └── .dockerignore      # Docker 忽略文件
│
├── backend/               # Fastify 后端 API
│   ├── src/
│   │   ├── modules/       # 功能模块 (auth, prompts, collections, shares, models)
│   │   ├── middlewares/   # 中间件
│   │   ├── config/        # 配置
│   │   └── utils/         # 工具函数
│   ├── prisma/            # 数据库 Schema
│   ├── entrypoint.sh      # Docker 启动脚本
│   ├── .env.example       # 环境变量模板
│   └── .dockerignore      # Docker 忽略文件
│
├── docker/                # Docker 配置
│   ├── Dockerfile.backend   # 后端镜像
│   ├── Dockerfile.frontend  # 前端镜像
│   ├── nginx.conf           # Nginx 配置
│   └── init-db.sql          # 数据库初始化
│
├── scripts/               # 部署脚本
│   ├── start.sh           # Linux/Mac 启动脚本
│   └── start.bat          # Windows 启动脚本
│
├── docker-compose.yml     # 生产环境编排
├── docker-compose.dev.yml # 开发环境编排
├── .env.example           # 环境变量模板
└── CLAUDE.md              # 开发规范
```

## 快速开始

### 前置要求

- **Docker** 和 **Docker Compose** 已安装
- **Git** (可选，用于克隆仓库)

### 一键部署

#### Windows

```batch
# 1. 配置环境变量
copy .env.example .env
notepad .env

# 2. 运行启动脚本
scripts\start.bat
```

#### Linux / Mac

```bash
# 1. 配置环境变量
cp .env.example .env
nano .env  # 或 vim, code 等

# 2. 运行启动脚本
chmod +x scripts/start.sh
./scripts/start.sh
```

#### 手动部署

```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env 设置必要的配置项

# 2. 构建并启动所有服务
docker compose up -d --build

# 3. 查看日志
docker compose logs -f
```

> 注意: 数据库迁移会在后端容器启动时自动执行，无需手动操作。

### 访问应用

部署完成后访问:

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost |
| API | http://localhost/api |
| 健康检查 | http://localhost/health |
| API 健康检查 | http://localhost/api-health |

## 环境配置

从 `.env.example` 创建 `.env` 文件:

### 必填配置

```env
# JWT 密钥 (生产环境必须修改!)
# 生成方式: openssl rand -hex 32
JWT_SECRET=your-secure-random-string-min-32-characters

# 数据库密码
DB_PASSWORD=your-database-password

# Redis 密码
REDIS_PASSWORD=your-redis-password
```

### 可选配置

```env
# 服务端口
FRONTEND_PORT=80

# CORS (生产环境需修改)
CORS_ORIGIN=http://localhost
FRONTEND_URL=http://localhost

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 生成安全密钥

```bash
# 生成 JWT 密钥 (64 字符)
openssl rand -hex 32

# 生成强密码 (32 字符)
openssl rand -base64 24

# 一次性生成所有密钥
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "DB_PASSWORD=$(openssl rand -base64 24)"
echo "REDIS_PASSWORD=$(openssl rand -base64 24)"
```

## 本地开发

### 热重载开发模式

```bash
# 1. 仅启动数据库服务
docker compose -f docker-compose.dev.yml up -d

# 2. 启动后端 (终端 1)
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev  # 运行在 http://localhost:3001

# 3. 启动前端 (终端 2)
cd frontend
npm install
npm run dev  # 运行在 http://localhost:5173
```

前端 `.env` 配置:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENABLE_MOCK_DATA=false
```

## Docker 命令

### 基本操作

```bash
# 启动所有服务
docker compose up -d

# 停止所有服务
docker compose down

# 查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend

# 重启服务
docker compose restart

# 重新构建并启动
docker compose up -d --build
```

### 容器管理

```bash
# 查看服务状态
docker compose ps

# 进入容器
docker compose exec backend sh
docker compose exec postgres psql -U postgres prompt_studio

# 删除所有 (包括数据卷)
docker compose down -v

# 删除所有 (包括镜像)
docker compose down -v --rmi all
```

## 数据库管理

### 备份

```bash
# 备份数据库
docker compose exec postgres pg_dump -U postgres prompt_studio > backup.sql

# 带时间戳的备份
docker compose exec postgres pg_dump -U postgres prompt_studio > backup-$(date +%Y%m%d-%H%M%S).sql
```

### 恢复

```bash
# 从 SQL 文件恢复
docker compose exec -T postgres psql -U postgres prompt_studio < backup.sql
```

### 迁移

```bash
# 运行迁移 (通常自动执行)
docker compose exec backend npx prisma db push

# 打开 Prisma Studio (数据库 GUI)
docker compose exec backend npx prisma studio
```

## 架构说明

### 网络流程

```
外部请求 (localhost:80)
         ↓
    [Nginx 容器]
         ├─→ /api/*     → [Backend:3001]
         │                     ↓
         │                 [PostgreSQL:5432]
         │                     ↓
         │                 [Redis:6379]
         │
         └─→ /* (其他)   → 静态文件 (React SPA)
```

### 服务依赖

```
1. PostgreSQL 启动 → 健康检查通过
         ↓
2. Redis 启动 → 健康检查通过
         ↓
3. Backend 启动 → 数据库迁移 → 连接 DB/Redis → 健康检查通过
         ↓
4. Frontend 启动 → Nginx 提供静态文件 → 代理 /api 到后端
```

## 故障排除

### 端口被占用

修改 `.env`:
```env
FRONTEND_PORT=8080
```

重启服务:
```bash
docker compose down && docker compose up -d
```

### 数据库连接失败

1. 检查 PostgreSQL 状态:
   ```bash
   docker compose ps postgres
   docker compose logs postgres
   ```

2. 重启 PostgreSQL:
   ```bash
   docker compose restart postgres
   ```

### 前端无法连接后端

1. 测试后端:
   ```bash
   curl http://localhost/api-health
   ```

2. 检查后端日志:
   ```bash
   docker compose logs backend | tail -50
   ```

### 完全重置

```bash
# 停止并删除所有容器、卷和镜像
docker compose down -v --rmi all

# 清理孤立卷
docker volume prune

# 重新构建启动
docker compose up -d --build
```

## 安全检查清单

生产环境部署前请确认:

- [ ] 修改 `JWT_SECRET` 为强随机字符串 (至少 32 字符)
- [ ] 设置强密码 `DB_PASSWORD` 和 `REDIS_PASSWORD`
- [ ] 更新 `CORS_ORIGIN` 为生产域名
- [ ] 配置 HTTPS (SSL/TLS 证书)
- [ ] 配置防火墙 (仅开放 80/443 端口)
- [ ] 设置自动备份
- [ ] 配置日志和监控
- [ ] 审查 OAuth 回调 URI

## 性能优化

- **Redis 缓存**: 256MB 内存，LRU 淘汰策略
- **Nginx Gzip**: 所有文本响应启用压缩
- **静态资源缓存**: JS/CSS/图片 1 年缓存
- **HTML 无缓存**: 确保 SPA 始终获取最新版本
- **数据库连接池**: Prisma 连接池管理
- **多阶段 Docker 构建**: 最小化生产镜像
- **Alpine 基础镜像**: 更小的镜像体积

## 许可证

MIT License

---

**Enjoy using Prompt Studio!**
