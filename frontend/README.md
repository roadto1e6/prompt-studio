# Prompt Studio Frontend

现代化的 AI 提示词管理平台前端，基于 React + TypeScript 构建。

## 技术栈

- **React 18** + **TypeScript 5**
- **Vite 5** - 构建工具
- **Tailwind CSS** + **CSS Modules** - 样式方案
- **Zustand** - 状态管理
- **React Router 6** - 路由
- **Lucide React** - 图标库
- **date-fns** - 日期处理

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run typecheck

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

开发服务器运行在 `http://localhost:5173`

## 环境变量

复制 `.env.example` 为 `.env` 并配置：

```env
# API 地址
VITE_API_BASE_URL=http://localhost:3001/api

# API 超时时间 (毫秒)
VITE_API_TIMEOUT=30000

# 应用名称
VITE_APP_NAME=Prompt Studio

# 启用 Mock 数据 (开发调试用)
VITE_ENABLE_MOCK_DATA=false
```

## 项目结构

```
src/
├── components/           # 通用组件
│   ├── ui/              # 基础 UI 组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Select/
│   │   └── ...
│   ├── layout/          # 布局组件
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── MainLayout/
│   └── shared/          # 共享组件
│       ├── EmptyState/
│       └── ErrorState/
│
├── features/            # 业务功能模块
│   ├── prompts/         # 提示词管理
│   │   └── components/
│   │       ├── PromptCard/
│   │       ├── PromptEditor/
│   │       ├── PromptGrid/
│   │       └── ...
│   └── collections/     # 集合管理
│       └── components/
│
├── pages/               # 页面组件
│   └── HomePage.tsx
│
├── stores/              # Zustand 状态管理
│   ├── authStore.ts
│   ├── promptStore.ts
│   ├── collectionStore.ts
│   ├── modelStore.ts
│   └── uiStore.ts
│
├── services/            # API 服务层
│   ├── api.ts           # Axios 实例
│   ├── authService.ts
│   ├── promptService.ts
│   └── ...
│
├── hooks/               # 自定义 Hooks
│   └── index.ts
│
├── i18n/                # 国际化
│   ├── index.ts
│   ├── en.ts
│   └── zh.ts
│
├── types/               # TypeScript 类型
│   └── index.ts
│
├── utils/               # 工具函数
│   └── index.ts
│
├── styles/              # 全局样式
│   └── variants.ts
│
├── constants/           # 常量定义
│   └── index.ts
│
├── App.tsx              # 根组件
├── main.tsx             # 入口文件
└── index.css            # 全局 CSS
```

## 组件架构

遵循 Headless UI 四文件架构：

```
ComponentName/
├── types.ts          # 类型定义
├── index.module.css  # 样式
├── useComponentName.ts  # 逻辑 Hook
└── index.tsx         # 视图组件
```

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建结果 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run lint` | ESLint 检查 |

## 开发规范

详见 [CLAUDE.md](../CLAUDE.md)
