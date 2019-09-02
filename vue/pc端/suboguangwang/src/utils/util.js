import myEE from './eventEmitter'
import axios from 'axios'
import constant from './Constant'
import { LoadingBar, Message } from 'iview'
/*
* array 操作的数组
* fromIndex 被操作item的索引
* move 1上移 -1下移 0置顶
* */
// Date.prototype.Format = function (fmt = 'yyyy-MM-dd hh:mm:ss') { // author: meizz
//   var o = {
//     'M+': this.getMonth() + 1, // 月份
//     'd+': this.getDate(), // 日
//     'h+': this.getHours(), // 小时
//     'm+': this.getMinutes(), // 分
//     's+': this.getSeconds(), // 秒
//     'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
//     'S': this.getMilliseconds() // 毫秒
//   }
//   if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
//   for (var k in o) {
//     if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
//   }
//   return fmt
// }

export function getSimpleText(html) {
  var re1 = new RegExp('<.+?>', 'g'); // 匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
  var msg = html.replace(re1, ''); // 执行替换成空字符
  return msg;
}

export function slideTo(targetPageY) {
  var timer = setInterval(function () {
    var currentY = document.documentElement.scrollTop || document.body.scrollTop; // 当前及滑动中任意时刻位置
    var distance = targetPageY > currentY ? targetPageY - currentY : currentY - targetPageY; // 剩余距离
    var speed = Math.ceil(distance / 10); // 每时刻速度
    if (currentY == targetPageY) {
      clearInterval(timer);
    } else {
      window.scrollTo(0, targetPageY > currentY ? currentY + speed : currentY - speed);
    }
  }, 10);
}

export const parseQueryString = (url) => {
  var regUrl = /^[^?]+\?([\w\W]+)$/
  var regPara = /([^&=]+)=([\w\W]*?)(&|$)/g // g is very important
  var arrUrl = regUrl.exec(url)
  ret = {}
  if (arrUrl && arr_url[1]) {
    var strPara = arr_url[1]
    var result
    while ((result = regPara.exec(strPara)) != null) {
      ret[result[1]] = result[2]
    }
  }
  return ret
}
export const arrayMove = (array, fromIndex, move) => {
  // 不在数组长度范围内移动则返回原数组
  if (fromIndex + move < 0 || fromIndex + move >= array.length || (fromIndex == 0 && move == 0)) {
    return array
  }
  if (move == 0) {
    // 置顶
    array.unshift(array.splice(fromIndex, 1)[0])
  } else {
    // 上下移动
    array[fromIndex + move] = array.splice(fromIndex, 1, array[fromIndex + move])[0]
  }
  return array
}

