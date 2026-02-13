/**
 * 微信小程序网络请求封装
 * 提供统一的网络请求接口，支持 token 鉴权、401 自动跳转登录
 */

// 本地存储中 token 的键名
const TOKEN_KEY = 'token'
// 登录失效时跳转的页面路径
const LOGIN_PAGE = '/pages/user/user'

/**
 * 获取基础URL
 * @returns {string} 从 app.globalData.baseUrl 读取，异常时返回空字符串
 */
function getBaseUrl() {
  try {
    // 获取小程序 App 实例
    const app = getApp()
    // 返回配置的 baseUrl，未配置则返回空字符串
    return app.globalData.baseUrl || ''
  } catch (e) {
    // getApp 可能在 App 未就绪时抛错，捕获后返回空字符串
    return ''
  }
}

/**
 * 获取Token
 * @returns {string} 本地存储的 token，异常或不存在时返回空字符串
 */
function getToken() {
  try {
    // 同步读取本地存储中的 token
    return wx.getStorageSync(TOKEN_KEY) || ''
  } catch (e) {
    // 读取失败时返回空字符串
    return ''
  }
}

/**
 * 清除Token并跳转登录
 * 调用时机：收到 401 未授权响应时
 */
function clearTokenAndRelogin() {
  // 从本地存储中移除 token
  wx.removeStorageSync(TOKEN_KEY)
  try {
    const app = getApp()
    // 若 app 提供了 setGlobalData，清空 token 和 userInfo
    if (app && app.setGlobalData) {
      app.setGlobalData('token', null)
      app.setGlobalData('userInfo', null)
    }
  } catch (e) {}
  // 关闭所有页面，重新打开并跳转到登录页
  wx.reLaunch({
    url: LOGIN_PAGE
  })
}

/**
 * 构建完整URL（GET 请求时拼接 params 为查询字符串）
 * @param {string} url - 相对路径或完整 URL
 * @param {Object} [params] - 查询参数对象
 * @returns {string} 完整的请求 URL
 */
function buildUrl(url, params) {
  // 获取配置的基础 URL
  const baseUrl = getBaseUrl()
  // 若 url 已是完整地址则直接使用，否则拼接 baseUrl
  // 去掉 baseUrl 末尾和 url 开头的斜杠，避免双斜杠
  let fullUrl = url.startsWith('http') ? url : `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`

  // 存在 params 且为对象且有键时，拼接为查询字符串
  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    // 过滤掉 undefined、null、空字符串
    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      // 对 key 和 value 做 URI 编码
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    // 若 URL 已有 ? 则用 & 拼接，否则用 ? 拼接
    fullUrl += (fullUrl.indexOf('?') > -1 ? '&' : '?') + query
  }

  return fullUrl
}

/**
 * 核心请求函数，封装 wx.request
 * @param {Object} options - 请求配置，同 wx.request（url、method、data、header、timeout 等）
 * @returns {Promise} 成功时 resolve 业务数据，失败时 reject
 */
function request(options = {}) {
  return new Promise((resolve, reject) => {
    // 读取本地 token
    const token = getToken()
    // 默认 Content-Type 为 JSON，合并用户传入的 header
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }

    // 若有 token，添加 Authorization 请求头（Bearer 模式）
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      // 超时时间，默认 30 秒；?? 仅当值为 null/undefined 时使用默认值
      timeout: options.timeout ?? 30000,
      success: (res) => {
        const { statusCode, data } = res

        // 401 未授权：token 失效或未登录
        if (statusCode === 401) {
          wx.showToast({
            title: '登录已失效，请重新登录',
            icon: 'none'
          })
          // 清除 token 并跳转登录页
          clearTokenAndRelogin()
          reject(new Error('401 Unauthorized'))
          return
        }

        // HTTP 2xx 成功
        if (statusCode >= 200 && statusCode < 300) {
          // 业务状态码，兼容 code 或 status 字段
          const code = data?.code ?? data?.status
          // code 为 0、200 或未定义时视为业务成功
          if (code === 0 || code === 200 || code === undefined) {
            // 优先返回 data 字段，否则返回整个 data
            resolve(data?.data ?? data)
          } else {
            // 业务失败，取错误信息并提示
            const message = data?.message ?? data?.msg ?? '请求失败'
            wx.showToast({
              title: message,
              icon: 'none'
            })
            reject(new Error(message))
          }
        } else {
          // 非 2xx 状态码（如 404、500）
          const message = data?.message ?? data?.msg ?? `请求失败(${statusCode})`
          wx.showToast({
            title: message,
            icon: 'none'
          })
          reject(new Error(message))
        }
      },
      fail: (err) => {
        // 网络错误、超时等
        const message = err.errMsg || '网络请求失败'
        wx.showToast({
          title: message,
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 * @param {string} url - 请求路径（相对或绝对）
 * @param {Object} [params={}] - 查询参数，会拼接到 URL
 * @returns {Promise}
 */
function get(url, params = {}) {
  // GET 的 params 会通过 buildUrl 拼接到 URL
  const fullUrl = buildUrl(url, params)
  return request({
    url: fullUrl,
    method: 'GET'
  })
}

/**
 * POST 请求
 * @param {string} url - 请求路径
 * @param {Object} [data={}] - 请求体数据
 * @returns {Promise}
 */
function post(url, data = {}) {
  const fullUrl = buildUrl(url)
  return request({
    url: fullUrl,
    method: 'POST',
    data
  })
}

/**
 * PUT 请求
 * @param {string} url - 请求路径
 * @param {Object} [data={}] - 请求体数据
 * @returns {Promise}
 */
function put(url, data = {}) {
  const fullUrl = buildUrl(url)
  return request({
    url: fullUrl,
    method: 'PUT',
    data
  })
}

/**
 * DELETE 请求
 * @param {string} url - 请求路径
 * @param {Object} [data={}] - 请求体数据
 * @returns {Promise}
 */
function del(url, data = {}) {
  const fullUrl = buildUrl(url)
  return request({
    url: fullUrl,
    method: 'DELETE',
    data
  })
}

// 导出：delete 为 JS 关键字，故用 del 实现，导出时命名为 delete
module.exports = {
  request,
  get,
  post,
  put,
  delete: del
}
