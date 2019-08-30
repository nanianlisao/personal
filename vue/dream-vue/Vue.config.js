var path = require('path')
function resolve(dir) {
    console.log(__dirname)
    return path.join(__dirname, dir)
}
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set('base', resolve('src/base')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('vue$', 'vue/dist/vue.js')
    }
}