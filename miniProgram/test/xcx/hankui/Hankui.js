var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
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
class HankuiServer extends Base {


  /**
   * 功能实现描述：  根据条件获取员工数据
   * @param data {appId:appId....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  statisticsData(data = {}) {
    return this.requestPost("hkyl/statisticsData", data, false);
  }

  /**
   * 功能实现描述：  根据条件获取员工数据
   * @param data {appId:appId....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  queryEmployeeByUnionIdList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("hkyl/queryEmployeeByUnionIdList", data, false);
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
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("hkyl/chartList", data, false);
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
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("hkyl/tableList", data, false);
  }

  addEmployee(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows
    });
    return this.requestPost("hkyl/addEmployee", data, false);
  }

  _getErrorCode() {
    return "1007";
  }
}
module.exports = {
  hankuiServer: new HankuiServer()
}