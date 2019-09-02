var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const resourUrl = getApp().globalData.resourUrl
/**
 * 
 * 文件名：ThirdpartyServer.js  商品模板服务类
 *
 * 创建人：陈翔 - c597219320@aliyun.com
 *
 * 创建时间：2018年11月14日 上午11:48:13
 *
 * 版权所有：
 */
class ThirdpartyServer extends Base {


  /**
   * 功能实现描述：  根据条件获取订单,数据中包含订单详情数据
   * @param data json条件数据 {appId:appId,openId:openId} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 订单数组[]
   */
  relate(data = {}) {
    data.noCache = true
    return this.requestPost('thirdparty/modify/relate', data)
  }

  _getErrorCode() {
    return "1013"
  }
}
module.exports = {
  thirdpartyServer: new ThirdpartyServer()
}