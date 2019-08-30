import {
  wxRequest
} from '@/utils/wxRequest';

let env = "-test" //-dev 或者 -test
// const apiMall = 'https://sujiefs.com/'
// const apiMall = 'http://localhost:8080/'


/**
 * App的一些接口
 */
class AppServer {
  //获取appbanner
  getAppBanner(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest('app/appBannerList',data);
  }
  //根据appId获取App详情
  appDetail(id) {
    return wxRequest('app/appDetail', { id });
  }

  //添加建议
  addAdvice(data) {
    return wxRequest('vote/addAdvice', data);
  }

  //根据条件获取建议
  adviceList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest('vote/adviceDetail', data);
  }

}
/**
 * AreaServer.js  获取省市区三级区域
 */
class AreaServer {

  areaList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("area/areaList", data);
  }

}
class CollectServer {

  /***
   * 功能实现描述：  获取收藏的商品或店铺
   * @param data 查询的条件 {appId:12}
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法
   * @return 收藏的商品后收藏的店铺
   */
  goodsListInCollect(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("collect/goodsListInCollect", data);
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("collect/collectCount", data);
  }

  /**
  * 功能实现描述：  删除收藏
  * @param id 
  * @return 
  */
  delCollect(id) {
    return wxRequest("collect/delCollect", { id });
  }
  /**
  * 功能实现描述：  多连删收藏
  * @param ids 逗号分开的id
  * @return 
  */
  delCollects(ids) {
    return wxRequest("collect/delCollects", { ids });
  }
  /**
  * 功能实现描述：  添加商品到收藏
  * @param data 收藏的商品信息
  * @return 
  */
  addGoodsToCollect(data) {
    return wxRequest("collect/addGoodsToCollect", data);
  }
  /**
  * 功能实现描述：  删除goods详情页面中的收藏
  * @param goodsId 商品id
  * @param openId 用户id
  * @param appId  对应的appId
  * @return 
  */
  deleteCollectByAppIdAndOpenIdAndGoodsId(goodsId, openId, appId) {
    return wxRequest("collect/deleteCollectByAppIdAndOpenIdAndGoodsId", { goodsId, openId, appId });
  }

}

class CommentServer {


  /***
    * 功能实现描述：  获取评论数据
    * @param data 查询的条件 {appId:12}
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法
    * @return 收藏的商品后收藏的店铺
    */
  queryCommentList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("comment/addComment", data);
  }

}

class EmployeeServer {


  /**
    * 功能实现描述：  根据条件获取员工数据
    * @param data {appId:appId....} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 轮播图数组 []
    */
  employeeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("employee/EmployeeList", data);
  }

  /**
    * 功能实现描述：  根据条件获取员工类型数据
    * @param data {appId:appId....} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return  员工类型[]
    */
  employeeTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("employee/employeeTypeList", data);
  }

  /**
     * 
     * 功能实现描述  :根据手机号修改员工密码
     * 
     * @param phone  手机号
     * @param password 要修改的密码
     * @param openId   openId和unionId  二选一
     * @param unionId  openId和unionId  二选一
     * @param response
     * 杨鹏 - yangpengg@163.com
     * Created on 2018年2月9日 下午4:05:39
     * @return
     */
  updateEmployeePassword(data = {}) {
    return wxRequest("employee/updateEmployeePassword", data);

  }

  /**
    * 
    * 功能实现描述  :检查是否存在和禁用
    * 
    * @param phone  手机号
    * @param unionId  openId和unionId  二选一
    * @param response
    * @return
    */
  checkEmployee(data = {}) {
    return wxRequest("employee/checkEmployee", data);

  }
  /**
   * 功能实现描述：  根据id获取员工详情
   * @param id  
   * @return 员工详情
   */
  getEmployeeById(id) {
    return wxRequest("employee/employeeDetail", { id });
  }
  /**
   * 功能实现描述：  员工登录
   * @param data.phone： 电话号码 
   * @param data.password：  密码
   * @return 是否允许登录
   */
  employeeLogin(data) {
    return wxRequest("employee/employeeLogin", data);
  }
  /**
   * 功能实现描述：  添加员工
   * @param data  员工数据,json数据
   * @return 添加的员工详情，包含员工ID
   */
  addEmployee(data) {
    return wxRequest("employee/addEmployee", data);
  }
}

class GoodsServer {




