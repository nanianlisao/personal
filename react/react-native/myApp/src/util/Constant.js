/**
 * Created by chenlu on 2018/10/31.
 */

import { AsyncStorage } from 'react-native';
const Constant = {
    data: {

        isTest: false,

        // wsWork: "ws://test.api.njdream.cn",
        // netWork: "http://test.api.njdream.cn",

        netWork: "https://spapi.njshushuo.com",
        wsWork: "wss://spapi.njshushuo.com",

        testNetWork: "http://192.168.1.81:8060",
        testWsWork: "ws://192.168.1.81:8060",

        uploadFileUrl: "https://wx.ershoudaren.cn",
        testUploadFileUrl: "https://wx.ershoudaren.cn",
        imgType: "bmppnggifjpgjpegwebp",
        picUrl: "https://wx.ershoudaren.cn/file/pic/url/",
        testPicUrl: "http://192.168.1.81:8070/file/pic/url/",
        resourUrl: 'https://wx.ershoudaren.cn', // 短信路径
        testResourUrl: "http://192.168.1.81:8070",
        pageSize: 10,
        app_id: 1,
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

    getToken: async () => {
        return await Constant.getLocalStorage("token");
    },

    setToken: (token) => {
        Constant.setLocalStorage("token", token);
    },

    getLocalStorage: (key) => {
        return AsyncStorage.getItem(key)
    },

    setLocalStorage: (key, value) => {
        AsyncStorage.setItem(key, value)
    }
}
export default Constant;