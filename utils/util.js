/**
 * 微信小程序工具函数
 * 包含格式化、性能优化、UI 辅助、本地存储等常用工具
 */

/* ========== 格式化函数 ========== */

/**
 * 价格格式化，保留2位小数
 * @param {number|string} price - 价格
 * @returns {string} 格式化后的价格字符串，如 "12.90"
 */
function formatPrice(price) {
  // 转为数字，支持 "12.9" 等字符串
  const num = parseFloat(price)
  // 转换失败（如 NaN）时返回默认值
  if (isNaN(num)) return '0.00'
  // 保留两位小数，不足补 0
  return num.toFixed(2)
}

/**
 * 日期格式化
 * @param {Date|number|string} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式，如 YYYY-MM-DD HH:mm:ss
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  // 空值直接返回
  if (!date) return ''

  let d
  if (date instanceof Date) {
    // 已是 Date 对象，直接使用
    d = date
  } else if (typeof date === 'number') {
    // 时间戳（毫秒），转为 Date
    d = new Date(date)
  } else {
    // 日期字符串，转为 Date
    d = new Date(date)
  }

  // 无效日期（如 Invalid Date）返回空
  if (isNaN(d.getTime())) return ''

  // 补齐为两位数，如 5 -> "05"
  const pad = (n) => (n < 10 ? '0' + n : '' + n)
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)   // getMonth 从 0 开始
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())

  // 按格式字符串依次替换占位符
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
 * 防抖函数：连续触发时，仅在最后一次触发后 delay 毫秒执行
 * 典型场景：搜索输入框、窗口 resize
 * @param {Function} fn - 目标函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    // 每次调用先清除之前的定时器
    if (timer) clearTimeout(timer)
    // 重新计时，delay 毫秒后再执行
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数：在 interval 毫秒内最多执行一次
 * 典型场景：滚动、按钮连续点击
 * @param {Function} fn - 目标函数
 * @param {number} interval - 间隔时间(ms)
 * @returns {Function} 节流后的函数
 */
function throttle(fn, interval = 300) {
  // 上次执行时间
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    // 距离上次执行已超过 interval 才执行
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
    mask: true  // 遮罩层，防止用户操作
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
    icon: 'none'  // 无图标，仅文字
  })
}

/**
 * 确认对话框
 * @param {Object} options - 配置项 { title, content, confirmText, cancelText }
 * @returns {Promise<boolean>} - 确认返回 true，取消或失败返回 false
 */
function showConfirm(options = {}) {
  // 解构并设置默认值
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
        // res.confirm 为 true 表示点击确定
        resolve(!!res.confirm)
      },
      fail: () => {
        // 弹窗失败也按取消处理
        resolve(false)
      }
    })
  })
}

/* ========== 本地存储封装 ========== */

// 封装 wx 本地存储，统一 try-catch 和 API
const storage = {
  /**
   * 存储数据
   * @param {string} key - 键
   * @param {any} value - 值（支持对象，会自动 JSON 序列化）
   */
  set(key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      // 小程序存储有大小限制，超出可能失败
      console.error('[storage.set]', e)
    }
  },

  /**
   * 获取数据
   * @param {string} key - 键
   * @param {any} defaultValue - 默认值（键不存在或异常时返回）
   * @returns {any}
   */
  get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      // 区分 undefined/null（不存在）与 falsy 值（如 0、''）
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

// 导出所有工具函数和 storage 对象
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
