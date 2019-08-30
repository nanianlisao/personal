import wepy from 'wepy';
import util from './util';
const requestUrl = wepy.$instance.globalData.requestUrl;
const wxRequest = async(url, data = {}) => {
    if (!wepy.$instance.globalData.cache) {
      wepy.$instance.globalData.cache = new Map(); 
    }
    const key = requestUrl + url + JSON.stringify(data);
    if (wepy.$instance.globalData.cache.has(key) && !wepy.$instance.globalData.cache.get(key).isTimeOut() && !(data.noCache)) {
      // console.log("===进入缓存===");
      return wepy.$instance.globalData.cache.get(key).getValue()
    }else{
        // console.log("===没有缓存内容===")
       let res = await wepy.request({
            url: requestUrl + url,
            method: 'POST',
            data: data,
            header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        });
        if(res.data.resultCode == 1){
          wepy.$instance.globalData.cache.set(key, new CacheWrapper(new Date().getTime(), res.data,data.timess));
          return res.data
        }else{
          throw Error( `请求失败,参数：${JSON.stringify(data)}`)
        } 
    }
    
};

class CacheWrapper {
  static b = 10*60*1000;
  constructor(time, val,aa) {
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
    wxRequest
}
