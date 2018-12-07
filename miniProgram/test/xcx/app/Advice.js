var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：AppServer.js 建议服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class AdviceServer extends Base {

  /**
   * 字段： name，tel，advice，status,mail,type
   */

  /**
   * 功能实现描述： 添加建议
   * @param data   
   * @return  建议数据，包含id
   */
  addAdvice(data) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("vote/addAdvice", data)
  }

  /**
   * 功能实现描述： 根据条件获取建议
   * @param data  条件数据json{appId:12....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 建议数组 []
   */
  adviceList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("vote/adviceDetail", data)
  }

  /**
   * 功能实现描述：  根据id删除建议
   * @return  
   */
  delAdvice(id) {
    return this.requestPost("vote/delAdvice", {
      id
    })
  }

  /**
   * 功能实现描述： 获取条件获取关于数据
   * @param data  条件数据json{appId:12....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 关于数组 []
   */
  adviceList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("vote/aboutDetail", data)
  }
  /**
   * 错误编码
   * 
   */
  _getErrorCode() {
    return "1001"
  }

}
module.exports = {
  adviceServer: new AdviceServer()
}