const app = getApp();
const util = require('../utils/util.js')
const url = getApp().globalData.requestUrl;
class Base {

  constructor() {
    if (!app.globalData.cache) {
      app.globalData.cache = new Map();
    }
  }
  /**
   * 功能实现描述：  request Get请求
   * @param path  路径
   * @param data 数据
   * @param flag 默认优先调用缓存
   * @return  
   */

  requestGet(path, data) {
    wx.showLoading({
      title: '请稍后',
    })
    data.noCache = true
    const key = path + JSON.stringify(data);
    if (app.globalData.cache.has(key) && !app.globalData.cache.get(key).isTimeOut() && !(data.noCache)) {
      // console.log("===进入缓存===");
      return this._returnData(app.globalData.cache.get(key).getValue());
    } else {
      // console.log("===缓存没有数据===");
      var that = this;
      return new Promise((resolve, reject) => {
        let count = 0
        let timer = setInterval(() => {
          if (getApp().globalData.token) {
            clearInterval(timer)
            delete data.noCache
            return util.wx_requestGet(url + path, {
              data: data
            }).then(res => {
              wx.hideLoading()
              if (res.data.retCode == 0) {
                app.globalData.cache.set(key, new CacheWrapper(new Date().getTime(), {
                  ...res.data
                }, data.timess));
                resolve(res.data);
              } else {
                reject({
                  errorCode: that._getErrorCode(),
                  res: res.data,
                  msg: `获取数据失败！，请检查参数： ${JSON.stringify(data)}`
                });
              }
            });
          } else {
            count++
            if (count > 100) {
              clearInterval(timer)
              reject({
                errorCode: that._getErrorCode(),
                msg: '登录失败'
              });
              wx.showModal({
                title: '提示',
                content: '登录失败',
              })
            }
          }
        }, 200)
      })
    }

  }
  /**
   * 功能实现描述：  request Post请求
   * @param path  路径
   * @param data 数据
   * @param flag 默认优先调用缓存
   * @return  
   */


  requestPost(path, data) {
    wx.showLoading({
      title: '请稍后',
    })
    data.noCache = true
    const key = path + JSON.stringify(data);
    if (app.globalData.cache.has(key) && !app.globalData.cache.get(key).isTimeOut() && !(data.noCache)) {
      // console.log("===进入缓存===");
      return this._returnData(app.globalData.cache.get(key).getValue());
    } else {
      // console.log("===缓存没有数据===");
      var that = this;
      return new Promise((resolve, reject) => {
        let count = 0
        let timer = setInterval(() => {
          if (getApp().globalData.token) {
            clearInterval(timer)
            delete data.noCache
            return util.wx_requestPost(url + path, {
              data: data
            }).then(res => {
              wx.hideLoading()
              if (res.data.retCode == 0) {
                app.globalData.cache.set(key, new CacheWrapper(new Date().getTime(), {
                  ...res.data
                }, data.timess));
                resolve(res.data);
              } else {
                reject({
                  errorCode: that._getErrorCode(),
                  res: res.data,
                  msg: `获取数据失败！，请检查参数： ${JSON.stringify(data)}`
                });
              }
            });
          } else {
            count++
            if (count > 100) {
              clearInterval(timer)
              reject({
                errorCode: that._getErrorCode(),
                msg: '登录失败'
              });
              wx.showModal({
                title: '提示',
                content: '登录失败',
              })
            }
          }
        }, 200)
      })
    }

  }

  _imgToJson(res, ...keys) {
    if (Array.isArray(res.resultObj)) {
      return this._imgArrToJson(res, keys);
    }
    return new Promise(function (resolve, reject) {
      // if (/img0/.test(res.resultObj[key])) {
      for (let key of keys) {
        try {
          if (res.resultObj[key]) res.resultObj[key] = JSON.parse(res.resultObj[key].replace(/\\"/g, "\""));
        } catch (e) { }
      }
      // }
      resolve(res);
    });
  }

  _jsonToArray(res, ...keys) {
    if (Array.isArray(res.resultObj)) {
      return this._jsonArrayToArray(res, keys);
    }

    return new Promise(function (resolve, reject) {
      var obj = {};
      res.resultObj['obj'] = obj;
      for (let key of keys) {
        obj[key] = [];
        if (o[key]) {
          for (let k in res.resultObj[key]) {
            obj[key].push(res.resultObj[key][k]);
          }
        }
      }
      resolve(res);
    });
  }


  _imgArrToJson(res, keys) {
    return new Promise(function (resolve, reject) {
      for (let o of res.resultObj) {
        for (let key of keys) {
          try {
            if (o[key]) o[key] = JSON.parse(o[key].replace(/\\"/g, "\""));
          } catch (e) { }
        }
      }
      resolve(res);
    });
  }

  _jsonArrayToArray(res, keys) {
    return new Promise(function (resolve, reject) {
      for (let o of res.resultObj) {
        var obj = {};
        o['obj'] = obj;
        for (let key of keys) {
          obj[key] = [];
          if (o[key]) {
            for (let k in o[key]) {
              obj[key].push(o[key][k]);
            }
          }
        }
      }
      resolve(res);
    });
  }

  _returnData(res) {
    return new Promise(function (resolve, reject) {
      resolve(res);
      // wx.hideLoading();
    });
  }
}

class CacheWrapper {
  static b = 10 * 60 * 1000;
  constructor(time, val, aa) {
    let date = new Date(parseInt(time) + parseInt(aa ? aa : CacheWrapper.b))
    this.time = date;
    this.val = val;
  }
  getValue() {
    return this.val;
  }
  isTimeOut() {
    var currentTime = new Date();
    if (currentTime >= this.time) {
      // console.log('过期了')
      return true;
    } else {
      return false;
    }
  }
}
module.exports = {
  Base,
  CacheWrapper
}