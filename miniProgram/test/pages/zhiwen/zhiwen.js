// pages/page3/page3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  test(){
    var that = this
    wx.checkIsSupportSoterAuthentication({
      success(res){
        if (res.supportMode[0] == 'fingerPrint'){
          wx.showModal({
            title: '提示',
            content: '支持指纹识别，是否开始？',
            success(res){
              that.start()
            }
          })
        }
      }
    })
  },
  start(){
    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: String(Math.random()*1000000),
      authContent:'正在识别中....',
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      },
      complete(res){
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})