  /**
   * 功能实现描述：  根据id获取商品详情
   * @param id 商品id
   * @return 商品详情data
   */
  getGoodsById(id) {
    return wxRequest("goods/goodsDetail", { id })/*.then(res=>{
      return this._imgToJson(res, "img","remark")
    });*/
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
    Object.assign(data, { currenPage, pageSize, totalRows });
    return wxRequest("goods/goodsList", data)/*.then(res => {
        return this._imgToJson(res, "img", "remark");
    }).then(res => {
        return this._jsonToArray(res, "img")
      });*/
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
    Object.assign(data, { currenPage, pageSize, totalRows });
    return wxRequest("goods/fuzzyGoodsList", data);
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("goods/goodsTypeList", data);
  }

  /**
    * 功能实现描述：  查询商品类型ID获取分类详情
    * @param id  类型id
    * @return 商品分类
    */
  getGoodsTypeById(id) {
    return wxRequest("goods/goodsTypeDetail", { id });
  }

}

class HankuiServer {


  /**
   * 功能实现描述：  根据条件获取员工数据
   * @param data {appId:appId....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  statisticsData(data = {}) {
    return wxRequest("hkyl/queryEmployeeByUnionIdList", data);
  }

  /**
   * 功能实现描述：  根据条件获取员工数据
   * @param data {appId:appId....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  chartList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("hkyl/chartList", data);
  }

  /**
   * 功能实现描述：  根据条件获取员工数据
   * @param data {appId:appId....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  tableList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("hkyl/tableList", data);
  }

  addEmployee(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("hkyl/addEmployee", data);
  }

}

class InformationServer {


  /**
    * 功能实现描述：  根据appId获取轮播图
    * @param data 商品id 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 轮播图数组 []
    */
  informationList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("information/addInformation", data);
  }
  /**
 * 功能实现描述：  删除消息
 * @param data 消息内容json数据
 * @return 添加的消息，包含消息ID
 */
  delInformations(data) {
    return wxRequest("information/delInformations", data, );
  }
  /** 
  * 功能实现描述： 根据条件查询消息总数
  * @param data 条件数据json数据
  * @return 消息列表数组[]
  */
  queryInformationCount(data) {
    return wxRequest("information/queryInformationCount", data);
  }
  /**
   * 功能实现描述： 更改消息为已读
   * @param id 要更改的消息id
   * @return 
   */
  updateInformationRead(id) {
    return wxRequest("information/updateInformationRead", { id });
  }
  /**
   * 功能实现描述： 更改消息为已读
   * @param ids 要更改的消息id数组
   * @return 
   */
  updateInformationReadByIds(ids) {
    return wxRequest("information/updateInformationReadByIds", { ids });
  }
}

class KuaidiServer {


  /**
    * 功能实现描述：  获取物流信息
    * @param expCode 物流公司的编号
    * @param expNo  物流编号
    * @param requestType 返回的数据类型 xml/json
      @return
    */
  getOrderTracesByJson(expCode, expNo, requestType) {
    return wxRequest("kuaidi/getOrderTracesByJson", { expCode, expNo, requestType });
  }

  /**
   * 错误编码
   * 
   */

}

class LoginServer {


  /**
    * 功能实现描述：  微信登录，获取用户信息，用户的openID信息和后台的sessionid,把一些敏感信息去除了
    * @param app_id appId
    * @param code  微信登录后返回的code 
                   详情查看 微信api 登录描述 
                   https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject
    * @param encryptedData  
             https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
    * @param iv  
             https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject
    * @return json格式的用户数据
    */
  login(app_id, code, encryptedData, iv) {
    return wxRequest("login/getUserInfo", { encryptedData, iv, sessionId });
  }
  /**
   * 功能实现描述： 检查session有没有过期
   * @param sessionId  用户登录有后台服务器生成的session，这个sessionId的生命周期有后台维护
   * @return json 格式的数据 "{\"Msg\":\"expired or ok \"}"
   *         详见微信检查登录
   *         https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject
   */
  checklogin(sessionId) {
    return wxRequest("login/checklogin", { sessionId });
  }
}

class MemberServer {


