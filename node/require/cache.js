// 缓存一个module  2019-06-20 11:55
// require会自动缓存模块
setInterval(() => {
    // 如何删除缓存
    Object.keys(require.cache).forEach(key => {
        delete require.cache[key]
    })
    let data = require('./modules/date')
    console.log(data.getTime())

}, 1000)


