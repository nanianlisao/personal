
let test = false

let _TEXT_BASE_URL = 'http://192.168.1.159:8010/'
let _BASE_URL = 'https://gwapi.njshushuo.com/'

let _APPID = 113

let _TEXT_APPID = 1

// 导出请求地址
export const API = test ? _TEXT_BASE_URL : _BASE_URL

export const appId = test ? _TEXT_APPID : _APPID
