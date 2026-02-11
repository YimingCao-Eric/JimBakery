App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'https://your-api-domain.com/api',
    cartCount: 0
  },

  onLaunch() {
    console.log('[JimBakery] 小程序启动')
    this.checkUpdate()
  },

  onShow() {
    console.log('[JimBakery] 小程序显示')
  },

  onHide() {
    console.log('[JimBakery] 小程序隐藏')
  },

  onError(error) {
    console.error('[JimBakery] 小程序错误:', error)
  },

  checkUpdate() {
    if (!wx.canIUse('getUpdateManager')) {
      return
    }
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (modalRes) => {
              if (modalRes.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          wx.showModal({
            title: '更新失败',
            content: '新版本下载失败，请删除小程序后重新搜索打开'
          })
        })
      }
    })
  },

  setGlobalData(key, value) {
    this.globalData[key] = value
  },

  getGlobalData(key) {
    return this.globalData[key]
  }
})
