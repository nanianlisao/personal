
/**
 * 支付常用的一些函数
 */
import { Axios, goPage, postMessage, onMessage } from 'util/util'
import { Modal } from 'antd-mobile';
const alert = Modal.alert;

// 生成支付单并支付

export const ShoppingPay = (data = {}) => {
    let { ticketId, orderId } = data
    return new Promise(async (resolve, reject) => {
        if (window.env == 'ali') {
            let res = await Axios.post('/order/ali/dinner/pay', data)
            if (res.data.resultCode == 0) {
                if (res.data.payOrderAliappletVo) {
                    window.my.tradePay({
                        tradeNO: res.data.payOrderAliappletVo.tradeNO,
                        success: (res1) => {
                            if (res1.resultCode == '4000') {
                                alert('提示', '订单支付失败', [
                                    { text: '确定', style: { color: '#EA5520' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '6001' || res1.resultCode == '99') {
                                alert('提示', '您取消了支付', [
                                    { text: '确定', style: { color: '#EA5520' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '6002') {
                                alert('提示', '网络连接出错', [
                                    { text: '确定', style: { color: '#EA5520' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '9000') {
                                resolve(res)
                            }
                        },
                        fail: (res) => {
                            reject(res)
                        }
                    })
                } else {
                    resolve(res)
                }
            } else {
                alert('提示', res.data.resultMsg, [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
                reject(res)
            }
        } else if (window.env == 'wx') {
            let res = await Axios.post('/order/create/shopping/pay',data,true)
            if (res.data.resultCode == 0) {
                if (res.data.payOrderWcappletVo) {
                    let payOrderWcappletVo = res.data.payOrderWcappletVo
                    postMessage('pay', payOrderWcappletVo)
                    onMessage('pay', data => {
                        console.log(data)
                        if (data == 'success') {
                            resolve(res)
                        } else {
                            reject(data)
                        }
                    })
                } else {
                    resolve(res)
                }
            } else {
                alert('提示', res.data.resultMsg, [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
                reject(res)
            }

        }
    })

}



export const ShoppingPayAgain = (id) => {
    return new Promise(async (resolve, reject) => {
        if (window.env == 'ali') {
            let res = await Axios.post('/order/ali/dinner/pay')
            if (res.data.resultCode == 0) {
                if (res.data.payOrderAliappletVo) {
                    window.my.tradePay({
                        tradeNO: res.data.payOrderAliappletVo.tradeNO,
                        success: (res1) => {
                            if (res1.resultCode == '4000') {
                                alert('提示', '订单支付失败', [
                                    { text: '确定', style: { color: '#EA5520' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '6001' || res1.resultCode == '99') {
                                alert('提示', '您取消了支付', [
                                    { text: '确定', style: { color: '#EA5520' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '6002') {
                                alert('提示', '网络连接出错', [
                                    { text: '确定', style: { color: '#EA5520' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '9000') {
                                resolve(res)
                            }
                        },
                        fail: (res) => {
                            reject(res)
                        }
                    })
                } else {
                    resolve(res)
                }
            } else {
                alert('提示', res.data.resultMsg, [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
                reject(res)
            }
        } else if (window.env == 'wx') {
            let res = await Axios.post(`/order/again/pay/${id}`,{},true)
            if (res.data.resultCode == 0) {
                if (res.data.payOrderWcappletVo) {
                    let payOrderWcappletVo = res.data.payOrderWcappletVo
                    postMessage('pay', payOrderWcappletVo)
                    onMessage('pay', data => {
                        console.log(data)
                        if (data == 'success') {
                            resolve(res)
                        } else {
                            reject(data)
                        }
                    })
                } else {
                    resolve(res)
                }
            } else {
                alert('提示', res.data.resultMsg, [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
                reject(res)
            }

        }
    })

}