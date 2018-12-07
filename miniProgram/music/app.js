//app.js

/**
 * 四组缓存数据
 * likeSong 喜欢的歌曲
 * historSong 播放历史
 * playSong 播放列表
 * historyKey 搜索历史
 */
App({
  onLaunch: function() {
    this.createMusic()
    // 等待app创建完毕后再加载
    // setTimeout(()=>{
    //   var util = require('./utils/util')
      
    // },1000)
  },

  // 创建一个音频
  createMusic() {
    const innerAudioContext = wx.getBackgroundAudioManager()
    this.globalData.music = innerAudioContext
  },
  globalData: {
    playing:false, // 默认未播放
    userInfo: null,
    currentIndex: 0, // 播放列表索引 默认为0
    playMethod: 1, // 播放方式 0 顺序播放 1 单曲循环 2 随机播放
  }
})