export function getScrollTop() {
  var scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

export function throttle(method, delay = 100, duration = 500) {
  var timer = null
  var begin = new Date()
  return function () {
    var context = this
    var args = arguments
    var current = new Date()
    clearTimeout(timer)
    if (current - begin >= duration) {
      method.apply(context, args)
      begin = current
    } else {
      timer = setTimeout(function () {
        method.apply(context, args)
      }, delay)
    }
  }
}

/**
 * 检验手机号码
 */
export const checkPhone = (tel) => {
  if ((/^0\d{2,3}-?\d{7,8}$/.test(tel) || /^1(3|4|5|6|7|8|9)\d{9}$/.test(tel) || /^400[0-9]{7}/.test(tel))) {
    return true
  } else {
    return false
  }
}
export const objDeepCopy = function (source) {
  var sourceCopy = source instanceof Array ? [] : {}
  for (var item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}
export const clone = function (source) {
  var sourceCopy = source instanceof Array ? [] : {}
  for (var item in source) {
    sourceCopy[item] = typeof source[item] === 'object' && source[item] ? clone(source[item]) : source[item]
  }
  return sourceCopy
}

export const getDate = (day) => {
  let today = new Date()

  let timeStamp = today.getTime() + 1000 * 60 * 60 * 24 * day

  today.setTime(timeStamp)

  let tYear = today.getFullYear()
  let tMonth = today.getMonth() >= 9 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)
  let tDate = today.getDate() >= 10 ? today.getDate() : '0' + (today.getDate() + 1)
  return tYear + '-' + tMonth + '-' + tDate
}

export const postMessage = (type, key) => {
  if (window.env == 'ali') {
    window.my.postMessage({ type: type, key: key })
  } else {
    window.ws.send(JSON.stringify({
      type: '1',
      token: localStorage.getItem('token'),
      data: {
        type: type,
        key: key
      }
    }))
  }
}

export const onMessage = (key, callback, method = true) => {
  if (method) {
    myEE.once(key, callback)
  } else {
    myEE.on(key, callback)
  }
}

// 选择位置
// export const chooseLocation = (callback) => {
//   postMessage('location', 'chooseLocation')
//   onMessage('chooseLocation', data => {
//     callback(data)
//   })
// }

// 页面跳转
export const goPage = (url) => {
  myEE.emit('push', url)
}

export const Axios = {
  get: (path, para, isShowMsg = false, baseURL = constant.getNetWork()) => {
    !constant.data.isLoading && LoadingBar.start()
    constant.data.isLoading = true
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: path,
        baseURL: baseURL,
        params: para,
        headers: {
          // 'x-auth-token': constant.getToken(),
          'Content-Type': 'Application/json; charset=UTF-8'
        },
        timeout: 60000,
        responseType: 'json'
      }).then((res) => {
        LoadingBar.finish()
        constant.data.isLoading = false
        if (res.data.retCode == 0) {
          resolve(res.data.data)
        } else if (res.data.retCode == '8193') {
          if (window.env == 'wx' && window.ws && window.ws.readyState != 1) {
            constant.data.taskArr.push({ type: 'token', key: 'token' })
          } else {
            postMessage('token', 'token')
          }
          onMessage('token', async (mesData) => {
            if (mesData.token) {
              localStorage.setItem('token', mesData.token)
              constant.user_id.phone = mesData.phone
            } else {
              localStorage.setItem('token', mesData)
            }
            try {
              let res2 = Axios.get(path, para, isShowMsg, baseURL)
              resolve(res2)
            } catch (e) {
              reject(new Error())
            }
          })
        } else {
          if (isShowMsg) {
            LoadingBar.finish()
            constant.data.isLoading = false
            LoadingBar.finish()
            constant.data.isLoading = false
            Message.warning(res.data.retMsg)
          }
          Message.warning(`请求失败！，请检查参数`)
        }
      })
    })
  },
  post: (path, para, isShowMsg = false, baseURL = constant.getNetWork()) => {
    !constant.data.isLoading && LoadingBar.start()
    constant.data.isLoading = true
    return new Promise((resolve, reject) => {
      return axios({
        method: 'post',
        url: path,
        baseURL: baseURL,
        data: para,
        headers: {
          // 'x-auth-token': constant.getToken(),
          'Content-Type': 'Application/json; charset=UTF-8'
        },
        timeout: 60000,
        responseType: 'json'
      }).then((res) => {
        LoadingBar.finish()
        constant.data.isLoading = false
        if (res.data.retCode == 0) {
          resolve(res.data)
        } else if (res.data.retCode == '8193') {
          if (window.env == 'wx' && window.ws && window.ws.readyState != 1) {
            constant.data.taskArr.push({ type: 'token', key: 'token' })
          } else {
            postMessage('token', 'token')
          }
          onMessage('token', async (mesData) => {
            if (mesData.token) {
              localStorage.setItem('token', mesData.token)
              constant.user_id.phone = mesData.phone
            } else {
              localStorage.setItem('token', mesData)
            }
            try {
              let res2 = Axios.post(path, para, isShowMsg, baseURL)
              resolve(res2)
            } catch (e) {
              reject(new Error())
            }
          })
        } else {
          if (isShowMsg) {
            Message.warning(res.data.retMsg)
          }
          Message.warning(`请求失败！，请检查参数`)
        }
      })
    })
  }
}
export const delayFn = (fn, condition, attr) => {
  let count = 0
  let timer = setInterval(() => {
    console.log(condition[attr])
    if (condition[attr]) {
      clearInterval(timer)
      fn()
    } else {
      count++
      if (count > 50) {
        clearInterval(timer)
      }
    }
  }, 100)
}

export const CallPhone = (number, fromType) => {
  switch (fromType) {
    case '1': // h5
  }
}
export default goPage
