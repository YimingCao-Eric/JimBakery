/**
 * 微信小程序网络请求封装
 */

const TOKEN_KEY = 'token'
const LOGIN_PAGE = '/pages/user/user'

/**
 * 获取基础URL
 */
function getBaseUrl() {
  try {
    const app = getApp()
    return app.globalData.baseUrl || ''
  } catch (e) {
    return ''
  }
}

/**
 * 获取Token
 */
function getToken() {
  try {
    return wx.getStorageSync(TOKEN_KEY) || ''
  } catch (e) {
    return ''
  }
}

/**
 * 清除Token并跳转登录
 */
function clearTokenAndRelogin() {
  wx.removeStorageSync(TOKEN_KEY)
  try {
    const app = getApp()
    if (app && app.setGlobalData) {
      app.setGlobalData('token', null)
      app.setGlobalData('userInfo', null)
    }
  } catch (e) {}
  wx.reLaunch({
    url: LOGIN_PAGE
  })
}

/**
 * 构建完整URL（GET请求拼接params）
 */
function buildUrl(url, params) {
  const baseUrl = getBaseUrl()
  let fullUrl = url.startsWith('http') ? url : `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`

  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    fullUrl += (fullUrl.indexOf('?') > -1 ? '&' : '?') + query
  }

  return fullUrl
}

/**
 * 核心请求函数
 * @param {Object} options - 请求配置，同 wx.request
 * @returns {Promise}
 */
function request(options = {}) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }

    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      timeout: options.timeout ?? 30000,
      success: (res) => {
        const { statusCode, data } = res

        if (statusCode === 401) {
          wx.showToast({
            title: '登录已失效，请重新登录',
            icon: 'none'
          })
          clearTokenAndRelogin()
          reject(new Error('401 Unauthorized'))
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          const code = data?.code ?? data?.status
          if (code === 0 || code === 200 || code === undefined) {
            resolve(data?.data ?? data)
          } else {
            const message = data?.message ?? data?.msg ?? '请求失败'
            wx.showToast({
              title: message,
              icon: 'none'
            })
            reject(new Error(message))
          }
        } else {
          const message = data?.message ?? data?.msg ?? `请求失败(${statusCode})`
          wx.showToast({
            title: message,
            icon: 'none'
          })
          reject(new Error(message))
        }
      },
      fail: (err) => {
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
 * @param {Object} params - 查询参数
 */
function get(url, params = {}) {
  const fullUrl = buildUrl(url, params)
  return request({
    url: fullUrl,
    method: 'GET'
  })
}

/**
 * POST 请求
 * @param {string} url - 请求路径
 * @param {Object} data - 请求体数据
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
 * @param {Object} data - 请求体数据
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
 * @param {Object} data - 请求体数据
 */
function del(url, data = {}) {
  const fullUrl = buildUrl(url)
  return request({
    url: fullUrl,
    method: 'DELETE',
    data
  })
}

module.exports = {
  request,
  get,
  post,
  put,
  delete: del
}
