var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
/**
 * 
 * 文件名：LoginServer.js  微信登录服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class LoginServer extends Base {


  /**
    * 功能实现描述：  微信登录，获取用户信息，用户的openID信息和后台的sessionid,把一些敏感信息去除了
    * @param app_id appId
    * @param code  微信登录后返回的code 
                   详情查看 微信api 登录描述 
                   https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject
    * @param encryptedData  
             https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
    * @param iv  
             https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
    * @return json格式的用户数据
    */
  login(app_id, code, encryptedData, iv) {
    return this.requestPost("login", {
      app_id,
      code,
      encryptedData,
      iv
    });
  }
  /**
    * 功能实现描述：  获取用户的详细信息，包括地址信息
    * @param encryptedData  
                          https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
    * @param iv   
                        https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
    * @param sessionId   用户登录有后台服务器生成的session，这个sessionId的生命周期有后台维护
                        详见微信的登录态维护
                        https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject
  
                                    
    * @return json格式的用户数据
    */
  getUserInfo(encryptedData, iv, sessionId) {
    return this.requestPost("login/getUserInfo", {
      encryptedData,
      iv,
      sessionId
    });
  }
  /**
   * 功能实现描述： 检查session有没有过期
   * @param sessionId  用户登录有后台服务器生成的session，这个sessionId的生命周期有后台维护
   * @return json 格式的数据 "{\"Msg\":\"expired or ok \"}"
   *         详见微信检查登录
   *         https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject
   */
  checklogin(sessionId) {
    return this.requestPost("login/checklogin", {
      sessionId
    });
  }
  _getErrorCode() {
    return "1010";
  }
}
module.exports = {
  loginServer: new LoginServer()
}