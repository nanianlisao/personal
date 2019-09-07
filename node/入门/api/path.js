//通过编译产生的文件，这是 3.js
const path = require('path')
var temp = path.join(__dirname,'../serve/data/aa.json');
console.log(path.basename(temp,".json")) // 获取文件名 // aa
console.log(path.dirname(temp)) // 获取当前文件夹路径 D:\workspace\react\personal\node\serve\data
console.log(path.extname(temp)) // 获取当前文件后缀名 .json
// 如果提供了 `dir`、 `root` 和 `base`，
// 则返回 `${dir}${path.sep}${base}`。
// `root` 会被忽略。
var newPath= path.format({
    root: '/ignored',
    dir: '/home/user/dir',
    base: 'file.txt'
  });
console.log(newPath) // // 返回: '/home/user/dir/file.txt'
var pathObj = path.parse(newPath)
console.log(pathObj) // // 转成json 返回: { root: '/',dir: '/home/user/dir',base: 'file.txt',ext: '.txt',name: 'file' }

console.log(path.relative(temp,newPath)) // ..\..\..\..\..\..\..\home\user\dir\file.txt 获取 第一个路径相对第二个路径之间的相对路径
