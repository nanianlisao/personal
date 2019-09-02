const fs = require('fs')
const https = require('https')
var querystring = require('querystring');
var params = querystring.stringify({
    'appId': 73,
    "domainUrl": "localhost"
})

// let options = {
//     hostname:'https://zzsapi.njshushuo.com/',
//     path: '/offer/today/list/applet',
//     method: 'GET',
//     port: 443,
//     headers: {
//         'Content-Length': params.length
//     }
// }

let data = ''
let options = {
    hostname: 'm.njshushuo.com',
    path: '/api/subject/subjectList',
    port: 443,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
}
const req = https.request(options, function (res) {
    res.on('data', (d) => {
        // process.stdout.write(d);
        data += d.toString()
        // console.log(JSON.parse(data))
    });
    res.on('end', () => {
        data = data.replace(/\\"/g, "'")
        var data2 = JSON.parse(data.toString())
        let resultObj = data2.resultObj.map((x) => {
            return {
                name: x.name,
                imgs: x.imgs,
                tel: x.tel,
            }
        })
        console.log('开始写入文件');
        fs.writeFile('./data/aa.json', JSON.stringify(resultObj), (err) => {
            console.log(err)
        })
    });
});
req.on('error', (e) => {
    console.error(`请求遇到问题: ${e}`);
});
// 将数据写入请求主体。
req.write(params);
req.end();

console.log('开始运行subjectList.js...')
