const express = require('express')
const https = require('https')
const app = express()
let access_token = ''
app.post('/pay', (req, res) => {
    let nonce_str = randomStr()   // 生成一个随机字符串
    let openid = process.env.openid
    const options = {
        hostname: 'https://api.mch.weixin.qq.com',
        path:'/pay/unifiedorder',
        method: 'POST'
    };
    const pays = https.request(options, (err, res2) => {
        console.log(res2)
        let rawData = ''
        res2.on('data', (chunk) => { rawData += chunk; });
        res2.on('end', () => {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData)
        });
    })
    pays.on('error',(err)=>{
        console.log(err)
    })
})

app.post('/system/login/:appId/:code', (req, res) => {
    let code = req.params.code
    const APPID = 'wxc4916a23aafaca26'
    const SECRET = '43830787dc8533da919f0f71799ce872'
    // 获取openid
    https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`, (res2) => {
        let rawData = '';
        res2.on('data', (chunk) => { rawData += chunk; });
        res2.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                process.env.openid = parsedData.openid
                res.json({
                    data: parsedData
                })
            } catch (e) {
                console.error(e.message);
            }
        });
    })

    // 获取access_token
    https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`, (res2) => {
        let rawData = '';
        res2.on('data', (chunk) => { rawData += chunk; });
        res2.on('end', () => {
            access_token = JSON.parse(rawData).access_token;
            console.log(access_token)
        });
    })
})



function randomStr() {	//产生一个32位随机字符串	
    var str = "";
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for (var i = 1; i <= 32; i++) {
        var random = Math.floor(Math.random() * arr.length);
        str += arr[random];
    }

    return str;
}

function createSign(obj) {	//签名算法（把所有的非空的参数，按字典顺序组合起来+key,然后md5加密，再把加密结果都转成大写的即可）
    var stringA = 'appid=' + obj.appid + '&body=' + obj.body + '&mch_id=' + obj.mch_id + '&nonce_str=' + obj.nonce_str + '&notify_url=' + obj.notify_url + '&openid=' + obj.openid + '&out_trade_no=' + obj.out_trade_no + '&spbill_create_ip=' + obj.spbill_create_ip + '&total_fee=' + obj.total_fee + '&trade_type=' + obj.trade_type;


    var stringSignTemp = stringA + '&key=shenzhenshikoudaisouatm123456789';
    stringSignTemp = md5(stringSignTemp);
    var signValue = stringSignTemp.toUpperCase();
    return signValue
}

app.listen('11111', () => {
    console.log('监听端口 11111')
})