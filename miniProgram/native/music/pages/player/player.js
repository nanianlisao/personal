// pages/player/player.js
var util = require('../../utils/util');
const app = getApp()
Page({

  // 页面的初始数据
  data: {
    playing: false,
    playMethod: [{
      code: 0,
      className: 'icon-sequence',
      name: '顺序播放'
    }, {
      code: 1,
      className: 'icon-loop',
      name: '单曲循环'
    }, {
      code: 2,
      className: 'icon-random',
      name: '随机播放'
    }]
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      Index: app.globalData.playMethod, // 播放方式
      playing: app.globalData.playing
    })
    this.updatePage() // 更新页面
  },

  // 页面展示时，监听事件，更改页面
  onShow() {
    this.onEvent()
  },

  // 监听播放器暂停，结束等事件
  onEvent() {
    let music = app.globalData.music // 音乐播放器实例
    music.onTimeUpdate(() => { // 监听歌曲进度，更新页面
      let currentSecone = this.formatTime(music.currentTime)
      let progress = parseInt(music.currentTime / music.duration * 200)
      let totalSecond = this.formatTime(music.duration)
      this.setData({
        currentSecone: currentSecone,
        progress: progress,
        totalSecond
      })
    })
    music.onEnded(() => { // 监听播放完
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
    // music.onSeeking(() => { // 开始跳转操作事件
    //   console.log('onSeeking')
    //   // music.pause()
    // })
    music.onSeeked(() => { // 完成跳转操作事件
      console.log('onSeeked')
      music.play()
    })
    music.onPause(() => { // 暂停事件
      console.log('onPause')
      app.globalData.playing = false
      this.setData({
        playing: false
      })
      console.log(this.data.playing)
    })
    music.onPlay(() => { // 播放事件
      console.log('onPlay')
      app.globalData.playing = true
      this.setData({
        playing: true
      })
      console.log(this.data.playing)
    })
  },

  // 页面在后台时，清除掉onTimeUpdate事件
  onHide() {
    let music = app.globalData.music // 音乐播放器实例
    music.onTimeUpdate(() => { // 监听歌曲进度，更新页面
      return false
    })
  },

  // 更新播放列表页的内容
  updatePage() {
    let playSong = wx.getStorageSync('playSong') ? JSON.parse(wx.getStorageSync('playSong')) : []
    let likeSong = wx.getStorageSync('likeSong') ? JSON.parse(wx.getStorageSync('likeSong')) : []
    var currentSong = playSong[app.globalData.currentIndex] // 当前播放列表
    let liked = likeSong.some(x => x.songmid === currentSong.songmid)
    this.setData({
      song: currentSong,
      liked: liked
    })
  },

  // 切换播放方式 (随机，单曲，顺序播放)
  troggleMethod() {
    this.data.Index++;
    this.setData({
      Index: this.data.Index % 3
    })
    app.globalData.playMethod = this.data.Index // 更新到全局
  },

  // 切歌
  troggleSong(e) {
    let type = e.currentTarget.dataset.type
    let currentIndex = app.globalData.currentIndex
    let playSong = wx.getStorageSync('playSong') ? JSON.parse(wx.getStorageSync('playSong')) : []
    // 判断播放方式
    if (this.data.Index == 2) { // 随机播放
      currentIndex = util.random(playSong, currentIndex)
    } else {
      if (type == 'next') { // 下一曲
        currentIndex = currentIndex + 1 < playSong.length ? currentIndex + 1 : 0
      } else { // 上一曲
        currentIndex = currentIndex - 1 < 0 ? playSong.length - 1 : currentIndex - 1
      }
    }
    util.togglePlay(currentIndex)
    this.setData({
      song: playSong[currentIndex]
    })
  },

  // 加入||取消 喜欢的音乐
  updataLike() {
    let likeSong = wx.getStorageSync('likeSong') ? JSON.parse(wx.getStorageSync('likeSong')) : []
    if (!this.data.liked) {
      util.updateLike(this.data.song) // 添加到喜爱的歌曲中
    } else { // 添加到喜爱的歌曲中删除
      likeSong.map((x, index) => {
        if (x.songmid === this.data.song.songmid) {
          likeSong.splice(index, 1)
        }
      })
      wx.setStorageSync('likeSong', JSON.stringify(likeSong))
    }
    this.setData({
      liked: !this.data.liked
    })
  },

  // 播放或者暂停
  trogglePlay() {
    let music = app.globalData.music
    if (!this.data.playing) {
      if (music.src) {
        music.play()
      } else {
        util.play(this.data.song)
      }
    } else {
      music.pause()
    }
  },

  // 更改播放进度
  sliderChange(e) {
    let second = e.detail.value
    let music = app.globalData.music
    music.seek(second)
  },

  // 返回上一页
  reback() {
    util.reback()
  },

  // 将秒转成 mm:ss
  formatTime(num) {
    var add0 = x => x > 9 ? x : `0${x}`
    return add0(parseInt(num / 60)) + ':' + add0(parseInt(num % 60))
  },

  onUnload() {
    let music = app.globalData.music // 音乐播放器实例
    music.onTimeUpdate(() => { // 监听歌曲进度，更新页面
      return false
    })
  },

  // 用户点击右上角分享
  onShareAppMessage() {

  }
})