var util = require('../../../utils/util')
var Promise = require('../../../utils/bluebird')
var regeneratorRuntime = require('../../../utils/runtime')
const app = getApp()
import {
  thirdpartyServer
} from '../../../xcxs/thirdparty/Thirdparty'

Page({
  data: {},
  onLoad(options) {
    this.setData({
      appName: app.globalData.app_name
    })
    // 如果是从外部直接跳转过来的
    // if (options.url) {
    //   this.data.url = '/' + options.url + this.jsonToStr(JSON.parse(options.options))
    // }
  },
  // 参数拼接
  jsonToStr(o) {
    let str = ''
    for (let [key, value] of Object.entries(o)) {
      str += `&${key}=${value}`
    }
    return '?' + str.substr(1)
  },

  async bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      //获取用户信息
      console.log(e.detail.userInfo)
      let userInfo = e.detail.userInfo
      userInfo.nickName = userInfo.nickName.replace(/[^\u4e00-\u9fa5\w]/g, '*')
      app.globalData.userInfo = userInfo
      let res = await thirdpartyServer.relate(userInfo)
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
      // wx.reLaunch({
      //   url: this.data.url,
      // })
    } else {}
  }
})