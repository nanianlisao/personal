import axios from 'axios'
import qs from 'qs'
const AppId = 35
const headers = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}
// axios.defaults.baseURL = 'https://m.njdream.cn'
// axios.defaults.headers.post['Content-Type'] = 'Content-Type": "application/x-www-form-urlencoded;charset=utf-8'
class SubjectSever {
  /**
   * 获取菜系列表
   * @param  {Object} params      [status 是否显示给前台]
   * @param  {Number} currentPage [当前页]
   * @param  {Number} pageSize    [每页显示数据条数]
   * @param  {Number} totalRows   [description]
   */
  subjectCategoryList(params = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(params, { currentPage, pageSize, totalRows, appId: AppId })
    params = qs.stringify(params)
    return axios.post('nj/api/subject/subjectCategoryList', params, headers).then(res => res.data)
  }
}
class CommentSever {
  /**
   * 获取菜系列表
   * @param  {Object} params      [status 是否显示给前台]
   * @param  {Number} currentPage [当前页]
   * @param  {Number} pageSize    [每页显示数据条数]
   * @param  {Number} totalRows   [description]
   */
  queryCommentList(params = {}, currentPage = 1, pageSize = 10, totalRows = 1) {
    Object.assign(params, { currentPage, pageSize, totalRows, appId: AppId })
    params = qs.stringify(params)
    return axios.post('nj/api/comment/queryCommentList', params, headers).then(res => res.data)
  }
}
export default {
  subjectSever: new SubjectSever(),
  commentSever: new CommentSever()
}
