/**
 * 微信小程序工具函数
 */

/* ========== 格式化函数 ========== */

/**
 * 价格格式化，保留2位小数
 * @param {number|string} price - 价格
 * @returns {string}
 */
function formatPrice(price) {
  const num = parseFloat(price)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

/**
 * 日期格式化
 * @param {Date|number|string} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式，如 YYYY-MM-DD HH:mm:ss
 * @returns {string}
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''

  let d
  if (date instanceof Date) {
    d = date
  } else if (typeof date === 'number') {
    d = new Date(date)
  } else {
    d = new Date(date)
  }

  if (isNaN(d.getTime())) return ''

  const pad = (n) => (n < 10 ? '0' + n : '' + n)
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/* ========== 性能优化 ========== */

/**
 * 防抖函数
 * @param {Function} fn - 目标函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 目标函数
 * @param {number} interval - 间隔时间(ms)
 * @returns {Function}
 */
function throttle(fn, interval = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/* ========== UI辅助 ========== */

/**
 * 显示加载中
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 成功提示
 * @param {string} title - 提示文字
 */
function showSuccess(title = '操作成功') {
  wx.showToast({
    title,
    icon: 'success'
  })
}

/**
 * 错误提示
 * @param {string} title - 提示文字
 */
function showError(title = '操作失败') {
  wx.showToast({
    title,
    icon: 'none'
  })
}

/**
 * 确认对话框
 * @param {Object} options - 配置项 { title, content, confirmText, cancelText }
 * @returns {Promise<boolean>} - 确认返回true，取消返回false
 */
function showConfirm(options = {}) {
  const {
    title = '提示',
    content = '',
    confirmText = '确定',
    cancelText = '取消'
  } = options

  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText,
      cancelText,
      success: (res) => {
        resolve(!!res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/* ========== 本地存储封装 ========== */

const storage = {
  /**
   * 存储数据
   * @param {string} key - 键
   * @param {any} value - 值（支持对象，会自动JSON序列化）
   */
  set(key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.error('[storage.set]', e)
    }
  },

  /**
   * 获取数据
   * @param {string} key - 键
   * @param {any} defaultValue - 默认值
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      return value !== undefined && value !== null ? value : defaultValue
    } catch (e) {
      console.error('[storage.get]', e)
      return defaultValue
    }
  },

  /**
   * 移除数据
   * @param {string} key - 键
   */
  remove(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      console.error('[storage.remove]', e)
    }
  },

  /**
   * 清空所有数据
   */
  clear() {
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.error('[storage.clear]', e)
    }
  }
}

module.exports = {
  formatPrice,
  formatDate,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  storage
}
