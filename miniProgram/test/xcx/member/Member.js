var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：MemberServer.js  会员服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class MemberServer extends Base {

  /**
   * member 参数 name,prcie,img,des,typeId,subjectId
   */

  /**
   * 功能实现描述：  根据条件查询会员卡数据
   * @param data json格式 {appId:12......} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 会员卡数组 []
   */
  memberCardList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("memberCard/memberCardList", data)
  }
  /**
   * 功能实现描述：  根据条件查询会员卡类型数据
   * @param data json格式 {appId:12......} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 会员卡数组 []
   */
  memberCardTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("memberCard/memberCardTypeList", data)
  }
  /**
   * 功能实现描述：  根据会员卡id获取会员卡详情
   * @param id 会员卡id
   * @return 会员卡详情
   */
  getMemberCardById(id) {
    return this.requestPost("memberCard/memberCardById", {
      id
    })
  }
  /**
   * 功能实现描述：  根据条件查询会员卡记录数据，这个一般是获取用户获取的会员卡
   * @param data json格式 {appId:12，openId:openId......} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 会员卡记录数组 []
   */
  memberCardRecordList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("memberCard/memberCardRecordList", data)
  }
  _getErrorCode() {
    return "1011"
  }
}
module.exports = {
  memberServer: new MemberServer()
}