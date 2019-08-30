import myEE from './eventEmitter';
import { Toast, Modal } from 'antd-mobile';
import axios from 'axios';
import constant from './Constant';
const alert = Modal.alert;
/*
* array 操作的数组
* fromIndex 被操作item的索引
* move 1上移 -1下移 0置顶
* */
Date.prototype.Format = function (fmt = "yyyy-MM-dd hh:mm:ss") { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

export function isHttpImg(img) {
    if (img) {
        return img.startsWith('http')
    }
}

export function throttle(method, delay = 100, duration = 500) {
    var timer = null;
    var begin = new Date();
    return function () {
        var context = this, args = arguments;
        var current = new Date();
        clearTimeout(timer);
        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function () {
                method.apply(context, args);
            }, delay);
        }
    }
}

/**
 * 检验手机号码
 */
export const checkPhone = (tel) => {
    if ((/^0\d{2,3}-?\d{7,8}$/.test(tel) || /^1(3|4|5|7|8|9)\d{9}$/.test(tel) || /^400[0-9]{7}/.test(tel))) {
        return true
    } else {
        return false
    }
}
export const objDeepCopy = function (source) {
    var sourceCopy = source instanceof Array ? [] : {}
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
    }
    return sourceCopy
}
export const clone = function (source) {
    var sourceCopy = source instanceof Array ? [] : {}
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' && source[item] ? clone(source[item]) : source[item]
    }
    return sourceCopy
}

export const getDate = (day) => {
    let today = new Date();

    let timeStamp = today.getTime() + 1000 * 60 * 60 * 24 * day;

    today.setTime(timeStamp);

    let tYear = today.getFullYear();
    let tMonth = today.getMonth() >= 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1);
    let tDate = today.getDate() >= 10 ? today.getDate() : "0" + (today.getDate() + 1);
    return tYear + "-" + tMonth + "-" + tDate;
}


export const postMessage = async (type, key) => {
    if (window.env === 'ali') {
        window.my.postMessage({ type: type, key: key });
    } else if (window.env === 'wx') {
        if (window.ws && window.ws.readyState != 1) { // 如果当前socket断开了 发起重连
            Toast.loading('正在重新连')
            await createWxSocket()
        }
        window.ws.send(JSON.stringify({
            type: '1',
            appId: constant.data.appId,
            token: localStorage.getItem('token'),
            data: {
                type: type,
                key: key,
            }
        }))

    } else {
        alert('提示', '向主题发送消息，消息类型：' + type)
    }
}

function createWxSocket() {
    return new Promise((resolve, reject) => {
        var token = localStorage.getItem('token')
        var appId = constant.data.appId
        let type = 2
        let url = `${constant.getWsWork()}/webSocket/bothway/${token}/${type}`
        window.ws = new WebSocket(url);
        window.ws.onopen = (e) => {
            Toast.success('socket被动连接成功')
            resolve()
            var taskArr = constant.data.taskArr
            if (taskArr.length > 0) {
                console.log(taskArr)
                taskArr.foreach((x) => {
                    window.ws.send(JSON.stringify({
                        type: '1',
                        token: token,
                        appId: appId,
                        data: {
                            type: x.type,
                            key: x.key,
                        }
                    }))
                })
                taskArr = []
            }
        }

        this.socketTimer = setInterval(() => {
            window.ws.send('socket')
        }, 30000)




        window.ws.onclose = (e) => {
            Toast.loading('重新连接会话', 1)
            setTimeout(() => {
                clearInterval(this.socketTimer)
                this.createWxSocket()
            }, 1000);
            console.log("close");
        }

        window.ws.onmessage = (e) => {
            let data = JSON.parse(e.data)
            if (data.key === 'init') {
                constant.user_id.phone = data.data.phone
                constant.data.scopeUserInfo = data.data.scopeUserInfo
                constant.data.appId = data.data.appId
            } else {
                myEE.emit(data.key, data.data);
            }
        }
    })


}

export const onMessage = (key, callback, method = true) => {
    if (method) {
        myEE.once(key, callback)
    } else {
        myEE.on(key, callback)
    }
}


// 获取当前位置
export const getLoaction = () => {
    return new Promise((resolve, reject) => {
        if (window.env === 'ali') {
            window.my.getLocation({
                success: (res) => {
                    console.log(res)
                    resolve(res)
                },
                fail(res) {
                    console.log(res)
                    reject(res)
                }
            })
        } else {
            postMessage('getLocation', 'getLocation')
            onMessage('getLocation', data => {
                resolve(data)
            })
        }
    })
}

// 选择位置
export const chooseLocation = (callback) => {
    postMessage('location', 'chooseLocation');
    onMessage("chooseLocation", data => {
        callback(data)
    })
}

// 页面跳转
export const goPage = (url) => {
    myEE.emit('push', url)
}

