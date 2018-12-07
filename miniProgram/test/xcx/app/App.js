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
 class AppServer extends Base {

   /**
    * app字段：name,tel,ext,des,imgs
    * appBanner字段：des,content,name,appBannerTypeId,countyId,subjectId
    * appBannerTypeList字段:appTypeId,des
    */

   /**
    * 功能实现描述：  根据appId获取轮播图
    * @param data 商品id 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 轮播图数组 []
    */
   appBannerList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
     Object.assign(data, {
       currentPage,
       pageSize,
       totalRows,
       appId
     })
     return this.requestPost("app/appBannerList", data)
       .then(res => {
         return this._imgToJson(res, "content")
       })
   }

   /**
    * 功能实现描述：  获取轮播图 type 列表
    */
   appBannerTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
     Object.assign(data, {
       currentPage,
       pageSize,
       totalRows,
       appId
     })
     return this.requestPost("app/appBannerTypeList", data)
   }

   /**
    * 功能实现描述：  根据appId获取App详情
    * @param id Appid 
    * @return App详情
    */
   getAppById(id) {
     return this.requestPost("app/appDetail", {
       id
     })
   }
   /**
    * 错误编码
    * 
    */
   _getErrorCode() {
     return "1002"
   }
 }
 module.exports = {
   appServer: new AppServer()
 }