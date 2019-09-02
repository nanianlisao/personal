// pages/scope/scope.js
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
    loginCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.userLocation) {
      this.setData({
        userLocation: options.userLocation
      })
    }
    if (options.scope == 'userInfo') {
      this.setData({
        scope: 'userInfo'
      })
    }
    this.setData({
      appName: app.globalData.app_name
    })
  },

  getCode(e) {

    wx.login({
      success: (res) => {
        this.data.loginCode = res.code
      }
    })
  },

  async getPhoneNumber(e) {
    console.log(e)
    try {
      if (e.detail.encryptedData) {
        var code = null
        if (this.data.loginCode) {
          code = this.data.loginCode
        } else {
          var fn = util.asyncFunction(wx.login)
          var loginInfo = await fn()
          code = loginInfo.code
        }
        var res = await userServer.phone({
          code: code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        })
        if (!res.data.purePhoneNumber) {
          var res = await userServer.phone({
            code: code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          })
        }
        console.log(res.data.purePhoneNumber)
        var pages = getCurrentPages()
        var lastPage = pages[pages.length - 2]
        lastPage.sendMessage('phone', res.data.purePhoneNumber);
        wx.navigateBack({
          delta: 1
        })
      }
    } catch (e) {
      console.log(e)
    }
  },

  async bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      //获取用户信息
      let userInfo = e.detail.userInfo
      userInfo.nickName = userInfo.nickName.replace(/[^\u4e00-\u9fa5\w]/g, '*')
      console.log(userInfo)
      var pages = getCurrentPages()
      var lastPage = pages[pages.length - 2]
      lastPage.sendMessage('userInfo', userInfo);
      wx.navigateBack({
        delta: 1
      })
    }
  },

  async opensetting(e) {
    console.log(e)
    if (e.detail.authSetting['scope.userLocation']) {
      var fn = this.data.userLocation == 1 ? util.asyncFunction(wx.getLocation) : util.asyncFunction(wx.chooseLocation)
      var res = await fn()
      var key = this.data.userLocation == 1 ? 'getLocation' : 'location'
      var pages = getCurrentPages()
      var lastPage = pages[pages.length - 2]
      lastPage.sendMessage(key, res);
      wx.navigateBack({
        delta: 1
      })
    }
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


})