/**
 * Created by chenlu on 2018/10/31.
 */
export const Constant = {
    // 项目中 运用到的一些常量
    data: {
        documentType: "docxlsxpptxpdf",
        domainUrl: "https://fileapi.njshushuo.com/",
        imgType: "bmppnggifjpgjpegwebp",
        isTest: false,
        netWork: "https://yqhapi.njshushuo.com",
        pageSize: 10,
        pagesize: 10,
        picUrl: "https://file.njshushuo.com/",
        testDomainUrl: "http://192.168.1.81:8070/",
        testNetWork: "http://192.168.1.158:8010",
        testPicUrl: "https://file.njshushuo.com/",
        testUploadFileUrl: "https://fileapi.njshushuo.com",
        testWsWork: "ws://192.168.1.81:8080",
        uploadFileUrl: "https://fileapi.njshushuo.com",
        videoType: "mp4rmvbaviwmvflv",
        wsWork: "wss://tsapi.njshushuo.com",
    },

    getWsWork: () => {
        return Constant.data.isTest ? Constant.data.testWsWork : Constant.data.wsWork;
    },

    getNetWork: () => {
        return Constant.data.isTest ? Constant.data.testNetWork : Constant.data.netWork;
    },

    getDomainUrl: () => {
        return Constant.data.isTest ? Constant.data.testDomainUrl : Constant.data.domainUrl;
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

    setToken: (token: any) => {
        Constant.setLocalStorage("token", token);
    },

    getLocalStorage: (key: string) => {
        return localStorage.getItem(key)
    },

    setLocalStorage: (key: string, value: any) => {
        localStorage.setItem(key, value)
    },

}

export default Constant