  /**
    * 功能实现描述：  根据条件查询会员卡数据
    * @param data json格式 {appId:12......} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 会员卡数组 []
    */
  memberCardList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("memberCard/memberCardList", data);
  }
  /**
    * 功能实现描述：  根据条件查询会员卡类型数据
    * @param data json格式 {appId:12......} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 会员卡数组 []
    */
  memberCardTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("memberCard/memberCardTypeList", data);
  }
  /**
   * 功能实现描述：  根据会员卡id获取会员卡详情
   * @param id 会员卡id
   * @return 会员卡详情
   */
  getMemberCardById(id) {
    return wxRequest("memberCard/memberCardById", { id });
  }
  /**
   * 功能实现描述：  根据条件查询会员卡记录数据，这个一般是获取用户获取的会员卡
   * @param data json格式 {appId:12，openId:openId......} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 会员卡记录数组 []
   */
  memberCardRecordList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("memberCard/memberCardRecordList", data);
  }
}

class NewsServer {


  /**
    * 功能实现描述：  根据appId获取轮播图
    * @param data 商品id 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法
    * @return 新闻数组 []
    */
  newsList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("news/newsList", data);
  }
  /**
   * 功能实现描述：  根据id获取新闻详情
   * @param id 新闻id 
   * @return 新闻详情
   */
  getNewsById(id) {
    return wxRequest("news/newsDetail", { id });
  }

  /**
  * 功能实现描述：  根据id删除新闻
  * @param id 新闻id 
  * @return 新闻详情
  */
  getNewsById(id) {
    return wxRequest("news/delNews", { id });
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("news/newsTypeList", data);
  }

}

class OrderServer {


  /**
    * 功能实现描述：  根据条件获取订单,数据中包含订单详情数据
    * @param data json条件数据 {appId:appId,openId:openId} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 订单数组[]
    */
  orderList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("order/orderList", data);
  }

  updateOrder(data) {
    return wxRequest("order/updateOrder", data);
  }

  orderDetail(id) {
    return wxRequest("order/orderDetail", { id });
  }


  getRoomNum(data) {
    return wxRequest("order/getRoomNum", data);
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("order/orderListOnly", data);
  }
  /**
   * 功能实现描述：  筛选房间
   * @param beginTimeStr=2018-06-06
   * @param appId=45&subjectId=191
   * @return 添加后的订单，包含订单id和code
   */

  oppointmentNumList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    // Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("oppointment/oppointmentNumList", data);
  }
  /**
   * 功能实现描述：  添加订单
   * @param data  订单信息
   * @param goods  订单商品数组json字符串[{},{}]
   * @return 添加后的订单，包含订单id和code
   */
  addOrder(data) {
    // Object.assign(data);
    return wxRequest("order/addOrder", data);
  }

  /**
   * 功能实现描述：  根据id删除订单
   * @param id  订单id 
   * @return  
   */
  delOrderById(id) {
    return wxRequest("order/delOrder", { id });
  }
  /**
  * 功能实现描述：  根据id删除订单详情
  * @param id  订单详情ID 
  * @return 
  */
  delOrderDetailById(id) {
    return wxRequest("order/delOrderDetail", { id });
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
    return wxRequest("order/updateOrderTypeAndStatusByCode", data);
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
    return wxRequest("order/updateOrderTypeAndStatusById", data);
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
    return wxRequest("order/updateOrderDetailTypeAndStatusByCode", data);
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
    return wxRequest("order/updateOrderDetailTypeAndStatusById", data);
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
    return wxRequest("order/updateOrderDetailTypeAndStatusByOrderId", data);
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
  updateOppointList(data) {
    return wxRequest("oppointment/updateOppointList", data);
  }
  /***
   * 功能实现描述 :根据条件查询订单条数
   * @param data  条件参数{appId:12.......}
   * return 条数
   */
  orderCount(data) {
    return wxRequest("order/orderCount", data);
  }
}

class ShopCarServer {


  /**
    * 功能实现描述：  根据条件查询购物车
    * @param data 条件数据json{appId:12..........}
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 购物车数据数组 []
    */
  goodsListInShopCar(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("shopCar/goodsListInShopCar", data);
  }
  /**
   * 功能实现描述：  根据ids字符串删除购物车，
   * @param ids 逗号分开的购物车id
   * @return 
   */
  delGoodsInShopCar(ids) {
    return wxRequest("shopCar/delGoodsInShopCar", { ids });
  }


