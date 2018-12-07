var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：ShopCarServer.js  购物车服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class ShopCarServer extends Base {

  /**
   * shopCar参数: goodsId,count,subjectId
   */

  /**
   * 功能实现描述：  根据条件查询购物车
   * @param data 条件数据json{appId:12..........}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 购物车数据数组 []
   */
  goodsListInShopCar(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("shopCar/goodsListInShopCar", data)
  }
  /**
   * 功能实现描述：  根据ids字符串删除购物车，
   * @param ids 逗号分开的购物车id
   * @return 
   */
  delGoodsInShopCar(ids) {
    return this.requestPost("shopCar/delGoodsInShopCar", {
      ids
    })
  }


  /**
   * 功能实现描述：  根据条件查询购物车总数
   * @param data 条件数据json {appId:12..........}
   * @return 总数
   */
  shopCarCount(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("shopCar/delGoodsInShopCar", data)
  }
  /**
   * 功能实现描述：  根据openID清空购物车
   * @param openId  
   * @return 
   */
  clearAllShopCar(openId) {
    return this.requestPost("shopCar/clearAllShopCar", {
      openId
    })
  }
  /**
   * 功能实现描述：  添加商品至购物车，重复商品数量加 1
   * @param openId  
   * @return 
   */
  addGoodsToShopCar(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("shopCar/clearAllShopCar", data)
  }
  /**
   * 功能实现描述：  将订单中的商品添加到购物车
   *                再来一单的时候将商品添加到购物车
   * @param ids  逗号分开的商品id
   * @param openId
   * @param appId
   * @return 
   */
  addToShopCar(ids, openId) {
    return this.requestPost("shopCar/addToShopCar", {
      ids,
      openId,
      appId
    })
  }

  _getErrorCode() {
    return "1014"
  }
}
module.exports = {
  shopCarServer: new ShopCarServer()
}