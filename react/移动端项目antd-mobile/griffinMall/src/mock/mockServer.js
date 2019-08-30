let express = require('express');   //引入express
let Mock = require('mockjs');       //引入mock
var Random = Mock.Random
let app = express();        //实例化express
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'x-auth-token');
    next();
});

var imgFileIdArr = ['daeee7e8d367b5a737904cacc3fd293a', '6814beb8639221a5559d2604beda77f0', '661495f800a97d7442c3dde82db4504d', 'ecce2d819dcbb45879eb791dadc176b4', '3ca024ebd5b0922d6ff0f403a41f7079',
    '3d871b7973066243de0388ff6c41fc3b', '11a4b91e5625c4ab8d25d5f166854afe', '9aaf03cfa81d0357280fb88b9e207b4c', 'fb79d8398fc07c14b00270943bb564f9', '34381357f8c99a0d8826d4fed472df41',
    '090ea5a701acdc91afe11a013f7d03b7']

// 通知栏
app.use('/app/inform/message/:appId', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data|1-5': [{
            'key|+1': 1,
            'content': '@csentence',
        }]
    }))
})

// 今日报价列表
app.use('/offer/today/list', function (req, res) {

    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|1-5': [{
                'addTime': '@date',
                'name|1': ['江浙地区参考价', '北方地区参考价', '西南地区参考价', '广东地区参考价', '华北地区参考价', '上海地区参考价'],
                'sort|+1': 1,
                'content': '@ctitle(3,6)',
            }]
        }
    }))
})

const zixunJson = () => {
    return {
        'type|1': [0, 1],
        'addTime': '@date',
        'title': '@ctitle(5,30)', // 10-30字的中文
        'addReadTimes': '@natural(0, 10000)', // 0-10000的自然数
        'imgFileId|1': imgFileIdArr,
        'videoFileId|1': imgFileIdArr,
        'body': '@cparagraph',  // 随机生成段落
        'sort|+1': 1,
    }
}

// 资讯分类列表
app.use('/information/applet/list', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data|2-4': [{
            'name': '@ctitle(3,8)', // 10-30字的中文
            'informationVoPageBean': {
                'items|1-3': [zixunJson()]
            }
        }]
    }))
})

// 查询用户身份
app.use('/member/final/level', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data|1': [{
            'level': '@natural(0,6)'
        }, {}]
    }))
})




// 咨迅列表
app.use('/information/list', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|10': [zixunJson()]
        }
    }))
})

// 资讯详情
app.use('/information/detail/:id', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': zixunJson()
    }))
})


const baojiaJson = () => {
    return {
        'avatarUrl|1': imgFileIdArr,
        'kind|1': [0, 1],
        'id|+1': 1,
        'updateTime': '@date',
        'offerTypeId': '@natural(0, 50)',
        'offerTypeName': '@ctitle(1,5)',
        'title': '@ctitle(5,30)', // 10-30字的中文
        'nickName': "@cname",
        'fictitiousBrowseCount': '@natural(0, 10000)', // 0-10000的自然数
        'commentCount': '@natural(0, 50)',
        'body': '@cparagraph',  // 随机生成段落
        'offerExamineVos': {
        },
        'sort|+1': 1,
    }
}

// 报价分类列表
app.use('/offer/type/list', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|2-6': [{
                'kind|1': [0, 1],
                'id|+1': 1,
                "name": '@ctitle(2,5)',
            }]
        }

    }))
})


// 报价列表
app.use('/offer/list/app', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|10': [baojiaJson()],
            'totalCount': '@natural(0, 50)'
        }
    }))
})

// 报价详情
app.use('/offer/verify/:id', function (req, res) {
    res.json(Mock.mock({
        'retCode|1': [0, 1, 0],
        'retMsg': '你没有查看改报价的权限（mock模拟）',
        'data': '可以查看'
    }))
})




// 发布报价
app.post('/offer/save/app', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
    }))
})

// 报价详情
app.use('/offer/detail/:id', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': baojiaJson()
    }))
})


const commentJson = () => {
    return {
        'avatarUrl|1': imgFileIdArr,
        'kind|1': [0, 1],
        'addTime': '@date',
        'offerTypeId': '@natural(0, 50)',
        'offerTypeName': '@ctitle(1,5)',
        'title': '@ctitle(5,30)', // 10-30字的中文
        'nickName': "@cname",
        'fictitiousBrowseCount': '@natural(0, 10000)', // 0-10000的自然数
        'commentCount': '@natural(0, 50)',
        'body': '@ctitle(1,50)',
        'offerReplyVos|0-15': [{
            'avatarUrl|1': imgFileIdArr,
            'kind|1': [0, 1],
            'addTime': '@date',
            'offerTypeId': '@natural(0, 50)',
            'offerTypeName': '@ctitle(1,5)',
            'repliedNickName': "@cname", // 10-30字的中文
            'nickName': "@cname",
            'fictitiousBrowseCount': '@natural(0, 10000)', // 0-10000的自然数
            'body': '@ctitle(1,50)',
        }],
        'sort|+1': 1,
    }
}


