import { API, appId } from 'js/config'
import { Axios } from 'utils/util'

const publicParams = data => {
  const params = {
    appId: appId
  }
  return {
    ...params,
    ...data
  }
}

// 首页轮播
export const apiBanner = data => {
  return Axios.get(`${API}banner/list/applet`, publicParams(data))
}

// 菜单目录
export const apiMenuList = data => {
  return Axios.get(`${API}column/list/applet`, publicParams(data))
}

// 子栏目列表
export const apiSubtopic = data => {
  return Axios.get(`${API}subcolumn/list/applet`, publicParams(data))
}

// 资讯列表
export const apiMessage = data => {
  return Axios.get(`${API}info/list/applet`, publicParams(data))
}

// 联系我们提交信息
export const apiContact = data => {
  return Axios.post(`${API}contact/way/edit`, publicParams(data))
}

// 基础信息
export const apiBaseMsg = data => {
  return Axios.get(`${API}information/setting/detail/${appId}`)
}

// 律师团队
export const apiTeammate = data => {
  return Axios.get(`${API}teammate/list/applet`, publicParams(data))
}

// 分类管理
export const apiClassify = data => {
  return Axios.get(`${API}category/list/applet`, publicParams(data))
}

// 子分类管理
export const apiSubClassify = data => {
  return Axios.get(`${API}subcategory/list/applet`, publicParams(data))
}

// 关联团队人员
export const apiLawyer = data => {
  return Axios.get(`${API}teammate/sub/category/list/applet`, publicParams(data))
}

// 关联资讯
export const apiNews = data => {
  return Axios.get(`${API}info/sub/category/list/applet`, publicParams(data))
}

// 搜索

export const apiSearch = data => {
  return Axios.get(`${API}app/list`, publicParams(data))
}
