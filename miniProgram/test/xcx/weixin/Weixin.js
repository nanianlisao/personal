var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：WeixinServer.js  微信服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class WeixinServer extends Base {

  /**
    * 功能实现描述：  发送模板消息
                      href="https://mp.weixin.qq.com/debug/wxadoc/dev/api/notice.html#发送模板消息"
    * @param appId appId 平台自身的
    * @param userId  接收者（用户）的 openid
    * @param template_id 所需下发的模板消息的id
    * @param page 点击模板卡片后的跳转页面，仅限本小程序内的页面。
                  支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
    * @param formId  表单提交场景下，为 submit 事件带上的 formId；
                     支付场景下，为本次支付的 prepay_id
    * @param valus  模板内容，不填则下发空模板
    * @return 轮播图数组 []
    */
  sendMsg(userId, template_id, page, formId, valus) {
    return this.requestPost("weixin/sendMsg", {
      appId,
      userId,
      template_id,
      page,
      formId,
      valus
    })
  }
  /**
   * 功能实现描述：   获取统计数据
   *                 https://mp.weixin.qq.com/debug/wxadoc/dev/api/analysis-visit.html#访问趋势
   * @param appId
   * @param type
   *    // 概况  type:1
        getweanalysisappiddailysummarytrend,
        // 日访问趋势  type:2
        getweanalysisappiddailyvisittrend,
        // 周访问趋势 type:3
        getweanalysisappidweeklyvisittrend,
        // 月访问趋势 type:4
        getweanalysisappidmonthlyvisittrend,
        // 访问分布  type:5
        getweanalysisappidvisitdistribution,
        // 访问日留存  type:6
        getweanalysisappiddailyretaininfo,
        // 访问周留存  type:7
        getweanalysisappidweeklyretaininfo,
        // 访问月留存  type:8
        getweanalysisappidmonthlyretaininfo,
        // 访问页  type:9
        getweanalysisappidvisitpage,
        // 用户画像  type:10
        getweanalysisappiduserportrait
   * @param data
   * @return type
   */
  weanalysis(type, data) {
    return this.requestPost("weixin/weanalysis", {
      appId,
      type,
      data
    })
  }

  _getErrorCode() {
    return "1017"
  }
}
module.exports = {
  weixinServer: new WeixinServer()
}