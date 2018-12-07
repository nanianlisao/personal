var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：SubjectServer.js  
 * 这是一个没有实际类型的对象，可以是任意类型，如店铺，人或物
 * 多数情况下是店铺                 
 *
 * 创建人：杨鹏 - yangpengg@163.com
 *
 * 创建时间：2018年1月22日 下午15:42:13
 *
 * 版权所有：
 */
class SubjectServer extends Base {

  /**
   * subject参数 name,addr,tel,status,lat,contacts,enterpriseImg,des,remark,imgs,type
   */

  /**
   * 功能实现描述：  根据条件获取店铺详情
   * @param data 条件数据json{appId:12.........} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 店铺数组 []
   */
  subjectList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("subject/subjectList", data)
  }
  /**
   * 功能实现描述：  根据appId获取App详情
   * @param id Appid 
   * @return App详情
   */
  getSubjectById(subjectId) {
    return this.requestPost("subject/subjectDetail", {
      subjectId
    })
  }
  /**
   * 功能实现描述：  添加店铺列表
   * @param id Appid 
   * @return App详情
   */
  addSubject(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("subject/addSubject", data)
  }
  /**
   * 功能实现描述：  修改店铺详情
   * @param id Appid 
   * @return App详情
   */
  updateSubject(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("subject/updateSubject", data)
  }
  /**
   * 功能实现描述：  店铺投票
   * @param id Appid 
   * appId=1 & subjectId=1&  openId=1
   * @return 投票结果
   */
  subjectVote(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("vote/subjectVote", data)
  }
  /**
   * 功能实现描述：  店铺投票
   * @param id Appid 
   * appId=1 & subjectId=1
   * @return 投票数量
   */
  subjectVoteCount(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("vote/subjectVoteCount", data)
  }
  /**
   * 功能实现描述：  查询抽奖次数
   * @param appId=121&subjectId=121&openId=121
   * @return 抽奖次数
   */
  employeCJCount(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("vote/employeCJCount", data)
  }
  /**
   * 功能实现描述：  增加一次抽奖
   * @param appId=121&subjectId=121&openId=121 
   * type 1是加 2是减
   * @return 抽奖次数
   */
  updateEmployeCJCount(data = {}) {
    Object.assign(data, {
      appId
    })
    return this.requestPost("vote/updateEmployeCJCount", data)
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
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("subject/subjectCategoryList", data)
  }
  _getErrorCode() {
    return "1015"
  }
}
module.exports = {
  subjectServer: new SubjectServer()
}