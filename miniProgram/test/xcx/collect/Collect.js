var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：CollectServer.js  收藏服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月23日 下午13:41:16
 *
 * 版权所有：
 */
class CollectServer extends Base {

  /**
   * 参数：type：收藏类型不同 openId,subjectId,goodsId
   */

  /***
   * 功能实现描述：  获取收藏的商品或店铺
   * @param data 查询的条件 {appId:12}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 收藏的商品后收藏的店铺
   */
  goodsListInCollect(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("collect/goodsListInCollect", data)
  }
  /**
   * 功能实现描述：  获取收藏的总数
   * @param data 查询的条件 {appId:12}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 收藏的数量
   * 
   */
  collectCount(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("collect/collectCount", data)
  }

  /**
   * 功能实现描述：  删除收藏
   * @param id 
   * @return 
   */
  delCollect(id) {
    return this.requestPost("collect/delCollect", {
      id
    })
  }
  /**
   * 功能实现描述：  多连删收藏
   * @param ids 逗号分开的id
   * @return 
   */
  delCollects(ids) {
    return this.requestPost("collect/delCollects", {
      ids
    })
  }
  /**
   * 功能实现描述：  添加商品到收藏
   * @param data 收藏的商品信息
   * @return 
   */
  addGoodsToCollect(data={}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("collect/addGoodsToCollect", data)
  }
  /**
   * 功能实现描述：  删除goods详情页面中的收藏
   * @param goodsId 商品id
   * @param openId 用户id
   * @param appId  对应的appId
   * @return 
   */
  deleteCollectByAppIdAndOpenIdAndGoodsId(data={}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("collect/deleteCollectByAppIdAndOpenIdAndGoodsId", data)
  }
  /**
   * 错误编码
   * 
   */
  _getErrorCode() {
    return "1003"
  }
}
module.exports = {
  collectServer: new CollectServer()
}