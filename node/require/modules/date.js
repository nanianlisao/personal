module.exports = new Date()   // 会被缓存


// module.exports = () =>{    // 通过返回函数的方式 跳过缓存
//     console.log('11111')
//     return new Date()
// }