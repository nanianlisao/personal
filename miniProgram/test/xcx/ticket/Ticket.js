var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
class TicketServer extends Base {

  /**
   * ticket参数 name,ruleSummary,status,type,des
   */

  /**
   * 功能实现描述：  获取个人的优惠券
   * @param data 条件数据json{appId:12.........} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 优惠券 []
   */
  ticketRecordList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("ticket/ticketRecordList", data)
  }
  /**
   * 功能实现描述：  可使用的券
   * @param data 条件数据json{appId:12.........} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 优惠券 []
   */
  useableTicketList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("ticket/useableTicketList", data)
  }
  /**
    * 功能实现描述：  查看可领取的券
    openId: wx.getStorageSync('user_id'),
          appId: app.globalData.app_id,
          appName: app.globalData.app_name,
          // appId: 30,
          actionType: 3,    行为条件  1 是 发放   3 是 领取  2 使用
          isRepeated: 0, //是否可重复领取
          isGetTicket: 0, //是否自动领取
    * @param data 条件数据json{appId:12.........} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 优惠券 []
    */
  getableTicketList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("ticket/getableTicketList", data)
  }
  /**
   * 功能实现描述：  全部优惠券
   * @param Appid 
   * @return App详情
   */
  ticketList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("ticket/ticketList", data)
  }
  /**
   * 功能实现描述：  添加优惠券
   * @param Appid 
   * "ticket.id": data.id,
            "openId": user_id,
            "appId": app.globalData.app_id,
            "openName": app.globalData.userInfo.nickName,
            "ticketName": data.name,
            "phone": "",
            "appName": app.globalData.app_name,
            "actionType": "3",
            "sourceType": "3",
            "ruleSummary": data.ruleSummary
   * @return App详情
   */
  addTicketRecord(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("ticket/addTicketRecord", data)
  }
  /**
   * 分享记录
   *   shareOpenId:'o5tP54jGzFZPLPYhDdt60yn8glhY',
      shareOpenName: 'o5tP54jGzFZPLPYhDdt60yn8glhY',
      beShareOpenId: 'o5tP54jGzFZPLPYhDdt60yn8glhY',
      beShareOpenName:'aaa',
      appId: app.globalData.app_id,
   */
  addTicketShareRecord(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("ticket/addTicketShareRecord", data)
  }
  /**
   * 通过id修改分享记录的状态
   */
  addTicketShareRecord(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("ticket/addTicketShareRecord", data)
  }
  /**
   * 功能实现描述：  核销券
   * @param id status 
   * @return App详情
   */
  updateTicketShareRecordById(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("ticket/updateTicketShareRecordById", data)
  }

  /**
   * 功能实现描述：  分享记录条数
   * @param appId shareOpenId status
   * @return App详情
   */
  ticketShareRecordCount(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("ticket/ticketShareRecordCount", data)
  }
  /**
   * 功能实现描述：  分享记录列表
   * @param shareOpenId  appId
   * @return App详情
   */
  queryTicketShareRecord(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("ticket/queryTicketShareRecord", data)
  }
  _getErrorCode() {
    return "1020"
  }
}
module.exports = {
  ticketServer: new TicketServer()
}