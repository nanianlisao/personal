var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：SmsServer.js  短信服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class SmsServer extends Base {

  /**
   * sms参数 smsContent,mobile,type,status
   */

  /**
   * 功能实现描述：  发送短信
   * @param data appId或者subjectId,mobile :手机号
   *  
   * @return    
   */
  sendSms(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("sms/sendSms", data)
  }
  /**
   * 功能实现描述：  验证短信验证码
   * @param data smsKey :  sendSms返回的key，code：用户输入的验证码
   * @return 新闻详情
   */
  checkSms(data = {}) {
    return this.requestPost("sms/checkSms", data)
  }
  _getErrorCode() {
    return "1020"
  }


}
module.exports = {
  smsServer: new SmsServer()
}