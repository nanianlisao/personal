const Promise = require('./bluebird');
const isDebug = true;
const app = getApp()
var objDeepCopy = function(source) {
  var sourceCopy = source instanceof Array ? [] : {}
  for (var item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}
// 功能描述：时间格式化

Date.prototype.Format = function(fmt = "yyyy-MM-dd hh:mm:ss") { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 异步转同步函数
function asyncFunction(fn) {
  return function(data = {}) {
    return new Promise(function(resolve, reject) {
      data.success = res => resolve(res);
      data.fail = res => reject(res);
      fn(data);
    });
  }
}


// 检验手机号码
function checkPhone(tel) {
  if ((/^0\d{2,3}-?\d{7,8}$/.test(tel) || /^1(3|4|5|7|8|9)\d{9}$/.test(tel) || /^400[0-9]{7}/.test(tel))) {
    return true
  } else {
    return false
  }
}

// 格式化歌手
function formatSinger(arr) {
  var newArr = arr.map(x => x.name)
  return newArr.join('/')
}

// 请求
function request(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      dataType: 'jsonp',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 数组原型上定义unique()去重 根据songmid
Array.prototype.unique = function() {
  var hash = {};
  return this.reduce(function(item, next) {
    hash[next.songmid] ? '' : hash[next.songmid] = true && item.push(next)
    return item
  }, [])
}

// 数组去重
function unique2(arr) {
  var hash = {};
  arr = arr.reduce(function(item, next) {
    hash[next.songmid] ? '' : hash[next.songmid] = true && item.push(next);
    return item
  }, [])
  return arr
}

function reback() {
  wx.navigateBack({
    delta: 1
  })
}

// 播放新歌曲(更新播放列表，跳转到播放页面，更新播放历史，播放)
function playMusic(newItem) {
  let playSong = wx.getStorageSync('playSong') ? JSON.parse(wx.getStorageSync('playSong')) : []
  playSong.unshift(newItem) // 在列表首位添加歌曲内容
  playSong = playSong.unique() // 去除重复的歌曲
  wx.setStorageSync('playSong', JSON.stringify(playSong.slice(0, 100))) // 清空播放列表，添加新的播放列表 播放列表最大为100首歌
  wx.navigateTo({
    url: '/pages/player/player?play=play' // 带options = play 表示更新歌曲内容
  })
  app.globalData.currentIndex = 0
  updateHistory(newItem)
  play(newItem)
}

// 更新播放历史
function updateHistory(newItem) {
  let historSong = wx.getStorageSync('historSong') ? JSON.parse(wx.getStorageSync('historSong')) : [] // 获取播放历史
  historSong.unshift(newItem)
  historSong = historSong.unique() // 去除重复的歌曲
  wx.setStorageSync('historSong', JSON.stringify(historSong.slice(0, 100))) // 更新历史播放列表 最大为100首歌
}

// 更新播放历史
function updateLike(newItem) {
  let likeSong = wx.getStorageSync('likeSong') ? JSON.parse(wx.getStorageSync('likeSong')) : [] // 获取播放历史
  likeSong.unshift(newItem)
  likeSong = likeSong.unique() // 去除重复的歌曲
  wx.setStorageSync('likeSong', JSON.stringify(likeSong.slice(0, 100))) // 更新历史播放列表 最大为100首歌
}


// 播放
function play(newItem) {
  let music = app.globalData.music // 音乐播放器实例
  music.src = `http://ws.stream.qqmusic.qq.com/C100${newItem.songmid}.m4a?fromtag=0&guid=126548448`
  music.singer = newItem.singer // 歌手
  music.title = newItem.songname // 歌名
  music.epname = newItem.albumname // 专辑名
  music.coverImgUrl = newItem.imgUrl // 封面图
  music.play() // 播放音乐
  app.globalData.playing = true
}

// 生成一个随机序号, 尽可能不等于前一个数
const random = function(arr, index) {
  if (arr.length == 1) {
    return 0
  }
  var randomIndex = parseInt(Math.random() * arr.length)
  if (index && randomIndex == index) {
    return random(arr, index)
  }else{
    return randomIndex
  }
}

// 切歌时的播放
function togglePlay(index) {
  let playSong = wx.getStorageSync('playSong') ? JSON.parse(wx.getStorageSync('playSong')) : []
  app.globalData.currentIndex = index // 更新播放列表数据
  var currentSong = playSong[index]
  updateHistory(currentSong)
  play(currentSong)
}



module.exports = {
  objDeepCopy, // 对象深克隆
  request, // 异步请求装同步请求
  asyncFunction, // 异步转同步函数
  reback, // 返回上一页
  formatSinger, // 歌手名格式化
  unique2,
  playMusic, // 播放新歌
  updateHistory, // 更新播放历史
  updateLike,
  play, // 播放
  random,
  togglePlay, // 切歌
};