// 报价列表
app.use('/offer/comment/list', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|10': [commentJson()],
            'totalCount': '@natural(0, 50)'
        }
    }))
})



// 会员行业列表
app.use('/member/industry/list/app/:id', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|1-8': [{
                'name': '@ctitle(1,5)',
                'id|+1': 1,
            }],
            'totalCount': '@natural(0, 50)'
        }
    }))
})


// 黄页列表
app.use('/member/list/app', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|10': [{
                'avatarUrl|1': imgFileIdArr,
                'name': '@ctitle(1,5)',
                'province': '@ctitle(1,4)',
                'city': '@ctitle(1,4)',
                'area': '@ctitle(1,4)',
                'tel': '@natural(11)',
                'moto': '@ctitle(2,8)', // 10-30字的中文
                'addTime': '@date',
                'memberIndustryVo': {
                    'name': '@ctitle(2,8)'
                }
            }],
            'totalCount': '@natural(0, 50)'
        }
    }))
})

// 会员详情
app.use('/member/detail', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            addTime: '@date',
            address: '@ctitle(1,5)',
            area: '@ctitle(1,5)',
            areaCode: '@natural(6)',
            memberIndustryId: '@natural(1,3)',
            memberIndustryVo: {
                name: '@ctitle(1,5)'
            },
            'avatarUrl|1': imgFileIdArr,
            memberLevelId: '@natural(1,3)',
            memberLevelVo: {
                name: '@ctitle(1,5)'
            },
            moto: '@ctitle(1,5)',
            name: '@ctitle(1,5)',
            companyName: '@ctitle(1,5)',
            city: '@ctitle(1,5)',
            province: '@ctitle(1,5)',
            tel: '@natural(11)',
            state: '@natural(1,5)',
        }
    }))
})

var randomStr = (min = Math.random(), max = Math.random()) => {
    if (min > max) {
        [min, max] = [max, min]
    }
    var imgFileIdArrs = imgFileIdArr.slice(parseInt(min * imgFileIdArr.length), parseInt(max * imgFileIdArr.length))
    imgFileIdArrs = imgFileIdArrs.slice(0,parseInt(Math.random()*8))
    return imgFileIdArrs.join(',')
}
const quanziJson = () => {

    return {
        'address': '@county(true)',
        'appId': 100,
        'avatarUrl|1': imgFileIdArr,
        'body': "@cparagraph",
        'commentCount': '@natural(0,139)',
        'coverFileId|1': imgFileIdArr,
        'fictitiousBrowseCount': '@natural(0, 3050)',
        'fileId|1': [randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr(),randomStr()],
        'fileType|1': [1, 0],
        'id|+1': 222,
        'lat': '@float(10,80)',
        'likes': '@boolean',
        'likesCount': '@natural(0, 510)',
        'lon': '@float(60,80)',
        'memberAddress': '@county(true)',
        'memberName': "@cname",
        'memberTel': 1 + '@natural(10)',
        'nickName': "@cname",
        'operatorTime': "@datetime('yy-MM-dd a HH:mm:ss')",
        'shareCount': '@natural(0, 50)',
        'type|1': [1, 0],
        'typeDesc': { id: 1, 'name|1': ["采购", '销售'] },
        'userId': "U1808270812341",
        'userName': "@cname",
    }
}

// 圈子数据
app.use('/circle/statistics', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            circleCount: '@natural(10,500)',
            commentCount: '@natural(10,1000)',
            fictitiousBrowseCount: '@natural(1000,90000)',
            shareCount: '@natural(0,100)',
        }
    }))
})

// 圈子轮播图
app.use('/banner/list/applet/:appId', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'imgFileId|1': imgFileIdArr,
        }
    }))
})

// 新获取的消息数
app.use('/circle/comment/mine/receive/count', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': '@natural(0,10)'
    }))
})


// 圈子列表
app.use('/circle/list', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|10': [quanziJson()],
            'totalCount': '@natural(0, 50)'
        }
    }))
})

// 圈子详情
app.use('/circle/detail/:id', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': quanziJson()
    }))
})

// 报价列表
app.use('/circle/comment/list', function (req, res) {
    res.json(Mock.mock({
        'retCode': 0,
        'data': {
            'items|10': [commentJson()],
            'totalCount': '@natural(0, 50)'
        }
    }))
})









app.listen('8090', () => {
    console.log('监听端口 8090')
})