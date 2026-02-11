Page({
  data: {
    title: 'JimBakery',
    subtitle: '新鲜烘焙，每日美味'
  },

  onLoad(options) {
    console.log('首页加载')
  },

  onReady() {
    console.log('首页渲染完成')
  },

  onShow() {
    console.log('首页显示')
  },

  // 跳转到菜单页
  goToMenu() {
    wx.switchTab({
      url: '/pages/menu/menu'
    })
  }
})
