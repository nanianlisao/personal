const Promise = require('./bluebird');
const isDebug = true;

/**
 * 功能描述：时间格式化
 * @param  fmt 格式化字符串 默认值 yyyy-MM-dd HH:mm:ss
 * @return 格式化后的字符互串
 * 例子：
 * var time1 = new Date().Format();
 * var time2 = new Date().Format("yyyy-MM-dd");
 * var time3 = new Date().Format("yyyy-MM-dd HH:mm:ss");
 */
Date.prototype.Format = function (fmt ="yyyy-MM-dd hh:mm:ss") { //author: meizz 
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

/**
 * 功能描述：异步操作，因为微信的所有api接口都是异步回调操作很多地方需要同步，
 *          避免异步嵌套问题，所有提取出这统一的接口,使用的是es6的语法
 * 
 * @param fn 微信api同步的函数名，如：wx.getStorage
 * @return 返回一个Promise，es6的语法规定
 * 
 * 例子：两种方法
 * 
 * 1、匿名函数
 * （async function(that){
 *      const fn = util.asyncFunction(wx.getStorage);
 *      var data = {};//参数
 *      var res = await fn(data);
 *       util.debug(data);
 *     }）（this）；//这个this
 * 2、函数
 * function async test (){
*      const fn = util.asyncFunction(wx.getStorage);
*      var data = {};//参数
*      var res = await fn(data);
*      util.debug(data);
 * }
 */
function asyncFunction(fn) {
  return function (data = {}) {
    return new Promise(function (resolve, reject) {
      data.success = res => resolve(res);
      data.fail = res => reject(res);
      fn(data);
    });
  }
}

function getSum(arr, attr) {
  return arr.reduce((previous, current) => previous[attr] + current[attr])
}

function debug(o){
  if (isDebug){
  } 
}


/**
 *  功能描述：深度克隆对象
 *  @param obj 被克隆的对象
 *  @return 新对象
 * 
 */
function deepClone(obj) {
  var result;
  var oClass = isClass(obj);
  if (oClass === "Object") {
    result = {};
  } else if (oClass === "Array") {
    result = [];
  } else {
    return obj;
  }
  for (var key in obj) {
    var copy = obj[key];
    if (isClass(copy) == "Object") {
      result[key] = arguments.callee(copy);//递归调用
    } else if (isClass(copy) == "Array") {
      result[key] = arguments.callee(copy);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

/*
*
* 功能描述：判断对象的数据类型
* @param o  对象
*/
function isClass(o) {
  if (o === null) return "Null";
  if (o === undefined) return "Undefined";
  return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * 功能描述：同步网络Get请求，因为经常会用到同步网络请求，所有单独封装出来
 * @param url 请求的URL
 * @param data 请求的数据
 * @return 返回网络请求的数据
 * 
 * 例子：和上面的asyncFunction一样有两种写，匿名函数和函数
 * （function(){
 *    var data = {}
 *    var res = await util.wx_requestGet(url,data);
 *    console.log(res);
 *  }）（this）；
 *  
 * 
 */
function wx_requestGet(url,data={}){  
  return _request(wx.request, url, "GET", data);
}


/**
 * 功能描述：同步网络Post请求，因为经常会用到同步网络请求，所有单独封装出来
 * @param url 请求的URL
 * @param data 请求的数据
 * @return 返回网络请求的数据
 * 
 * 例子：和上面的asyncFunction一样有两种写，匿名函数和函数
 * （function(){
 *    var data = {}
 *    var res = await util.wx_requestPost(url,data);
 *    console.log(res);
 *  }）（this）；
 *  
 * 
 */
function wx_requestPost( url, data = {}) {
  data.header = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  };
  return _request(wx.request, url, "POST", data);
}

function _request(fn, url, method, data){
  return new Promise(function (resolve, reject) {
    data.url = url;
    data.method = method;
    data.success = res => resolve(res);
    data.fail = res => reject(res);
    fn(data);
  });
}


function strTojson(str){
  return typeof str == 'string' ? JSON.parse(str.replace(/\\"/g,"\"").replace(/'/g,'\"')) : str
}

/**
 * 检验手机号码
 */
function checkPhone(tel){
  if ((/^0\d{2,3}-?\d{7,8}$/.test(tel) || /^1(3|4|5|7|8|9)\d{9}$/.test(tel) || /^400[0-9]{7}/.test(tel))){
    return true
  }else{
    return false
  }
}


/**
 *  已经废弃
 *  功能描述： 因为页面有很多图片是jSON格式的字符串形式，需要转换，转换
 */
function buildImgContent(banners) {
  for (var i = 0; i < banners.length; i++) {
    try {
      banners[i].content = JSON.parse(banners[i].content);
    } catch (e) { continue; }
  }
}
// 联系客服
function callPhone(str) {
  wx.getSystemInfo({
    success(res) {
      if (res.model.indexOf("iPhone") == -1) {
        wx.showActionSheet({
          itemList: [str, "呼叫"],
          success(res) {
            if (res.tapIndex == 1) {
              wx.makePhoneCall({
                phoneNumber: str,
              })
            }
          }
        })
      }
      else {
        wx.makePhoneCall({
          phoneNumber: str,
        })
      }
    }
  })
}

/**
 * 功能描述： es6转换es5用到的函数
 */
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
function tips(str){
  wx.showToast({
    title:str,
    icon: 'none'
  })
}
module.exports = {
  wx_requestGet: wx_requestGet,
  wx_requestPost: wx_requestPost,
  _asyncToGenerator: _asyncToGenerator,
  asyncFunction: asyncFunction,
  buildImgContent: buildImgContent,
  debug: debug,
  strTojson,
  checkPhone,
  callPhone,
  getSum,
  tips,
  deepClone: deepClone
};