// 页面跳转
export const goBack = (url) => {
    myEE.emit('goBack')
}


export const Axios = {

    get: (path, para, isShowMsg = false, baseURL = constant.getNetWork()) => {
        !constant.data.isLoading && Toast.loading('加载中', 0)
        constant.data.isLoading = true
        return new Promise((reslove, reject) => {
            let timer = null;
            let request = () => {
                if (1) {
                    // if (constant.getToken() || checkPath(path)) {
                    clearInterval(timer)
                    return axios({
                        method: 'get',
                        url: path,
                        baseURL: baseURL,
                        params: para,
                        headers: {
                            "x-auth-token": constant.getToken(),
                        },
                        timeout: 60000,
                        responseType: 'json',
                    }).then((res) => {
                        Toast.hide()
                        constant.data.isLoading = false
                        if (res.data.retCode == 0) {
                            reslove(res.data);
                        } else if (res.data.retCode == '8193') {
                            if (window.env === 'wx' && window.ws && window.ws.readyState != 1) {
                                constant.data.taskArr.push({ type: 'token', key: 'token' })
                            } else {
                                postMessage('token', 'token')
                            }
                            onMessage('token', async (mesData) => {
                                if (mesData.token) {
                                    localStorage.setItem('token', mesData.token)
                                    constant.user_id.phone = mesData.phone
                                } else {
                                    localStorage.setItem('token', mesData)
                                }
                                try {
                                    let res2 = Axios.get(path, para, isShowMsg, baseURL)
                                    reslove(res2)
                                } catch (e) {
                                    reject()
                                }
                            })
                        } else {
                            if (isShowMsg) {
                                Toast.hide()
                                constant.data.isLoading = false
                                Toast.fail(res.data.retMsg);
                            }
                            reject({
                                res: res.data,
                                msg: `请求失败！，请检查参数： ${JSON.stringify(para)}`
                            });
                        }
                    }).catch((res) => {
                        reject(res)
                        if (isShowMsg) {
                            Toast.hide()
                            constant.data.isLoading = false
                            Toast.fail('网络请求错误', 1);
                        }
                    })
                }
            }
            request()
        })
    },
    post: (path, para, isShowMsg = false, baseURL = constant.getNetWork()) => {
        !constant.data.isLoading && Toast.loading('加载中', 0)
        constant.data.isLoading = true
        return new Promise((reslove, reject) => {
            let timer = null;
            let request = () => {
                if (1) {
                    // if (constant.getToken()) {
                    clearInterval(timer)
                    return axios({
                        method: 'post',
                        url: path,
                        baseURL: baseURL,
                        data: para,
                        headers: {
                            "x-auth-token": constant.getToken(),
                        },
                        timeout: 60000,
                        responseType: 'json',
                    }).then((res) => {
                        Toast.hide()
                        constant.data.isLoading = false
                        if (res.data.retCode == 0) {
                            reslove(res.data);
                        } else if (res.data.retCode == '8193') {
                            if (window.env === 'wx' && window.ws && window.ws.readyState != 1) {
                                constant.data.taskArr.push({ type: 'token', key: 'token' })
                            } else {
                                postMessage('token', 'token')
                            }
                            onMessage('token', async (mesData) => {
                                if (mesData.token) {
                                    localStorage.setItem('token', mesData.token)
                                    constant.user_id.phone = mesData.phone
                                } else {
                                    localStorage.setItem('token', mesData)
                                }
                                try {
                                    let res2 = Axios.post(path, para, isShowMsg, baseURL)
                                    reslove(res2)
                                } catch (e) {
                                    reject()
                                }
                            })
                        } else {
                            if (isShowMsg) {
                                Toast.fail(res.data.retMsg);
                            }
                            reject({
                                res: res.data,
                                msg: `请求失败！，请检查参数： ${JSON.stringify(para)}`
                            });
                        }
                    }).catch((res) => {
                        reject(res)
                        if (isShowMsg) {
                            Toast.hide()
                            constant.data.isLoading = false
                            Toast.fail('网络请求错误', 1);
                        }
                    })
                }
            }
            request()
        })
    }
}

export const delayFn = (fn, condition, attr) => {
    let count = 0;
    let timer = setInterval(() => {
        console.log(condition[attr])
        if (condition[attr]) {
            clearInterval(timer)
            fn()
        } else {
            count++;
            if (count > 50) {
                clearInterval(timer)
            }
        }
    }, 100)
}


export const parseQueryString = (url) => {
    var reg_url = /^[^\?]+\?([\w\W]+)$/,
        reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
        arr_url = reg_url.exec(url),
        ret = {};
    if (arr_url && arr_url[1]) {
        var str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = decodeURI(result[2]);
        }
    }
    return ret;
}

export const CallPhone = (number, fromType) => {
    switch (fromType) {
        case '1': // h5

    }
}

export function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

export default goPage

