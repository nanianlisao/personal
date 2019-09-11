// Buffer（缓冲器）
buf = Buffer.alloc(26);  // 创建一个长度为 26 Buffer。
for (var i = 0; i < 26; i++) {
   buf[i] = i + 56;
}

console.log(buf.toString('ascii'));       // 输出: abcdefghijklmnopqrstuvwxyz
console.log(buf.toString('ascii', 0, 5));   // 输出: abcde
console.log(buf.toString('utf8', 0, 5));    // 输出: abcde
console.log(buf.toString(undefined, 0, 5)); // 使用 'utf8' 编码, 并输出: abcde


var buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]); // 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
console.log(buf.toString('utf8'));
console.log(buf)






var buffer1 = Buffer.from('ABC');
var buffer2 = Buffer.from('ABCD');
var result = buffer2.compare(buffer1);

if (result < 0) {
   console.log(buffer1 + " 在 " + buffer2 + "之前");
} else if (result == 0) {
   console.log(buffer1 + " 与 " + buffer2 + "相同");
} else {
   console.log(buffer1 + " 在 " + buffer2 + "之后");
}


var buf1 = Buffer.from('abcdefghijkl');
var buf2 = Buffer.from('RUNOOB');

//将 buf2 插入到 buf1 指定位置上
buf2.copy(buf1, 2);

console.log(buf1.toString()); // abRUNOOBcdefghijkl