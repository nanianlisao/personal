// pages/test2/test2.js
const app = getApp()
Page({

  data: {
    page: '',
    scene: '',
    firstIn: true,
  },

  onLoad(options) {

    if (options.page) {
      this.data.page = options.page
    } else if (options.q) {
      this.data.scene = decodeURIComponent(options.q).split('=')[1]
    }
  },
  onShow() {
    if (this.data.firstIn) {
      wx.showLoading({
        title: '登陆中',
      })
      this.timer = setInterval(() => {
        if (app.globalData.isLoginFinish) {
          clearInterval(this.timer)
          wx.navigateTo({
            url: `/pages/test/test?page=${this.data.page}&scene=${this.data.scene}`,
          })
          wx.hideLoading()
          this.data.firstIn = false
        }
      }, 500)
    }else{
      setTimeout(() => {
        this.setData({
          firstIn: false
        })
      }, 300)
    }
  },

  bindConfirm(){
    wx.navigateTo({
      url: `/pages/test/test?page=${this.data.page}&scene=${this.data.scene}`,
    })
  },


  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },


})