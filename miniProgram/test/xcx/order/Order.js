var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：AppServer.js  APP服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class OrderServer extends Base {

  /**
   * order参数 subjectId,totalPayment,accountPayment,actualPayment,addr,code,shareId,
   *           shareName,sharePhone,type,type1,status,status1,status2,des,couponId,
   *           courierId,ext,phone
   */

  /**
   * 功能实现描述：  根据条件获取订单,数据中包含订单详情数据
   * @param data json条件数据 {appId:appId,openId:openId} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 订单数组[]
   */
  orderList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("order/orderList", data)
  }


  orderDetail(id) {
    return this.requestPost("order/orderDetail", {
      id
    })
  }


  /**
   * 功能实现描述：  根据条件获取订单,数据中没有订单详情
   * @param data json条件数据 {appId:appId,openId:openId} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 订单数组[]
   */
  orderListOnly(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("order/orderListOnly", data)
  }
  /**
   * 功能实现描述：  添加订单
   * @param data  订单信息
   * @param goods  订单商品数组json字符串[{},{}]
   * @return 添加后的订单，包含订单id和code
   */
  addOrder(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("order/addOrder", data)
  }

  /**
   * 功能实现描述：  根据id删除订单
   * @param id  订单id 
   * @return  
   */
  delOrderById(id) {
    return this.requestPost("order/delOrder", {
      id
    })
  }
  /**
   * 功能实现描述：  根据id删除订单详情
   * @param id  订单详情ID 
   * @return 
   */
  delOrderDetailById(id) {
    return this.requestPost("order/delOrderDetail", {
      id
    })
  }
  /**
   * 
   * 功能实现描述 根据code进行修改，code这个在有子订单的情况下使用，可以同时修改多个订单
   * 
   * @param data {openId=null, code, type,  type1, status,  status1,  des}
   *  
   * @return
   */
  updateOrderTypeAndStatusByCode(data) {
    return this.requestPost("order/updateOrderTypeAndStatusByCode", data)
  }
  /**
   * 
   * 功能实现描述  根据订单ID进行修改，修改某个订单的
   * 
   * @param data {openId=null, code, type,  type1, status,  status1,  des}
   *  
   * @return
   */
  updateOrderTypeAndStatusById(data) {
    return this.requestPost("order/updateOrderTypeAndStatusById", data)
  }
  /**
   * 
   * 功能实现描述 根据code修改订单详情，一个订单可能对多个订单详情， 
   *             这个可以修改多个订单详情，并且在有子订单的情况下，对子订单进行修改
   * 
   * @param data {openId=null, code, type,  type1, status,  status1,  des}
   *  
   * @return
   */
  updateOrderDetailTypeAndStatusByCode(data) {
    return this.requestPost("order/updateOrderDetailTypeAndStatusByCode", data)
  }
  /**
   * 
   * 功能实现描述 功能实现描述 根据订单详情ID进行修改，只修改一条数据
   * 
   * @param data {openId=null, code, type,  type1, status,  status1,  des}
   *  
   * @return
   */
  updateOrderDetailTypeAndStatusById(data) {
    return this.requestPost("order/updateOrderDetailTypeAndStatusById", data)
  }
  /**
   * 
   * 功能实现描述 功能实现描述 根据订单ID进行修改，
   *             这个在有子订单的情况下不修改子订单的订单详情
   * 
   * @param data {openId=null, code, type,  type1, status,  status1,  des}
   *  
   * @return
   */
  updateOrderDetailTypeAndStatusByOrderId(data) {
    return this.requestPost("order/updateOrderDetailTypeAndStatusByOrderId", data)
  }

  updateOrder(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("order/updateOrder", data)
  }
  /***
   * 功能实现描述 :根据条件查询订单条数
   * @param data  条件参数{appId:12.......}
   * return 条数
   */
  orderCount(data) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("order/orderCount", data)
  }
  _getErrorCode() {
    return "1013"
  }
}
module.exports = {
  orderServer: new OrderServer()
}