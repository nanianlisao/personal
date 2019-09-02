// pages/test/test.js
const app = getApp()
var Promise = require('../../utils/bluebird')
var regeneratorRuntime = require('../../utils/runtime')
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: app.globalData.token,
    shareUrlBase: 'https://zzsweb.njshushuo.com',
    shareUrl: 'https://zzsweb.njshushuo.com/index',
    webUrl: 'https://zzsweb.njshushuo.com/index',

    // shareUrlBase: 'http://192.168.1.148:3000',
    // shareUrl: 'http://192.168.1.148:3000/index',
    // webUrl: 'http://192.168.1.148:3000/index',
  },
  // 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.page) { // 从用户分享链接进入
      console.log(options.page)
      var urls = options.page.replace(/\+\+\+\+/g, '?').replace(/----/g, '=')
      this.data.webUrl = urls
    }
    if (options.scene) { // 扫描桌牌码进入
      console.log(options.scene)
      this.data.webUrl = this.data.shareUrlBase + '/checkGoods/CheckGoods?scene=' + options.scene
    }
    var socketKey = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    this.data.socketKey = socketKey
    var webUrl = this.data.webUrl.indexOf('?') > 0 ? `${this.data.webUrl}&token=${app.globalData.token}&socketKey=${socketKey}&appId=${app.globalData.app_id}` : `${this.data.webUrl}?token=${app.globalData.token}&socketKey=${socketKey}&appId=${app.globalData.app_id}`
    console.log(webUrl)
    this.setData({
      token: app.globalData.token,
      webUrl: webUrl
    })
    console.log(app.globalData.token)
    this.createSocket(socketKey)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  createSocket(socketKey) {
    console.log('创建首页socket')
    let type = 1
    let url = `${app.globalData.socketUrl}webSocket/bothway/${socketKey}/${app.globalData.app_id}/${type}`
    console.log(url)
    this.SocketTask2 = wx.connectSocket({
      url
    })
    this.socketTimer = setInterval(() => {
      this.SocketTask2.send({
        data: 'socket'
      })
      console.log('send socket')
    }, 20000)

    this.SocketTask2.onMessage(async(res) => {
      let data = JSON.parse(res.data)
   
      console.log(data)
      switch (data.type) {
        case 'url': // webview页面分享
          this.data.shareUrl = this.data.shareUrlBase + data.val
          break;
        case 'getLocation': // 获取当前位置信息
          wx.getSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation'] === false) { // 已经拒绝过了
                wx.navigateTo({
                  url: '/pages/scope/scope?userLocation=1',
                })
              } else { // 还没有授权过 或者成功授权
                wx.getLocation({
                  success: (res) => {
                    this.sendMessage(data.key, res)
                  },
                })
              }
            }
          })
          break;
        case 'token':
          var fn = util.asyncFunction(wx.login)
          var loginInfo = await fn()
          code = loginInfo.code
          var res = await util.wx_requestPost(this.globalData.requestUrl + `system/login/${this.globalData.app_id}/${code}`)
          this.globalData.token = res.data.data.token
          this.globalData.user_id = res.data.data.user
          this.sendMessage('token', {
            token: app.globalData.token,
            phone: app.globalData.user_id.phone ? app.globalData.user_id.phone : ''
          })
          break;
        case 'scan': // 扫码
          wx.scanCode({
            success: (res) => {
              console.log(res)
              var datas = null
              if (res.result) { // 微信小程序码
                datas = res.result
              } else {
                datas = res.path
              }
              this.sendMessage(data.key, decodeURIComponent(datas))
            }
          })
          break;
        case 'pay': // 支付
          var payOrderWcappletVo = data.key
          wx.requestPayment({
            timeStamp: payOrderWcappletVo.timeStamp,
            nonceStr: payOrderWcappletVo.nonceStr,
            package: 'prepay_id=' + payOrderWcappletVo.prepayId,
            signType: payOrderWcappletVo.signType,
            paySign: payOrderWcappletVo.paySign,
            success: (res) => {
              console.log(res)
              this.sendMessage('pay', 'success')
            },
            fail: (res) => {
              this.sendMessage('pay', 'fail')
            }
          })
          break;

        case 'init':
          var init = {
            // userInfo: app.globalData.userInfo,
            phone: app.globalData.user_id ? app.globalData.user_id.phone : "",
            appId: app.globalData.app_id,
          }
          this.sendMessage('init', init)
          break;

        case 'location': // 获取选择位置
          wx.getSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation'] === false) { // 已经拒绝过了
                wx.navigateTo({
                  url: '/pages/scope/scope?userLocation=2',
                })
              } else { // 还没有授权过 或者成功授权
                wx.chooseLocation({
                  success: (res) => {
                    console.log(res)
                    this.sendMessage(data.key, res)
                  },
                })
              }
            }
          })
          break;

        case 'phone':
          wx.navigateTo({
            url: '/pages/scope/scope',
          })
          break;
        case 'userInfo':
          wx.getUserInfo({
            success: (res) => {
              var userInfo = res.userInfo
              userInfo.nickName = userInfo.nickName.replace(/[^\u4e00-\u9fa5\w]/g, '*')
              this.sendMessage('userInfo', userInfo)
            },
            fail(res) {
              wx.navigateTo({
                url: '/pages/scope/scope?scope=userInfo',
              })
            }
          })
          break;
        case 'loginCode':
          wx.login({
            success: (res) => {
              this.sendMessage('loginCode', res.code)
            },
          })
          break;

        case 'callphone': // 拨打电话
          wx.makePhoneCall({
            phoneNumber: data.key,
          })
          break;
        case 'previewImage': // 预览图片
          wx.previewImage({
            current: data.key.urls[data.key.index], // 当前显示图片的http链接
            urls: data.key.urls // 需要预览的图片http链接列表
          })
          break;
        case 'share': // 分享
          wx.navigateTo({
            url: `/pages/share/share?share=${data.key}`,
          })
          break;
        default:
          break;
      }
    })

    this.SocketTask2.onClose(res => {
      console.log(res)
      if (res.code == 1006) {
        clearInterval(this.socketTimer)
        console.log('发起重连')
        this.createSocket(this.data.socketKey)
      }
  
      console.log('关闭了首页socket')
    })
  },

  sendMessage(key, data) {
    this.SocketTask2.send({
      data: JSON.stringify({
        type: '2',
        appId: app.globalData.app_id,
        token: this.data.socketKey,
        data: {
          key: key,
          data: data,
        }
      })
    })
  },


  onShow() {
    // console.log(this.SocketTask2)
    if (this.SocketTask2 && this.SocketTask2.readyState != 1) {
      console.log('开始重连')

      this.createSocket(this.data.socketKey)
    }
  },


  getMessage(e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.SocketTask2.close()
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
  onShareAppMessage: function(e) {
    var url = '/pages/index/index?page=' + e.webViewUrl.replace(/&/g, '####').replace(/\?/g, '++++').replace(/=/g, '----')
    console.log(url)
    return {
      path: url
    }
  }
})