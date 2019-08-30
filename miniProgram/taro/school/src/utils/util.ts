import Taro from '@tarojs/taro'
import global, { baseUrl } from '@constants/global'

type requestMethod = 'GET' | 'POST'

interface requestRes {
  data: any,
  retCode: number,
  retMsg: string,
}

class AxiosClass {
  private request(method: requestMethod, url: string, data: object = {}, base = baseUrl): Promise<requestRes> {
    return Taro.request({
      url: base + url,
      data: data,
      method: method,
      header: {
        "x-auth-token": global.token,
      },
    }).then((res) => {
      if (res.data.retCode === 0) {
        return res.data
      } else {
        throw new Error(JSON.stringify(data))
      }
    })
  }

  get(url: string, data: object = {}, base = baseUrl): Promise<requestRes> {
    return this.request('GET', url, data, base)
  }

  post(url: string, data: object = {}, base = baseUrl): Promise<requestRes> {
    return this.request('POST', url, data, base)
  }
}

export const Axios = new AxiosClass()


type navgateMethod = 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab'

export function goPage(url: string, method: navgateMethod = 'navigateTo'): void {
  Taro[method]({
    url: url
  })
}
