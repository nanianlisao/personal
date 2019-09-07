
// 重写require

function $require(id) {
    const fs = require('fs')
    const path = require('path')
    const filename = path.join(__dirname, id)
    // 如果已经加载过了 从缓存中读取
    $require.cache = $require.cache || {}
    if ($require.cache[filename]) {
        return $require.cache[filename].exports
    }
    const dirname = path.dirname(filename)
    let code = fs.readFileSync(filename, 'utf8')
    let module = { id: filename, exports: {} }
    let exports = module.exports
    code = `
        (($require, module, exports, __dirname, __filename)=>{
            ${code}
        })($require, module, exports, dirname, filename)
    `
    eval(code)
    // 第一次加载完放入缓存中
    $require.cache[filename] = module
    return module.exports
}

let code = $require('./module/01.js')
console.log(code)