
const Constant = {
    data: {

        isTest: false,

        // wsWork: "ws://test.api.njdream.cn",
        // netWork: "http://test.api.njdream.cn",

        // netWork: "https://wx.jingyuu.cn",
        // wsWork: "wss://wx.jingyuu.cn",

        testNetWork: 'http://192.168.1.158:8020',
        testWsWork: 'ws://192.168.1.157:8080',

        // uploadFileUrl: 'https://wx.ershoudaren.cn',
        // testUploadFileUrl: 'https://wx.ershoudaren.cn',
        imgType: 'bmppnggifjpgjpegwebp',
        picUrl: 'https://file.njshushuo.com/',
        // testPicUrl: 'http://192.168.1.81:8070/file/pic/url/',
        testResourUrl: 'http://192.168.1.81:8070',
        pageSize: 10,
        taskArr: [] // websocket未创建时，缓存任务列表 外卖服务中，用户选择的地址信息
    },
    _BANNER: 2,
    _STORE: 3,
    _NEWS: 1,
    nearticket: '',

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
        return Constant.getLocalStorage('token');
    },

    setToken: (token) => {
        Constant.setLocalStorage('token', token);
    },

    getLocalStorage: (key) => {
        return localStorage.getItem(key)
    },

    setLocalStorage: (key, value) => {
        localStorage.setItem(key, value)
    }
}
export default Constant
