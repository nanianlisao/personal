var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：CommentServer.js  评价服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class CommentServer extends Base {

  /**
   * 参数：openId,openName,openImg,pid,type,imgs,objectId,objectName,
   * / 

  /***
    * 功能实现描述：  获取评论数据
    * @param data 查询的条件 {appId:12}
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法
    * @return 收藏的商品后收藏的店铺
    */
  queryCommentList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("comment/queryCommentList", data)
  }

  /***
   * 功能实现描述：  添加评论
   * @param data 查询的条件 {appId:12}
   * @return
   */
  addComment(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("comment/addComment", data)
  }
  /**
   * 错误编码
   * 
   */
  _getErrorCode() {
    return "1004"
  }

}
module.exports = {
  commentServer: new CommentServer()
}