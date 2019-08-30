// pages/singer-detail/singer-detail.js
const app = getApp()
var regeneratorRuntime = require('../../utils/runtime');
var util = require('../../utils/util');
Page({

  // 页面的初始数据
  data: {

  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.getSingerDetail(options.mid)
  },

  // 获取歌手详情
  async getSingerDetail(mid) {
    let res = await util.request(`https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=${mid}`)
    let data = JSON.parse(res.data)
    console.log(data)
    data.data.list.map(x => {
      x.singer = util.formatSinger(x.musicData.singer)
    })
    this.setData({
      singer: data.data
    })
  },

  // 单击某首歌，播放
  toPlay(e) {
    var oldItem = e.currentTarget.dataset.item
    // 新歌曲的信息
    var newItem = {
      songmid: oldItem.musicData.songmid,
      songname: oldItem.musicData.songname,
      imgUrl: `http://imgcache.qq.com/music/photo/album_300/${oldItem.musicData.albumid % 100}/300_albumpic_${oldItem.musicData.albumid}_0.jpg`,
      singer: oldItem.singer,
      albumname: oldItem.musicData.albumname
    }
    util.playMusic(newItem) // 播放新歌曲
  },

  // 随机播放全部
  randomPlay() {
    var list = this.data.singer.list
    var playSong = list.map(oldItem => {
      var newItem = {
        songmid: oldItem.musicData.songmid,
        songname: oldItem.musicData.songname,
        imgUrl: `http://imgcache.qq.com/music/photo/album_300/${oldItem.musicData.albumid % 100}/300_albumpic_${oldItem.musicData.albumid}_0.jpg`,
        singer: oldItem.singer,
        albumname: oldItem.musicData.albumname
      }
      return newItem
    })
    wx.setStorageSync('playSong', JSON.stringify(playSong.slice(0, 100))) // 清空播放列表，添加新的播放列表 播放列表最大为100首歌
    app.globalData.playMethod = 2 // 播放方式更改为随机播放
    wx.navigateTo({
      url: '/pages/player/player?play=play' // 带options = play 表示更新歌曲内容
    })
    util.updateHistory(playSong[0])
    util.play(playSong[0])
  },


  // 返回上一页
  reback() {
    util.reback()
  }
})