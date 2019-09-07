// require 优先加载缓存 模块 》》 原生模块 》》 js文件 》》 json文件 》》 node文件 
// 文件夹 package.json 中main指向的文件 》》 index.js

// 若不以‘./’ 或者 ‘/’开始 则为加载node原生模块
const modules = require('./modules')
console.log(modules)   // { name: '这是aa.js' }