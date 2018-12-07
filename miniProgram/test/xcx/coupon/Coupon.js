var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
/**
 * 
 * 文件名：CouponServer.js  卡券服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class CouponServer extends Base {


  /***
   * 功能实现描述：  获取优惠券
   * @param data 查询的条件 {appId:12.....}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 优惠券数组[]
   */
  couponList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("coupon/couponList", data);
  }
  /***
   * 功能实现描述：  获取价格获取优惠券记录---一般是用户的优惠券
   * @param data 查询的条件 {appId:12......} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 优惠券数组[]
   */
  couponRecordList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("coupon/couponRecordList", data);
  }
  /***
    * 功能实现描述：  获取价格获取优惠券记录--- 
                     根据用户购买商品的价格获取商家发放给用户的优惠券，
                     提供c端用户选择使用
    * @param data 查询的条件 {appId:12......}
    * @param datatotalPrice  总价格
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法
    * @return 优惠券数组[]
    */
  couponRecordListByPrice(data = {}, totalPrice, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      totalPrice,
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("coupon/couponRecordListByPrice", data);
  }

  /***
    * 功能实现描述： 领券，需要传入要领取的卡券的Id,openId,appId或者subjectId,
    * @param data  卡券信息和用户信息 {appId:12，openId:openId........}
                   
    */
  addCouponRecord(data) {
    return this.requestPost("coupon/addCouponRecord", data);
  }
  /***
   * 功能实现描述： 根据条件获取用户的卡券数量
   * @param data  条件数据 json {appId:12......}
                  
   */
  couponCount(data) {
    return this.requestPost("coupon/couponCount", data);
  }
  /***
   * 功能实现描述： 根据code 核销优惠券
   * @param code   
   */
  costCoupon(code) {
    return this.requestPost("coupon/costCoupon", {
      code
    });

  }
  /**
   * 错误编码
   * 
   */
  _getErrorCode() {
    return "1005";
  }

}
module.exports = {
  couponServer: new CouponServer()
}