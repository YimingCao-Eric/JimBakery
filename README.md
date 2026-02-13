# JimBakery 面包店微信小程序

## 项目简介

JimBakery 是一款面向面包店的微信小程序，提供外送配送和店内堂食服务。包含**顾客端**（顾客远程下单+店长配送）和**店长端**（店内堂食下单+数据管理）两大模块。

## 功能特性

### 顾客端

- 微信一键登录
- 商品浏览与搜索
- 购物车管理
- 在线支付（微信/支付宝）
- 订单追踪
- 收货地址管理

### 店长端

- 实时营收数据看板
- 商品/分类管理
- 订单处理
- 堂食点单系统

## 技术栈

- **前端**：微信小程序原生框架
- **后端**：Node.js + Express/NestJS
- **数据库**：MongoDB/MySQL
- **图表**：ECharts-for-weixin

## 快速开始

### 环境要求

- 微信开发者工具 v1.06+
- Node.js v18+

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/YimingCao-Eric/JimBakery.git

# 安装小程序依赖（如有）
cd JimBakery
npm install
```

### 启动步骤

1. 使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开项目
2. 将 `project.config.json` 中的 `appid` 替换为实际小程序 AppID
3. 在 `images/icons/` 下补充 TabBar 所需图标（建议 81×81px）
4. 点击「编译」进行预览与调试

## 目录结构

```
JimBakery/
├── app.js              # 应用入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置
├── sitemap.json        # 站点地图（需自行创建）
├── images/             # 图片资源
│   └── icons/          # TabBar 图标
├── pages/              # 主包页面
│   ├── index/          # 首页
│   ├── menu/           # 菜单
│   ├── cart/           # 购物车
│   ├── order/          # 订单
│   └── user/            # 个人中心
├── pages_admin/        # 分包：店长端
│   ├── dashboard/      # 数据看板
│   ├── products/       # 商品管理
│   ├── orders/         # 订单管理
│   └── settings/       # 设置
├── utils/              # 工具函数
│   ├── request.js      # 网络请求封装
│   └── util.js         # 通用工具
└── docs/               # 项目文档
```

## 项目成员 / 联系方式

- **负责人**：[Eric](https://www.linkedin.com/in/yiming-cao-a760841b0/)
- **联系方式**：ericcaoyiming@gmail.com
