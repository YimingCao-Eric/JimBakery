# API 接口规范

## 基础信息

| 项目 | 说明 |
|------|------|
| 基础 URL | `/api/v1` |
| 认证方式 | Bearer Token (JWT)，请求头：`Authorization: Bearer <token>` |
| 响应格式 | `{ code: 0|200, message: string, data: any }` |
| 错误码 | 401 未授权，403 无权限，404 未找到，500 服务错误 |

---

## 用户模块

### POST /auth/login
- **描述**：微信登录
- **认证**：否
- **参数**：`{ code: string }`
- **响应**：`{ token: string, userInfo: object }`

### GET /user/profile
- **描述**：获取当前用户信息
- **认证**：是
- **响应**：`{ _id, nickname, avatar, phone, addresses }`

### PUT /user/profile
- **描述**：更新用户信息
- **认证**：是
- **参数**：`{ nickname?, avatar?, phone? }`
- **响应**：`{ userInfo }`

### POST /user/address
- **描述**：添加收货地址
- **认证**：是
- **参数**：`{ name, phone, region, detail, isDefault? }`

### PUT /user/address/:id
- **描述**：更新收货地址

### DELETE /user/address/:id
- **描述**：删除收货地址

---

## 商品模块

### GET /categories
- **描述**：获取分类列表（仅启用）
- **认证**：否
- **响应**：`[{ _id, name, icon, sort }]`

### GET /products
- **描述**：获取商品列表
- **认证**：否
- **参数**：`?categoryId=&page=1&limit=10&keyword=`
- **响应**：`{ list: [], total: number, page: number, limit: number }`

### GET /products/:id
- **描述**：获取商品详情
- **认证**：否
- **响应**：`{ _id, name, price, originalPrice, stock, images, description, specs, sales }`

---

## 购物车模块

### GET /cart
- **描述**：获取购物车
- **认证**：是
- **响应**：`{ items: [], totalCount: number, totalAmount: number }`

### POST /cart/add
- **描述**：添加商品到购物车
- **认证**：是
- **参数**：`{ productId, quantity, spec? }`
- **响应**：`{ cart }`

### PUT /cart/item/:id
- **描述**：修改购物车项数量
- **认证**：是
- **参数**：`{ quantity }`

### DELETE /cart/item/:id
- **描述**：删除购物车项
- **认证**：是

---

## 订单模块

### POST /orders
- **描述**：创建订单
- **认证**：是
- **参数**：`{ items: [{ productId, quantity, spec }], addressId, type?: "delivery"|"dinein", remark? }`
- **响应**：`{ orderId, orderNo, totalAmount }`

### GET /orders
- **描述**：获取订单列表
- **认证**：是
- **参数**：`?status=pending|paid|...&page=1&limit=10`
- **响应**：`{ list: [], total, page, limit }`

### GET /orders/:id
- **描述**：获取订单详情
- **认证**：是

### POST /orders/:id/cancel
- **描述**：取消订单（仅 pending 状态可取消）
- **认证**：是

---

## 支付模块

### POST /payment/unifiedorder
- **描述**：创建统一支付订单
- **认证**：是
- **参数**：`{ orderId, paymentMethod: "wechat"|"alipay" }`
- **响应**：`{ payParams: {...} }`（小程序调起支付所需参数）

### POST /payment/notify
- **描述**：支付回调通知（微信/支付宝回调，无需认证）
- **说明**：服务端接收第三方支付平台回调，更新订单状态

---

## 统计模块

### GET /statistics/overview
- **描述**：数据概览（今日/本周/本月）
- **认证**：是（admin）
- **响应**：`{ todayOrders, todayAmount, weekOrders, weekAmount, monthOrders, monthAmount }`

### GET /statistics/sales
- **描述**：销售趋势
- **认证**：是（admin）
- **参数**：`?type=day|week|month&start=&end=`
- **响应**：`[{ date, amount, orderCount }]`

### GET /statistics/products
- **描述**：商品销售排行
- **认证**：是（admin）
- **参数**：`?limit=10&start=&end=`
- **响应**：`[{ productId, name, sales, amount }]`

### GET /statistics/categories
- **描述**：分类销售占比
- **认证**：是（admin）
- **参数**：`?start=&end=`
- **响应**：`[{ categoryId, name, amount, percentage }]`

---

## 管理模块

> 以下接口均需 admin 权限

### 分类管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /admin/categories | 获取全部分类（含禁用） |
| POST | /admin/categories | 新增分类 |
| PUT | /admin/categories/:id | 更新分类 |
| DELETE | /admin/categories/:id | 删除分类（软删或检查关联） |

### 商品管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /admin/products | 商品列表（分页、筛选） |
| POST | /admin/products | 新增商品 |
| PUT | /admin/products/:id | 更新商品 |
| DELETE | /admin/products/:id | 删除/下架商品 |

### 订单管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /admin/orders | 订单列表（分页、状态筛选） |
| GET | /admin/orders/:id | 订单详情 |
| PUT | /admin/orders/:id/status | 更新订单状态（如：发货） |

### 用户管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /admin/users | 用户列表 |
| GET | /admin/users/:id | 用户详情 |
| PUT | /admin/users/:id/role | 修改用户角色 |
