# spica-admin-web

IdeaSpace 管理台前端 —— Vue 2 + Element UI 的后台管理系统，与配套后端 [`spica-admin-server`](https://github.com/SpicaBinary/spica-admin-server)（Spring Cloud Alibaba 微服务）对接，实现登录认证、RBAC 动态权限、菜单管理等完整管理台能力。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 2.6.14 · Vue CLI 5 |
| UI 库 | Element UI 2.15.14 |
| 状态管理 | Vuex 3（模块化抽取） |
| 路由 | Vue Router 3（全局守卫 + 动态路由） |
| HTTP | axios（拦截器统一封装） |
| 权限 | 自定义 `v-role` / `v-permission` 指令 |
| 部署 | Docker + nginx（见 `front-on-server/`） |

## 功能

- **登录认证**：JWT token + localStorage 本地用户信息免登录，401 自动清理并跳转
- **RBAC 权限**：`v-role`、`v-permission` 自定义指令控制元素显隐，权限码随登录信息下发
- **动态菜单**：侧边栏菜单由后端接口驱动，随角色权限动态渲染
- **管理页面**：仪表盘、用户管理、菜单管理、角色权限分配、订单管理、个人中心
- **多页签**：TabsView 浏览器页签风格，路由后置钩子同步 Vuex
- **请求体验**：axios 拦截器统一封装 loading、全局 Message 提示、错误处理

## 目录结构

```
frontend-vue2/
├── public/                 # 静态入口
├── src/
│   ├── api/                # auth / user / order 接口封装（request.js 统一拦截）
│   ├── components/         # BaseLayout / BaseSidebar / TabsView 布局组件
│   ├── directives/         # v-role / v-permission 权限指令
│   ├── router/             # 路由与登录守卫
│   ├── store/              # Vuex（modules: tabs 等）
│   ├── utils/              # loadingManager 等工具
│   ├── views/              # 页面组件
│   └── config/             # 运行时配置
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── vue.config.js           # devServer 端口与 API 代理
└── front-on-server/        # Docker 部署（nginx + compose）
```

## 快速开始

### 环境要求

- Node.js 14+（推荐 16）· npm

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量

| 变量 | 说明 | 开发默认值 |
|------|------|-----------|
| `VUE_APP_API_BASE_URL` | 后端 API 基础地址 | `http://localhost:8080/api`（开发）/ `/api`（生产，走 nginx 反代） |
| `VUE_APP_DEBUG` | 调试开关 | `true`（开发）/ `false`（生产） |
| `VUE_APP_TIMEOUT` | 请求超时（ms） | `3000` |

> 开发环境另有 `vue.config.js` 的 devServer 代理（`/api` → `http://localhost:8080`），需先启动后端网关（`spica-admin-server`，端口 8080）。

### 3. 启动

```bash
npm run serve     # 开发（默认 http://localhost:10086）
npm run build     # 生产构建
npm run lint      # 代码检查
```

## 部署

```bash
cd front-on-server
# 详见 front-on-server/deploy.md
docker compose up -d --build
```

nginx 承担两件事：托管前端静态资源（SPA 路由回退 `index.html`），并把 `/api` 反向代理到后端网关容器 `gateway:8080`。

## 与后端的对接

| 项 | 值 |
|----|-----|
| 配套后端 | [`spica-admin-server`](https://github.com/SpicaBinary/spica-admin-server) |
| 网关地址 | 开发 `http://localhost:8080`，生产 nginx 反代 `gateway:8080` |
| 认证方式 | 登录签发 JWT，axios 自动携带 `Authorization` 头 |
| 权限模型 | 后端 RBAC（角色 → 权限码）下发，前端指令与菜单按权限码渲染 |

## License

见 [LICENSE](./LICENSE)。
