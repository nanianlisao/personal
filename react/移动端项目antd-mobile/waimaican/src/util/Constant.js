
const Constant = {
    data: {

        isTest: false,

        // wsWork: "ws://test.api.njdream.cn",
        // netWork: "http://test.api.njdream.cn",

        netWork: "https://dcapi.njshushuo.com",
        wsWork: "wss://dcapi.njshushuo.com",

        testNetWork: "http://192.168.1.157:8080",
        testWsWork: "ws://192.168.1.157:8080",

        uploadFileUrl: "https://fileapi.njshushuo.com",
        testUploadFileUrl: "https://fileapi.njshushuo.com",
        imgType: "bmppnggifjpgjpegwebp",
        picUrl: "https://file.njshushuo.com/",
        testPicUrl: "http://192.168.1.81:8070/file/pic/url/",
        resourUrl: 'https://fileapi.njshushuo.com', // 短信路径
        testResourUrl: "http://192.168.1.81:8070",
        pageSize: 10,
        app_id: '',
        userInfo: '',
        firstIn: true,
        taskArr: [], // websocket未创建时，缓存任务列表
        userAddress: {
            // address: "撒as发的的",
            // appId: 3,
            // id: 10,
            // lat: 32.040359,
            // lon: 118.795124,
            // receiveName: "汪苏泷",
            // receivePhone: "13333333333",
            // roughAddress: "江苏省南京市秦淮区太平南路1号新世纪广场4楼405",
            // userId: "U1812110000068",
        },  // 外卖服务中，用户选择的地址信息
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