  /**
   * 功能实现描述：  根据条件查询购物车总数
   * @param data 条件数据json {appId:12..........}
   * @return 总数
   */
  shopCarCount(data) {
    return wxRequest("shopCar/delGoodsInShopCar", data);
  }
  /**
   * 功能实现描述：  根据openID清空购物车
   * @param openId  
   * @return 
   */
  clearAllShopCar(openId) {
    return wxRequest("shopCar/clearAllShopCar", { openId });
  }
  /**
   * 功能实现描述：  添加商品至购物车，重复商品数量加 1
   * @param openId  
   * @return 
   */
  addGoodsToShopCar(data) {
    return wxRequest("shopCar/clearAllShopCar", data);
  }
  /**
   * 功能实现描述：  将订单中的商品添加到购物车
   *                再来一单的时候将商品添加到购物车
   * @param ids  逗号分开的商品id
   * @param openId
   * @param appId
   * @return 
   */
  addToShopCar(ids, openId, appId) {
    return wxRequest("shopCar/addToShopCar", { ids, openId, appId });
  }

}

class SmsServer {


  /**
    * 功能实现描述：  发送短信
    * @param data appId或者subjectId,mobile :手机号
    *  
    * @return    
    */
  sendSms(data = {}) {
    return wxRequest("sms/sendSms", data);
  }
  /**
   * 功能实现描述：  验证短信验证码
   * @param data smsKey :  sendSms返回的key，code：用户输入的验证码
   * @return 新闻详情
   */
  checkSms(data = {}) {
    return wxRequest("sms/checkSms", data);
  }


}

class SubjectServer {


  /**
    * 功能实现描述：  根据条件获取店铺详情
    * @param data 条件数据json{appId:12.........} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 店铺数组 []
    */
  subjectList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("subject/subjectList", data);
  }
  /**
   * 功能实现描述：  根据appId获取App详情
   * @param id Appid 
   * @return App详情
   */
  getSubjectById(subjectId) {
    return wxRequest("subject/subjectDetail", { subjectId });
  }
  /**
   * 功能实现描述：  添加店铺列表
   * @param id Appid 
   * @return App详情
   */
  addSubject(data = {}) {
    return wxRequest("subject/addSubject", data);
  }
  /**
  * 功能实现描述：  修改店铺详情
  * @param id Appid 
  * @return App详情
  */
  updateSubject(data = {}) {
    return wxRequest("subject/updateSubject", data);
  }
  /**
   * 功能实现描述：  店铺投票
   * @param id Appid 
   * appId=1 & subjectId=1&  openId=1
   * @return 投票结果
   */
  subjectVote(data = {}) {
    return wxRequest("vote/subjectVote", data);
  }
  /**
  * 功能实现描述：  店铺投票
  * @param id Appid 
  * appId=1 & subjectId=1
  * @return 投票数量
  */
  subjectVoteCount(data = {}) {
    return wxRequest("vote/subjectVoteCount", data);
  }
  /**
  * 功能实现描述：  查询抽奖次数
  * @param appId=121&subjectId=121&openId=121
  * @return 抽奖次数
  */
  employeCJCount(data = {}) {
    return wxRequest("vote/employeCJCount", data);
  }
  /**
  * 功能实现描述：  增加一次抽奖
  * @param appId=121&subjectId=121&openId=121 
  * type 1是加 2是减
  * @return 抽奖次数
  */
  updateEmployeCJCount(data = {}) {
    return wxRequest("vote/updateEmployeCJCount", data);
  }
  /**
   * 功能实现描述：  根据条件获取店铺类目
   * @param data 条件数据json{appId:12.........}
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 类目数组 []
   * 
   */
  subjectCategoryList(data, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("subject/subjectCategoryList", data);
  }
}

class ThemeServer {


  /**
    * 功能实现描述：  根据条件获取主题数据
    * @param data  条件数据json{appId:12....} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 主题数组 []
    */
  themeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("theme/themeList", data);
  }
  /**
   * 功能实现描述：  根据id获取主题详情
   * @param themeId
   * @return 主题详情
   */
  themeDetail(themeId) {
    return wxRequest("theme/themeDetail", { themeId });
  }
  /**
    * 功能实现描述：  根据条件获取主题属性数据
    * @param data  条件数据json{appId:12....} 
    * @return 主题属性数组 []
    */
  themePropertyDetail(data = {}) {
    return wxRequest("theme/themePropertyDetail", data);
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("theme/themeTypeList", data);
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("theme/themeGoodsDetail", data);
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
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("theme/themeGoodsList", data);
  }
}

