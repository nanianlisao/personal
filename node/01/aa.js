var fs = require("fs");
process.stdout.write('请输入要复制的文件数：')
process.stdin.on('data',data=>{
    console.log(data)
    // fs.mkdirSync('/02') // c盘根目录
    data = data.toString().trim()
    for(var i=1;i<=data;i++){
        fs.writeFile(`${i}.js`,`//通过编译产生的文件，这是 ${i}.js`,(err,data)=>{
            console.log(err)
        })
    }
})
