var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：AreaServer.js  获取省市区三级区域
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class AreaServer extends Base {

  /**
   *参数：pid 上级id
   */

  /**
   * 功能实现描述：  获取区域列表
   * @param data pid
   *  
   * @return    
   */
  areaList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("area/areaList", data)
  }
  /**
   * 功能实现描述：  获取区域详情
   * @param data pid
   *  
   * @return    
   */
  oppointmentList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("oppointment/oppointmentList", data)
  }
  _getErrorCode() {
    return "1018"
  }

}
module.exports = {
  areaServer: new AreaServer()
}