var fs = require("fs");
var data2 = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function (chunk) {
   data2 += chunk;
});

readerStream.on('end', function () {
   console.log('阅读完毕,文字内容为/：', data2);
});

readerStream.on('error', function (err) {
   console.log(err.stack);
});

console.log("程序执行完毕");

var data = '这是要写入的文字内容'
// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

// 使用 utf8 编码写入数据
writerStream.write(data, 'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> data, end, and error
writerStream.on('finish', function () {
   console.log("写入完成。");
});

writerStream.on('error', function (err) {
   console.log(err.stack);
});

console.log("程序执行完毕");



function fileCopy(src, dst) {
   var rs = fs.createReadStream(src);
   var ws = fs.createWriteStream(dst);

   rs.on('data', function (chunk) {
      // 判断有没有写完，避免写入速度跟不上读取速度 造成爆仓
      if (ws.write(chunk) === false) {
         rs.pause();
      }
   });

   rs.on('end', function () {
      ws.end();
   });

   ws.on('drain', function () {
      rs.resume();
   });
}