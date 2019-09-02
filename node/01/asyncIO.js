

var fs = require('fs')
var data = fs.readFile('input.txt',(err,data)=>{
    if(err) throw err;
    console.log(data.toString())
})
console.log('程序执行结束')