class TicketServer {


  /**
    * 功能实现描述：  获取个人的优惠券
    * @param data 条件数据json{appId:12.........} 
    * @param currentPage 分页参数 当前页 默认第一页
    * @param pageSize 分页参数 一页显示多少条  默认10条
    * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
    * @return 优惠券 []
    */
  ticketRecordList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("ticket/ticketRecordList", data);
  }
  /**
   * 功能实现描述：  全部优惠券
   * @param Appid 
   * @return App详情
   */
  ticketList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("ticket/ticketList", data);
  }
  /**
   * 功能实现描述：  添加优惠券
   * @param Appid 
   * "ticket.id": data.id,
            "openId": user_id,
            "appId": app.globalData.app_id,
            "openName": app.globalData.userInfo.nickName,
            "ticketName": data.name,
            "phone": "",
            "appName": app.globalData.app_name,
            "actionType": "3",
            "sourceType": "3",
            "ruleSummary": data.ruleSummary
   * @return App详情
   */
  addTicketRecord(data = {}) {
    return wxRequest("ticket/addTicketRecord", data);
  }
  /**
   * 功能实现描述：  核销券
   * @param id status 
   * @return App详情
   */
  updateTicketRecord(data = {}) {
    return wxRequest("ticket/updateTicketRecord", data);
  }
}

class WeixinServer {

  /**
    * 功能实现描述：  发送模板消息
                      href="https://mp.weixin.qq.com/debug/wxadoc/dev/api/notice.html#发送模板消息"
    * @param appId appId 平台自身的
    * @param userId  接收者（用户）的 openid
    * @param template_id 所需下发的模板消息的id
    * @param page 点击模板卡片后的跳转页面，仅限本小程序内的页面。
                  支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
    * @param formId  表单提交场景下，为 submit 事件带上的 formId；
                     支付场景下，为本次支付的 prepay_id
    * @param valus  模板内容，不填则下发空模板
    * @return 轮播图数组 []
    */
  sendMsg(appId, userId, template_id, page, formId, valus) {
    return wxRequest("weixin/sendMsg", { appId, userId, template_id, page, formId, valus });
  }
  /**
   * 功能实现描述：   获取统计数据
   *                 https://mp.weixin.qq.com/debug/wxadoc/dev/api/analysis-visit.html#访问趋势
   * @param appId
   * @param type
   *    // 概况  type:1
        getweanalysisappiddailysummarytrend,
        // 日访问趋势  type:2
        getweanalysisappiddailyvisittrend,
        // 周访问趋势 type:3
        getweanalysisappidweeklyvisittrend,
        // 月访问趋势 type:4
        getweanalysisappidmonthlyvisittrend,
        // 访问分布  type:5
        getweanalysisappidvisitdistribution,
        // 访问日留存  type:6
        getweanalysisappiddailyretaininfo,
        // 访问周留存  type:7
        getweanalysisappidweeklyretaininfo,
        // 访问月留存  type:8
        getweanalysisappidmonthlyretaininfo,
        // 访问页  type:9
        getweanalysisappidvisitpage,
        // 用户画像  type:10
        getweanalysisappiduserportrait
   * @param data
   * @return type
   */
  weanalysis(appId, type, data) {
    return wxRequest("weixin/weanalysis", { appId, type, data });
  }

}

class PraiseServer{
  praiseStatus(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("praise/praiseStatus", data);
  }

  /**
  * 功能实现描述：  点赞 或 取消点赞
    @return
  */
  addPraise(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, { currentPage, pageSize, totalRows });
    return wxRequest("praise/addPraise", data);
  }
}



export default {
  app: new AppServer(),
  area: new AreaServer(),
  collect: new CollectServer(),
  comment: new CommentServer(),
  employee: new EmployeeServer(),
  goods: new GoodsServer(),
  hankui: new HankuiServer(),
  information: new InformationServer(),
  login: new LoginServer(),
  kuaidi: new KuaidiServer(),
  login: new LoginServer(),
  member: new MemberServer(),
  news: new NewsServer(),
  order: new OrderServer(),
  shopCar: new ShopCarServer(),
  sms: new SmsServer(),
  subject: new SubjectServer(),
  theme: new ThemeServer(),
  ticket: new TicketServer(),
  weixin: new WeixinServer(),
  praise: new PraiseServer()
}
