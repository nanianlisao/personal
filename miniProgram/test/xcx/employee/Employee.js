var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：EmployeeServer.js  员工服务类
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class EmployeeServer extends Base {

  /**
   * employee参数 name,age,des,imgs,subjectId,subjectName,type,status,phone,
   *              pid,level,email,addr,kind,sex,ext
   * employeeProject参数 memberId,projectId,projectName,price,memberName,type,subjectId
   * employeeType参数 name,des,level,kind,alias,extendible
   */

  /**
   * 功能实现描述：  根据条件获取员工数据
   * @param data {appId:appId....} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 轮播图数组 []
   */
  employeeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("employee/EmployeeList", data)
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
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("employee/employeeTypeList", data)
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
    Object.assign(data, {
      appId
    })
    return this.requestPost("employee/updateEmployeePassword", data)

  }

  /**
   * 
   * 功能实现描述  :根据id修改信息
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
  updateEmployee(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("employee/updateEmployee", data)

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
    return this.requestPost("employee/checkEmployee", data)

  }
  /**
   * 功能实现描述：  根据id获取员工详情
   * @param id  
   * @return 员工详情
   */
  getEmployeeById(id) {
    return this.requestPost("employee/employeeDetail", {
      id
    })
  }
  /**
   * 功能实现描述：  根据openId获取员工详情
   * @param id  
   * @return 员工详情
   */
  getEmployeeByopenId(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("employee/employeeByOpenId", data)
  }
  /**
   * 功能实现描述：  员工登录
   * @param data.phone： 电话号码 
   * @param data.password：  密码
   * @return 是否允许登录
   */
  employeeLogin(data) {
    return this.requestPost("employee/employeeLogin", data)
  }
  /**
   * 功能实现描述：  添加员工
   * @param data  员工数据,json数据
   * @return 添加的员工详情，包含员工ID
   */
  addEmployee(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("employee/addEmployee", data)
  }
  _getErrorCode() {
    return "1006"
  }
}

module.exports = {
  employeeServer: new EmployeeServer()
}