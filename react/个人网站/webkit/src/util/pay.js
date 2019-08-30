
/**
 * 支付常用的一些函数
 */
import { Axios, goPage, postMessage, onMessage } from 'util/util'
import { Modal } from 'antd-mobile';
const alert = Modal.alert;

// 下单并且支付
export const payOut = (data = {}) => {
    let { setCode, phone, message, shoppingCartId, storesId, ticketId, date, orderTime, choseStyle } = data
    return new Promise(async (resolve, reject) => {
        if (window.env == 'ali') {
            let res1 = await Axios.post('/order/ali/create/pay', {
                "code": setCode,
                "phone": phone,
                "remark": message,
                "shoppingCartId": shoppingCartId,
                "storesId": storesId,
                "ticketId": ticketId,
                "tableId": "",
                "takeTime": date + ' ' + orderTime + ':00',
                "way": choseStyle
            })
            console.log(res1)
            if (res1.data.resultCode == 0) {
                if (res1.data.payOrderAliappletVo) {
                    window.my.tradePay({
                        tradeNO: res1.data.payOrderAliappletVo.tradeNO,
                        success: (res) => {
                            if (res.resultCode == '4000') {
                                alert('提示', '订单支付失败', [
                                    { text: '确定', style: { color: '#FF9A00' } },
                                ])
                                reject(res)
                            }
                            if (res.resultCode == '6001' || res.resultCode == '99') {
                                alert('提示', '您取消了支付', [
                                    { text: '确定', style: { color: '#FF9A00' } },
                                ])
                                reject(res)
                            }
                            if (res.resultCode == '6002') {
                                alert('提示', '网络连接出错', [
                                    { text: '确定', style: { color: '#FF9A00' } },
                                ])
                                reject(res)
                            }
                            if (res.resultCode == '9000') {
                                resolve(res1)
                            }
                        },
                        fail: (res) => {
                            reject(res)
                        }
                    })
                } else {
                    resolve(res1)
                }

            } else {
                alert('提示', res1.data.resultMsg, [
                    { text: '确定', style: { color: '#FF9A00' } },
                ])
                reject(res1)
            }
        } else if (window.env == 'wx') {
            let res1 = await Axios.post('/order/create/pay', {
                "code": setCode,
                "phone": phone,
                "remark": message,
                "shoppingCartId": shoppingCartId,
                "storesId": storesId,
                "ticketId": ticketId,
                "tableId": "",
                "takeTime": date + ' ' + orderTime + ':00',
                "way": choseStyle
            })
            if (res1.data.resultCode == 0) {
                if (res1.data.payOrderWcappletVo) {
                    let payOrderWcappletVo = res1.data.payOrderWcappletVo
                    postMessage('pay', payOrderWcappletVo)
                    onMessage('pay', data => {
                        console.log(data)
                        if (data == 'success') {
                            resolve(res1)
                        } else {
                            reject(data)
                        }
                    })
                } else {
                    resolve(res1)
                }

            } else {
                alert('提示', res1.data.resultMsg, [
                    { text: '确定', style: { color: '#FF9A00' } },
                ])
                reject(res1)
            }

        }
    })
}



// 无场景支付支付

export const consumePay = (data = {}) => {
    let { payType, storesId, totalFee, storesCashierId } = data
    return new Promise(async (resolve, reject) => {
        let res = await Axios.post('/pay/consume/pay', {
            payType: payType,
            storesCashierId,
            storesId,
            totalFee
        })
        if (window.env == 'ali') {
            if (res.data.resultCode == 0) {
                if (res.data.payOrderAliappletVo) {
                    window.my.tradePay({
                        tradeNO: res.data.payOrderAliappletVo.tradeNO,
                        success: (res1) => {
                            if (res1.resultCode == '4000') {
                                alert('提示', '订单支付失败', [
                                    { text: '确定', style: { color: '#FF9A00' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '6001' || res1.resultCode == '99') {
                                alert('提示', '您取消了支付', [
                                    { text: '确定', style: { color: '#FF9A00' } },
                                ])
                                reject(res1)
                            }
                            if (res1.resultCode == '6002') {
                                alert('提示', '网络连接出错', [
                                    { text: '确定', style: { color: '#FF9A00' } },
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
                    { text: '确定', style: { color: '#FF9A00' } },
                ])
                reject(res)
            }
        } else if (window.env == 'wx') {
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
                    { text: '确定', style: { color: '#FF9A00' } },
                ])
                reject(res)
            }

        }
    })

}