var util = require('../../utils/util.js')
import {
  Base
} from "../Base"
const appId = getApp().globalData.app_id
/**
 * 
 * 文件名：Question.js  题库类
 *
 *
 * 创建时间：2018年7月30日 下午15:05:13
 *
 * 版权所有：
 */
class QuestionServer extends Base {

  /**
   * question参数 content,answer,questionTypeId,type,des
   * questionType参数 name,des,imgs,minAge,maxAge
   * questionResult questionId,minScore,maxScore,result,des
   */

  /**
   * 功能实现描述：  获取题目类型列表
   * @param data json条件数据 {appId:appId,openId:openId} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 订单数组[]
   */
  questionsTypeList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("questions/questionsTypeList", data)
  }
  /**
   * 功能实现描述：  获取题目列表
   * @param data json条件数据 {appId:appId,openId:openId} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 订单数组[]
   */
  questionsList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("questions/questionsList", data)
  }
  /**
   * 功能实现描述：  获取答题结果列表
   * @param data json条件数据 {appId:appId,openId:openId} 
   * @param currentPage 分页参数 当前页 默认第一页
   * @param pageSize 分页参数 一页显示多少条  默认10条
   * @param totalRows 分页参数 总条数 默认1条，这个固定写法content
   * @return 订单数组[]
   */
  questionsResultList(data = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(data, {
      currentPage,
      pageSize,
      totalRows,
      appId
    })
    return this.requestPost("questions/questionsResultList", data)
  }

  _getErrorCode() {
    return "1053"
  }
}
module.exports = {
  questionServer: new QuestionServer()
}