
const Constant = {
    data: {

        isTest: false,

        // wsWork: "ws://test.api.njdream.cn",
        // netWork: "http://test.api.njdream.cn",

        netWork: "https://zzsapi.njshushuo.com",
        wsWork: "wss://zzsapi.njshushuo.com",

        // testNetWork: "http://192.168.1.158:8080",
        testNetWork: "http://192.168.1.157:8080",
        testWsWork: "ws://192.168.1.157:8080",

        uploadFileUrl: "https://fileapi.njshushuo.com",
        testUploadFileUrl: "http://192.168.1.81:8070",
        imgType: "bmppnggifjpgjpegwebp",
        picUrl: "https://file.njshushuo.com/",
        testPicUrl: "https://file.njshushuo.com/",
        resourUrl: 'https://fileapi.njshushuo.com', // 短信路径
        testResourUrl: "http://192.168.1.158:8080",
        pageSize: 10,
        app_id: '',
        userInfo: '', // Object 用户头像信息
        memberDetail: null, // Object 用户头像信息
        taskArr: [],   // Array socket未创建时，请求暂时缓存在这里（主要针对微信）
        timerss: 0, // Number 全局请求缓存，更新用户信息
        isLoading: false,
    },
    _BANNER: 2,
    _STORE: 3,
    _NEWS: 1,
    nearticket: "",
    user_id: {
        phone: ''
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