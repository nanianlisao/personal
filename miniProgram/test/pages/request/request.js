// pages/request/request.js
var regeneratorRuntime = require('../../utils/runtime');
const token = '12_Ds0m35kW0hNa5ZmdVwe193QTkEyP4uRNmVv7iXdy82pw15gzcYddBpsbCKM3StCRq9DeSaS2GajI_ArSmKeCTYzqWLuTYuIDC2TFCba-o-aqb03AZHc0vz15DYbHhf2LP2sDjn9e1ZvPJLt6KEXbACAFZS'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    this.getOpenId()
    // this.getToken()
  },

  async pay() {
    var res = await this.request('http://localhost:3002/getThemeList', {
      type: 1,
      app_id: 48
    })
    console.log(res)

  },

  // 获取token
  async getToken() {
    var res = await this.request('http://localhost:3000/getToken')
    console.log(res)
  },

  // 获取openId
  getOpenId() {
    wx.login({
      success: async(res) => {
        var data = {
          appid: 'wx4af9684a0185ff36',
          secret: '1f147266c851845779441818aebcd1d6',
          js_code: '071tVFcA1qFLOf0xE6cA1zX4dA1tVFcX',
          grant_type: 'authorization_code'
        }
        let codes = await this.request(`https://api.weixin.qq.com/sns/jscode2session?appid=${data.appid}&secret=${data.secret}&js_code=${data.js_code}&grant_type=${data.grant_type}`)
        console.log(codes)
      }
    })
    console.log('g\/5dZTkjjRnqg5TVMJhCtg==')
    
  },

  scan() {
    wx.scanCode({
      success(res) {
        console.log(res)

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.request({
      url: 'http://192.168.1.147/api/goods/goodsDetail', //仅为示例，并非真实的接口地址
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" // 默认值
      },
      method: 'POST',
      id: 711,
      success: function(res) {
        console.log(res)
      }
    })
  },
  onShow(e) {
    // wx.switchTab({
    //   url: '/pages/page1/page1?aa=2',
    // })
    // wx.navigateTo({
    //   url: '../index/index?aa=22',
    // })
  },
  async submit(e) {
    let data = e.detail.value
    // if (Object.values(data).some(x => !x)) {
    //   wx.showToast({
    //     title: '请输入完整内容',
    //     icon: 'none'
    //   })
    //   return
    // }
    var res = await this.request('http://localhost:3002/api/getApp')
    console.log(res)
    // this.request('http://localhost:3001/api/getApp', data).then((res) => {
    //   console.log(res)
    // })
  },

  request(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  syncFunction(fn) {
    return function(data = {}) {
      return new Promise((reslove, reject) => {
        fn(data)
        data.success = (res) => reslove(res)
        data.fail = (res) => reject(res)
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})