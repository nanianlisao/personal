console.log(__filename);  // C:\Users\集梦1\Desktop\node\01\globalData.js
console.log(__dirname);   // C:\Users\集梦1\Desktop\node\01

console.info('文本消息')
console.error('错误消息')
console.warn('警告消息')

let users = {
    "admin": "123",
    "user1": "321",
    "user2": "213"
}
let name = ''
process.stdout.write("请输入用户名");
process.stdin.on('data', (input) => {
    input = input.toString().trim()
    if (!name) {
        if (Object.keys(users).indexOf(input) === -1) {
            process.stdout.write('用户名不存在' + '\n');
            process.stdout.write("请输入用户名:");
            name = "";
        }else{
            name = input
            process.stdout.write('请输入密码');
        }
    }else{
        if(input===users[name]){
            process.stdout.write('登录成功！' + '\n')
        }else{
            process.stdout.write('密码错误' + '\n');
            process.stdout.write("请输入密码:");
        }
    }
});
