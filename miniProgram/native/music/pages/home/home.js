// pages/home/home.js
var regeneratorRuntime = require('../../utils/runtime');
var util = require('../../utils/util');
const app = getApp()
Page({

  // 页面的初始数据
  data: {
    shutDown: false,
    // mid:'001fNHEf1SFEFN',
    showBottomPlayer: false, // 是否展示下面播放器
    tabIndex: 0,
    tabList: [{
      name: '推荐',
      transform: 90
    }, {
      name: '歌手',
      transform: 340
    }, {
      name: '搜索',
      transform: 590
    }],
  },

  // 生命周期函数--监听页面加载
  async onLoad(options) {
    let nowTime = new Date().getTime()
    if (Number(nowTime) < 1539079800000) {
      console.log(nowTime)
      this.setData({
        shutDown: true
      })
      // const music = wx.createInnerAudioContext()
      // music.src ='http://ws.stream.qqmusic.qq.com/C100001OyHbk2MSIi4.m4a?fromtag=0&guid=126548448'
      // music.play()
      return
    }

    this.getRecommendList()
    // this.getSingerList()
    // this.getHotSearch()
    this.onEvent() // 检测播放器
  },

  // 获取推荐页数据
  async getRecommendList() {
    // 轮播图数据
    let res = await util.request('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1')
    let data = JSON.parse(res.data)
    this.setData({
      slider: data.data.slider
    })
    // 热门歌单数据
    let res2 = await util.request('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923')
    let data2 = JSON.parse(res2.data)
    var songlist = data2.songlist.slice(0, 50)
    songlist.map(x => {
      x.imgUrl = `http://imgcache.qq.com/music/photo/album_300/${x.data.albumid % 100}/300_albumpic_${x.data.albumid}_0.jpg`
      x.singer = util.formatSinger(x.data.singer)
    })
    this.setData({
      songList: songlist
    })
  },

  // 获取歌手页数据
  async getSingerList() {
    let res = await util.request('https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&jsonpCallback=getUCGI20809353664027608&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D')
    let data = JSON.parse(res.data)
    let singerList = data.singerList.data.singerlist
    // console.log(singerList)
    this.setData({
      singerList: singerList
    })
  },

  // 获取热门搜索
  async getHotSearch() {
    let res = await util.request('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5')
    // console.log(data)
    let data = JSON.parse(res.data)
    this.setData({
      hotKey: data.data.hotkey.slice(0, 10)
    })
    let historyKey = wx.getStorageSync('historyKey')
    if (historyKey) {
      this.setData({
        historyKey: JSON.parse(historyKey)
      })
    }
  },


  changeTab(e) {
    let index = e.currentTarget.dataset.index
    if (index === this.data.tabIndex) {
      return
    }
    if (index == '1') {
      this.getSingerList()
    }
    if (index == '2') {
      this.getHotSearch()
    }
    this.setData({
      tabIndex: index
    })
  },

  // 显示歌手详情页
  toSingerDetail(e) {
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail?mid=' + e.currentTarget.dataset.mid,
    })
  },

  // 点击播放歌曲
  toPlay(e) {
    var oldItem = e.currentTarget.dataset.item
    // 生成新歌曲的信息
    var newItem = {
      songmid: oldItem.data.songmid,
      imgUrl: oldItem.imgUrl,
      songname: oldItem.data.songname,
      singer: oldItem.singer,
      albumname: oldItem.data.albumname
    }
    util.playMusic(newItem) // 播放新歌曲
  },

  toMine() {
    wx.navigateTo({
      url: '/pages/mine/mine',
    })
  },

  toPlayer() {
    wx.navigateTo({
      url: '/pages/player/player',
    })
  },

  // 监听播放器暂停，结束等事件
  onEvent() {
    let music = app.globalData.music // 音乐播放器实例
    music.onEnded(() => { // 监听播放完
      console.log('onEnded')
      var playMethod = app.globalData.playMethod
      let playSong = wx.getStorageSync('playSong') ? JSON.parse(wx.getStorageSync('playSong')) : []
      let currentIndex = app.globalData.currentIndex
      switch (playMethod) {
        case 0: // 顺序播放
          currentIndex = currentIndex + 1 < playSong.length ? currentIndex + 1 : 0
          break;
        case 1: // 单曲播放
          break;
        case 2: // 随机播放
          currentIndex = util.random(playSong, currentIndex)
          break;
      }
      app.globalData.currentIndex = currentIndex
      util.togglePlay(currentIndex)
      this.updatePage() // 歌曲结束后更新封面
    })
    music.onPause(() => { // 暂停事件
      app.globalData.playing = false
      console.log('home-onPause')
      this.setData({
        playing: false
      })
    })
    music.onPlay(() => { // 播放事件
      app.globalData.playing = true
      this.setData({
        playing: true
      })
    })
  },

  // 更新页面
  updatePage() {
    let playSong = wx.getStorageSync('playSong') ? JSON.parse(wx.getStorageSync('playSong')) : []
    var currentSong = playSong[app.globalData.currentIndex] // 当前播放列表
    this.setData({
      currentSong: currentSong,
      playing: app.globalData.playing ? app.globalData.playing : false
    })
  },

  trogglePlay() {
    let music = app.globalData.music
    if (!this.data.playing) {
      music.play()
      app.globalData.playing = true
    } else {
      music.pause()
      app.globalData.playing = false
    }
  },

  onShow() {
    let music = app.globalData.music
    if (music && music.src) {
      this.setData({
        showBottomPlayer: true
      })
      this.updatePage()
    } else {
      this.setData({
        showBottomPlayer: false
      })
    }
  },

  // 生命周期函数--监听页面隐藏
  onHide: function() {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {

  },

  // 用户点击右上角分享
  onShareAppMessage: function() {

  }
})