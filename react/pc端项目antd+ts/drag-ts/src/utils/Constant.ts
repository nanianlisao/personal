/**
 * Change by chenxiang on 2019/08/14.
 */
export const Constant = {
    data: {
        documentType: "docxlsxpptxpdf",   // 文档类型字符串集 用indexOf来判断文件格式是否符合
        domainUrl: "https://fileapi.njshushuo.com/",    // 给商家分配域名时，根据域名查询appCode，减少用户登录时输入appCode
        imgType: "bmppnggifjpgjpegwebp", // 图片类型字符串集 用indexOf来判断文件格式是否符合
        isTest: false,     // 是否使用测试环境的域名
        netWork: "https://dcapi.njshushuo.com", // 请求域名（默认）
        pageSize: 10,     // table中每页显示条数（统一配置）
        picUrl: "https://file.njshushuo.com/",  // 图片路径前缀
        testDomainUrl: "http://192.168.1.81:8070/",
        testNetWork: "http://192.168.1.58:8030",
        testPicUrl: "https://file.njshushuo.com/",
        testUploadFileUrl: "https://fileapi.njshushuo.com",
        testWsWork: "ws://192.168.1.81:8080",
        uploadFileUrl: "https://fileapi.njshushuo.com", // 请求域名（上传文件操作时）
        videoType: "mp4rmvbaviwmvflv",  // 视频类型字符串集 用indexOf来判断文件格式是否符合
        wsWork: "wss://tsapi.njshushuo.com",    // webSocket请求域名
    },

    getWsWork: () => {
        return Constant.data.isTest ? Constant.data.testWsWork : Constant.data.wsWork
    },

    getNetWork: () => {
        return Constant.data.isTest ? Constant.data.testNetWork : Constant.data.netWork
    },

    getDomainUrl: () => {
        return Constant.data.isTest ? Constant.data.testDomainUrl : Constant.data.domainUrl
    },

    getUpload: () => {
        return Constant.data.isTest ? Constant.data.testUploadFileUrl : Constant.data.uploadFileUrl
    },

    getPicUrl: () => {
        return Constant.data.isTest ? Constant.data.testPicUrl : Constant.data.picUrl
    },

    // 获取localStorage
    getLocalStorage: (key: string): string | null => {
        return localStorage.getItem(key)
    },

    // 设置localStorage
    setLocalStorage: (key: string, value: any) => {
        localStorage.setItem(key, value)
    },

}

export default Constant