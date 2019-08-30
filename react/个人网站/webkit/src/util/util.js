import myEE from './eventEmitter';

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


// 页面跳转
export const goPage = (url) => {
    console.log(url)
    myEE.emit('push', url)
}



export const delayFn = (fn, condition,attr) => {
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

export default goPage

