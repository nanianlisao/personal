// pages/share/share.js
var util = require('../../utils/util')
var Promise = require('../../utils/bluebird')
var regeneratorRuntime = require('../../utils/runtime')
import {
  userServer
} from '../../xcxs/user/User'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.share)
    let obj = JSON.parse(options.share)
    app.globalData.token = obj.token
    this.setData({
      appName: app.globalData.app_name,
      type: obj.type,
      obj: obj,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    (async() => {
      if (this.data.type == 'member') {
        try {
          var res = await util.wx_requestPost(app.globalData.requestUrl + 'member/share/record/save', {
            url: '/pages/index/index'
          })
        } catch (e) {
          console.log(e)
        }
      } else if (this.data.type == 'baojia') {
        var res = await util.wx_requestGet(app.globalData.requestUrl + `offer/share/save/${this.data.obj.offerId}`)
      } else if (this.data.type == 'quanzi') {
        var res = await util.wx_requestGet(app.globalData.requestUrl + `circle/share/save/${this.data.obj.circleId}`)
      }
    })()

    return {
      path: '/pages/index/index',
     
    }
  }
})