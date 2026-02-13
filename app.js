/**
 * 微信小程序 App 入口
 * 整个应用只会调用一次，用于配置全局数据和生命周期
 */
App({
  // 全局数据，可在任意页面通过 getApp().globalData 访问
  globalData: {
    // 当前登录用户信息，未登录时为 null
    userInfo: null,
    // 登录后获取的 token，用于请求鉴权
    token: null,
    // 后端 API 基础地址，request 封装会据此拼接完整 URL
    baseUrl: 'https://your-api-domain.com/api',
    // 购物车商品数量，用于显示角标
    cartCount: 0
  },

  /**
   * 生命周期：小程序初始化完成时触发（全局只触发一次）
   */
  onLaunch() {
    console.log('[JimBakery] 小程序启动')
    // 检测是否有新版本需要更新
    this.checkUpdate()
  },

  /**
   * 生命周期：小程序启动或从后台进入前台时触发
   */
  onShow() {
    console.log('[JimBakery] 小程序显示')
  },

  /**
   * 生命周期：小程序从前台进入后台时触发
   */
  onHide() {
    console.log('[JimBakery] 小程序隐藏')
  },

  /**
   * 错误监听：小程序发生脚本错误或 API 调用失败时触发
   * @param {Error} error - 错误对象
   */
  onError(error) {
    console.error('[JimBakery] 小程序错误:', error)
  },

  /**
   * 检查小程序是否有新版本可更新
   * 若有新版本，下载完成后提示用户重启应用
   */
  checkUpdate() {
    // 基础库 1.9.90 以下不支持 UpdateManager，直接返回
    if (!wx.canIUse('getUpdateManager')) {
      return
    }
    // 获取更新管理器
    const updateManager = wx.getUpdateManager()
    // 监听检查更新结果
    updateManager.onCheckForUpdate((res) => {
      // 有新版本时
      if (res.hasUpdate) {
        // 新版本下载完成
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (modalRes) => {
              // 用户点击确定，重启应用应用新版本
              if (modalRes.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        // 新版本下载失败
        updateManager.onUpdateFailed(() => {
          wx.showModal({
            title: '更新失败',
            content: '新版本下载失败，请删除小程序后重新搜索打开'
          })
        })
      }
    })
  },

  /**
   * 设置全局数据
   * @param {string} key - 要设置的键名
   * @param {*} value - 要设置的值
   */
  setGlobalData(key, value) {
    this.globalData[key] = value
  },

  /**
   * 获取全局数据
   * @param {string} key - 要获取的键名
   * @returns {*} 对应的值
   */
  getGlobalData(key) {
    return this.globalData[key]
  }
})
