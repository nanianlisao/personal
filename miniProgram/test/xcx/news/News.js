var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：NewsServer.js  新闻服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class NewsServer extends Base {

  /**
   * news参数 title,content,author,subjectId,img,newsTypeId,lat,lng,des,ext
   *          viewCount,forwardCount,shareCount,commentCount,kind,type1
   * newsType参数 kind,pid,des
   */

  /**
   * 功能实现描述：  根据appId获取轮播图
   * @param data 商品id 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 新闻数组 []
   */
  newsList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("news/newsList", data)
  }
  /**
   * 功能实现描述：  根据id获取新闻详情
   * @param id 新闻id 
   * @return 新闻详情
   */
  getNewsById(id) {
    return this.requestPost("news/newsDetail", {
      id
    })
  }

  /**
   * 功能实现描述：  新闻类型列表，根据条件查询
   * @param data  条件json{appId:appId}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 新闻类型数组 []
   */
  newsTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("news/newsTypeList", data)
  }

  _getErrorCode() {
    return "1012"
  }
}
module.exports = {
  newsServer: new NewsServer()
}