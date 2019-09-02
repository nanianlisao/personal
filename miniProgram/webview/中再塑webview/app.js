//app.js
var util = require('./utils/util')
var Promise = require('./utils/bluebird')
var regeneratorRuntime = require('./utils/runtime')
App({
  onLaunch: function(options) {
    this.options = options
    this.getNewVersion() // 检测新版本
    this.claerCache()
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      this.login(this)

    }
  },

  // 检测新版本
  getNewVersion() {
    try {
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        // 向后台去请求最新版本
        updateManager.onCheckForUpdate((res) => {
          // 如果有新版本
          if (res.hasUpdate) {
            // 下载新版本，成功后回调
            updateManager.onUpdateReady(() => {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否马上重启小程序？',
                success(res) {
                  if (res.confirm) {
                    // 当新版本下载完成，调用该方法会强制当前小程序应用上新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            // 下载新版本，失败后回调
            updateManager.onUpdateFailed(() => {
              wx.showModal({
                title: '已经有新版本了哟',
                content: '新版本已经上线啦，请您删除当前小程序后，重新搜索打开哟~',
              })
            })
          }
        })
      }
    } catch (e) {}
  },

  // 检查用户是否授权信息

  checkSetting() {
    wx.getSetting({
      success: async(res) => {
        // 如果没授权
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/login/open/open',
          })
          // let page = getCurrentPages()
          // let currentPage = page[page.length - 1]
          // let route = currentPage.route ? currentPage.route : currentPage.__route__ // 低版本库兼容
          // if (route == 'pages/login/login') {
          //   return
          // }
          // wx.redirectTo({
          //   url: `/pages/login/open/open?url=${route}&options=${JSON.stringify(currentPage.options)}`,
          // })
        } else {
          var userInfo;
          //获取用户信息
          var fn = util.asyncFunction(wx.getUserInfo)
          userInfo = await fn()
          // console.log(userInfo)
          userInfo.userInfo.nickName = userInfo.userInfo.nickName.replace(/[^\u4e00-\u9fa5\w]/g, '*')
          this.globalData.userInfo = userInfo.userInfo
          // 每次进入后 更新用户头像昵称信息
          var res = await util.wx_requestPost(this.globalData.requestUrl + 'thirdparty/modify/relate', {
            data: userInfo.userInfo
          })
        }
      }
    })
  },

  // 登录
  login: async function(that) {
    //登录获取code
    var code
    try {
      var fn = util.asyncFunction(wx.login)
      var loginInfo = await fn()
      util.debug(loginInfo)
      code = loginInfo.code
    } catch (e) {
      console.log(e)
    }

    wx.showToast({
      title: '正在登陆...',
      icon: 'loading',
      duration: 500
    })
    try {
      var res = await util.wx_requestPost(this.globalData.requestUrl + `system/login/${this.globalData.app_id}/${code}`)
      this.globalData.token = res.data.data.token
      this.globalData.user_id = res.data.data.user
      wx.setStorageSync('user_id', res.data.data.user.userId)
      this.checkSetting()
    } catch (e) {

    }

    this.globalData.isLoginFinish = true
    // this.checkSetting()
    // let sourceType = 1
    // if (this.options && this.options.query.q) {
    //   sourceType = 2
    // }
    // try {
    //   var res2 = await util.wx_requestPost(this.globalData.requestUrl + `thirdparty/source/${sourceType}`)
    // } catch (e) {}
  },

  // 清除缓存数据
  claerCache: function() {
    setInterval(() => {
      if (this.globalData.cache) {
        this.globalData.cache.forEach(function(value, key, mapObj) {
          if (value.isTimeOut()) {
            mapObj.delete(key)
            //console.log(value + '--删除数据-' + key + '---' + mapObj)  
          }
          //console.log("============") 
        })
      }
    }, 5 * 60 * 1000)
  },



  globalData: {
    isLoginFinish: false,
    token: "",
    pageSize: 10,
    userInfo: null,
    vedio: "http://video.njdream.cn/xcx/",


    requestUrl: "https://zzsapi.njshushuo.com/",
    socketUrl: 'wss://zzsapi.njshushuo.com/',
    imgUrl: 'https://file.njshushuo.com/',


    // requestUrl: "http://192.168.1.81:8080/",
    // socketUrl: 'ws://192.168.1.81:8080/',
    // imgUrl: 'https://192.168.1.81:8070/file/pic/url/',


    // requestUrl: "http://test.api.njdream.cn/",
    // socketUrl: 'ws://test.api.njdream.cn/',
    // imgUrl: 'https://wx.ershoudaren.cn/file/pic/url/',


    resourUrl: 'https://wx.ershoudaren.cn/', // 短信路径
    app_id: 100,
    app_name: "中再塑",

  }
})