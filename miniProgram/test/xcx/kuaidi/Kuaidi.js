var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
/**
 * 
 * 文件名：KuaidiServer.js  APP服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class KuaidiServer extends Base {


  /**
    * 功能实现描述：  获取物流信息
    * @param expCode 物流公司的编号
    * @param expNo  物流编号
    * @param requestType 返回的数据类型 xml/json
      @return
    */
  getOrderTracesByJson(expCode, expNo, requestType) {
    return this.requestPost("kuaidi/getOrderTracesByJson", {
      expCode,
      expNo,
      requestType
    });
  }

  /**
   * 错误编码
   * 
   */
  _getErrorCode() {
    return "1009";
  }

}
module.exports = {
  kuaidiServer: new KuaidiServer()
}