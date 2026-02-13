/**
 * 首页
 * 小程序首页，展示品牌 slogan，可跳转到菜单页
 */
Page({
  // 页面 data，可在 wxml 中通过 {{title}} 等形式绑定
  data: {
    // 品牌名称
    title: 'JimBakery',
    // 副标题 / slogan
    subtitle: '新鲜烘焙，每日美味'
  },

  /**
   * 生命周期：页面加载时触发
   * @param {Object} options - 页面路径中的 query 参数
   */
  onLoad(options) {
    console.log('首页加载')
  },

  /**
   * 生命周期：页面初次渲染完成时触发
   */
  onReady() {
    console.log('首页渲染完成')
  },

  /**
   * 生命周期：页面显示 / 切入前台时触发
   */
  onShow() {
    console.log('首页显示')
  },

  /**
   * 跳转到菜单页（tabBar 页面）
   * 使用 switchTab 而非 navigateTo，因为菜单是 tabBar 页
   */
  goToMenu() {
    wx.switchTab({
      url: '/pages/menu/menu'
    })
  }
})
