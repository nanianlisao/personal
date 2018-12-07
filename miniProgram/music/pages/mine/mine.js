// pages/mine/mine.js
var util = require('../../utils/util');
const app = getApp()
Page({

  // 页面的初始数据
  data: {},

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.showLike()
  },

  // 显示喜欢的
  showLike() {
    let likeSong = wx.getStorageSync('likeSong') ? JSON.parse(wx.getStorageSync('likeSong')) : []
    this.setData({
      list: likeSong,
      Index: 1
    })

  },

  // 显示历史
  showHistory() {
    let historSong = wx.getStorageSync('historSong') ? JSON.parse(wx.getStorageSync('historSong')) : []
    this.setData({
      list: historSong,
      Index: 2
    })
  },

  // 随机播放全部
  randomPlay() {
    var playSong = this.data.list
    if (playSong.length == 0) {
      return
    }
    wx.setStorageSync('playSong', JSON.stringify(playSong.slice(0, 100))) // 清空播放列表，添加新的播放列表 播放列表最大为100首歌
    app.globalData.playMethod = 2 // 播放方式更改为随机播放
    // app.globalData.playing = true
    wx.navigateTo({
      url: '/pages/player/player?play=play' // 带options = play 表示更新歌曲内容
    })
    util.updateHistory(playSong[0])
    util.play(playSong[0])
  },

  // 播放
  toPlay(e) {
    util.playMusic(e.currentTarget.dataset.item)
  },

  // 返回上一页
  reback() {
    util.reback()
  },

  // 用户点击右上角分享
  onShareAppMessage() {

  }
})