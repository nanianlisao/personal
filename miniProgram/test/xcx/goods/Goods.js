var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：GoodsServer.js  商品服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class GoodsServer extends Base {


  /**
   * goods参数 name,status1,status,goodsTypeId,des,img,remark
   * goodsType参数 subjectId,img,status,pid
   */


  /**
   * 功能实现描述：  根据id获取商品详情
   * @param id 商品id
   * @return 商品详情data
   */
  getGoodsById(id) {
    return this.requestPost("goods/goodsDetail", {
      id
    })
    /*.then(res=>{
          return this._imgToJson(res, "img","remark")
        })*/
  }

  /**
   * 功能实现描述：  商品list查询
   * @param data 查询的条件 {appId:12}
   * @param currenPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 商品list[]
   */
  goodsList(data = {}, currenPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currenPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("goods/goodsList", data)
    /*.then(res => {
            return this._imgToJson(res, "img", "remark")
        }).then(res => {
            return this._jsonToArray(res, "img")
          })*/
  }

  goodsSubjectList(data = {}, currenPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currenPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("goods/goodsSubjectList", data)
  }
  /**
   * 功能实现描述：  根据商品名称模糊查询
   * @param data 查询的条件{name:"鞋子"，appId:12}
   * @param currenPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 商品list[]
   */
  fuzzyGoodsList(data = {}, currenPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currenPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("goods/fuzzyGoodsList", data)
  }
  /**
   * 功能实现描述：  查询商品分类
   * @param data 查询的条件{appid:1}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 商品类型list[]
   */
  goodsTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("goods/goodsTypeList", data)
  }

  /**
   * 功能实现描述：  查询商品类型ID获取分类详情
   * @param id  类型id
   * @return 商品分类
   */
  getGoodsTypeById(id) {
    return this.requestPost("goods/goodsTypeDetail", {
      id
    })
  }

  _getErrorCode() {
    return "1007"
  }
}
module.exports = {
  goodsServer: new GoodsServer()
}