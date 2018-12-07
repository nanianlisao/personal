var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：ThemeServer.js  主题服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class ThemeServer extends Base {

  /**
   * theme参数 name,pid,typeId,des,type,kind
   * 
   */

  /**
   * 功能实现描述：  根据条件获取主题数据
   * @param data  条件数据json{appId:12....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 主题数组 []
   */
  themeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("theme/themeList", data)
  }
  /**
   * 功能实现描述：  根据id获取主题详情
   * @param themeId
   * @return 主题详情
   */
  themeDetail(themeId) {
    return this.requestPost("theme/themeDetail", {
      themeId
    })
  }
  /**
   * 功能实现描述：  根据条件获取主题属性数据
   * @param data  条件数据json{appId:12....} 
   * @return 主题属性数组 []
   */
  themePropertyDetail(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("theme/themePropertyDetail", data)
  }


  /**
   * 功能实现描述：  根据条件获取主题类型数据
   * @param data  条件数据json{appId:12....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 主题类型数组 []
   */
  themeTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("theme/themeTypeList", data)
  }

  /**
   * 功能实现描述：  根据条件获取主题商品
   * @param data  条件数据json{appId:12....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 主题数组 []
   */
  themeGoodsDetail(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("theme/themeGoodsDetail", data)
  }


  /**
   * 功能实现描述： 获取条件获取主题，并且包含主题项目的主题商品
   * @param data  条件数据json{appId:12....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 主题数组 []
   */
  themeGoodsList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("theme/themeGoodsList", data)
  }
  _getErrorCode() {
    return "1016"
  }
}
module.exports = {
  themeServer: new ThemeServer()
}