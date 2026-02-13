# JimBakery Server

后端 API 服务，为微信小程序提供数据接口。

## 技术栈

- Node.js + NestJS
- MongoDB / MySQL
- JWT 认证

## 快速开始

```bash
cd server
npm install

# 复制环境变量
cp .env.example .env
# 编辑 .env 填写配置

# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm start
```

## 接口地址

- 基础路径：`/api/v1`
- 欢迎页：`GET /api/v1`
- 健康检查：`GET /api/v1/health`
