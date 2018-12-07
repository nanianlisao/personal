var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：InformationServer.js  消息服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class InformationServer extends Base {

  /**
   * information参数 title,content,fromUser,toUser,type,status,subjectId,orderId
   */

  /**
   * 功能实现描述：  根据appId获取轮播图
   * @param data 商品id 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  informationList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("information/informationList", data)
  }
  /**
   * 功能实现描述：  添加消息
   * @param data 消息内容json数据
   * @return 添加的消息，包含消息ID
   */
  addInformation(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("information/addInformation", data)
  }
  /**
   * 功能实现描述：  删除消息
   * @param data 消息内容json数据
   * @return 添加的消息，包含消息ID
   */
  delInformations(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("information/delInformations", data, )
  }
  /** 
   * 功能实现描述： 根据条件查询消息总数
   * @param data 条件数据json数据
   * @return 消息列表数组[]
   */
  queryInformationCount(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("information/queryInformationCount", data)
  }
  /**
   * 功能实现描述： 更改消息为已读
   * @param id 要更改的消息id
   * @return 
   */
  updateInformationRead(id) {
    return this.requestPost("information/updateInformationRead", {
      id
    })
  }
  /**
   * 功能实现描述： 更改消息为已读
   * @param ids 要更改的消息id数组
   * @return 
   */
  updateInformationReadByIds(ids) {
    return this.requestPost("information/updateInformationReadByIds", {
      ids
    })
  }
  _getErrorCode() {
    return "1008"
  }
}
module.exports = {
  informationServer: new InformationServer()
}