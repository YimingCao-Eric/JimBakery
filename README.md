# JimBakery 面包店微信小程序

## 1. 项目简介

JimBakery 是一款面向面包店场景的微信小程序，提供商品浏览、购物车、订单管理及店长端管理等功能。

## 2. 技术栈

- **开发方式**：微信小程序原生开发
- **样式**：WXSS + CSS 变量
- **构建**：微信开发者工具

## 3. 目录结构

```
JimBakery/
├── app.js              # 应用入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置
├── sitemap.json        # 站点地图（需自行创建）
├── images/             # 图片资源
│   └── icons/         # TabBar 图标
├── pages/              # 主包页面
│   ├── index/         # 首页
│   ├── menu/          # 菜单
│   ├── cart/          # 购物车
│   ├── order/         # 订单
│   └── user/          # 个人中心
├── pages_admin/       # 分包：店长端
│   ├── dashboard/     # 数据看板
│   ├── products/      # 商品管理
│   ├── orders/        # 订单管理
│   └── settings/      # 设置
└── utils/             # 工具函数
    ├── request.js     # 网络请求封装
    └── util.js        # 通用工具
```

## 4. 开发环境要求

- **微信开发者工具**：稳定版 1.06+ 或以上
- **基础库版本**：3.3.0（见 project.config.json）
- **Node.js**：如需 npm 构建，建议 v14+

## 5. 启动步骤

1. 使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开项目
2. 将 `project.config.json` 中的 `appid` 替换为实际小程序 AppID
3. 在 `images/icons/` 下补充 TabBar 所需图标（建议 81×81px）
4. 点击「编译」进行预览与调试

## 6. 项目成员 / 联系方式

- **负责人**：[Eric](https://www.linkedin.com/in/yiming-cao-a760841b0/)
- **联系方式**：ericcaoyiming@gmail.com
