
const Constant = {
    data: {

        isTest: false,

        // wsWork: "ws://test.api.njdream.cn",
        // netWork: "http://test.api.njdream.cn",

        netWork: "https://dcapi.njshushuo.com",
        wsWork: "wss://dcapi.njshushuo.com",

        // testNetWork: "http://192.168.1.158:8080",
        testNetWork: "http://192.168.1.157:8080",
        testWsWork: "ws://192.168.1.157:8080",

        uploadFileUrl: "https://fileapi.njshushuo.com",
        testUploadFileUrl: "http://192.168.1.81:8070",
        imgType: "bmppnggifjpgjpegwebp",
        picUrl: "https://file.njshushuo.com/",
        testPicUrl: "https://sszn-dream-customer-bucket.oss-cn-shanghai.aliyuncs.com/",
        testPicUrl: "https://file.njshushuo.com/",
        resourUrl: 'https://fileapi.njshushuo.com', // 短信路径
        testResourUrl: "http://192.168.1.158:8080",
        serviceTel: '', // 客服电话
        pageSize: 10,
        appId: '',
        storesId: '',
        storesVos: {
            // "id": 3,
            // "appId": 1,
            // "name": "轻餐点餐长江路店",
            // "areaCode": "320102000000",
            // "province": "江苏省",
            // "city": "南京市",
            // "area": "玄武区",
            // "address": "江苏省南京市玄武区长江路1号",
            // "lon": 118.841353,
            // "lat": 32.34092,
            // "tel": "18114809096",
            // "beginTime": "00:00",
            // "endTime": "23:59",
            // "sort": 2,
            // "addTime": "2019-01-31 18:00:40",
            // "distance": null,
        },
        sharedUserId: '', // 分享者的userId //那年
        scopeUserInfo: false, // Boolean 是否授权了用户昵称头像
        memberDetail: null, // Object 用户头像信息
        taskArr: [],   // Array socket未创建时，请求暂时缓存在这里（主要针对微信）
        timerss: 0, // Number 全局请求缓存，更新用户信息
        isLoading: false,
        firstIn: true, // 全局检测是否是第一次通过分享链接进入
    },
    user_id: {
        phone: '',
        userId: ''
    },

    getResourUrl: () => {
        return Constant.data.isTest ? Constant.data.testResourUrl : Constant.data.resourUrl;
    },
    getWsWork: () => {
        return Constant.data.isTest ? Constant.data.testWsWork : Constant.data.wsWork;
    },

    getNetWork: () => {
        return Constant.data.isTest ? Constant.data.testNetWork : Constant.data.netWork;
    },

    getUpload: () => {
        return Constant.data.isTest ? Constant.data.testUploadFileUrl : Constant.data.uploadFileUrl;
    },


    getPicUrl: () => {
        return Constant.data.isTest ? Constant.data.testPicUrl : Constant.data.picUrl;
    },

    getToken: () => {
        return Constant.getLocalStorage("token");
    },

    setToken: (token) => {
        Constant.setLocalStorage("token", token);
    },

    getLocalStorage: (key) => {
        return localStorage.getItem(key)
    },

    setLocalStorage: (key, value) => {
        localStorage.setItem(key, value)
    }
}
export default Constant;