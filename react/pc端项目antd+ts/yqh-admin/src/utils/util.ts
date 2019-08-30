import myEE from './eventEmitter';
import { message } from 'antd';
import axios from 'axios';
import { Constant } from './Constant';
/*
 * array 操作的数组
 * fromIndex 被操作item的索引
 * move 1上移 -1下移 0置顶
 * */
export const arrayMove = (array: any[], fromIndex: number, move: number) => {
    // 不在数组长度范围内移动则返回原数组
    if (fromIndex + move < 0 || fromIndex + move >= array.length || (fromIndex === 0 && move === 0)) {
        return array;
    }
    if (move === 0) {
        // 置顶
        array.unshift(array.splice(fromIndex, 1)[0]);
    } else {
        // 上下移动
        array[fromIndex + move] = array.splice(fromIndex, 1, array[fromIndex + move])[0];
    }
    return array;
}

// 深复制一个对象或数组
export const clone = (source: any) => {
    let sourceCopy = source instanceof Array ? [] : {}
    for (let item in source) {
        if (typeof source[item] === 'object' && source[item]) {
            (sourceCopy as any)[item] = clone(source[item])
        } else {
            (sourceCopy as any)[item] = source[item]
        }
    }
    return sourceCopy
}

/**
 * @param day number 当前日期的后几天
 * @returns string 当前日期后几天的日期 yyyy-MM-dd
 */
export const getDate = (day: number): string => {
    let today = new Date();

    let timeStamp = today.getTime() + 1000 * 60 * 60 * 24 * day;

    today.setTime(timeStamp);

    let tYear = today.getFullYear();
    let tMonth = today.getMonth() >= 9 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1);
    let tDate = today.getDate() >= 10 ? today.getDate() : "0" + (today.getDate() + 1);
    return tYear + "-" + tMonth + "-" + tDate;
}

// 发送push事件  在Router组件 监听 并进行页面跳转
export const goPage = (url: string) => {
    myEE.emit('push', url)
}

// upload组件 图片上传前的检查
export function beforeImgUpload(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
        let fileArr = file.name.split(".")
        let type = fileArr[fileArr.length - 1].toLowerCase();
        if (Constant.data.imgType.indexOf(type) < 0) { // 根据后缀，判断是否符合视频格式
            message.warning("不是指定图片格式,重新选择,支持格式为jpg、png、gif");
            reject()
            return
        }
        if (file.size >= 5120000) {
            message.warning("图片超过5M");
            reject()
            return
        }
        resolve()
    })

}

// upload组件 文档上传前的检查
export function beforePdfUpload(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
        let fileArr = file.name.split(".")
        let type = fileArr[fileArr.length - 1].toLowerCase();
        if (Constant.data.documentType.indexOf(type) < 0) { // 根据后缀，判断是否符合视频格式
            message.warning("不是指定文档格式,重新选择,支持格式为doc、docx、xlsx、pptx、pdf");
            reject()
            return
        }
        if (file.size >= 5120000) {
            message.warning("文档超过5M");
            reject()
            return
        }
        resolve()
    })

}

// input select 等onchange 参数类型
export type EventValue = string | string[] | number | number[]

// table column 类型
export interface ColumnProps<T> {
    title?: string;
    key?: React.Key;
    dataIndex?: string;
    width?: string;
    render?: (text: any, record: T, index: number) => React.ReactNode;
}

export interface RequestRes {
    data: any,
    retCode: number,
    retMsg: string,
}

export const Axios = {
    get: (path: string, para: object = {}, isShowMsg: boolean = false, baseURL: string = Constant.getNetWork(), timeout: number = 60000): Promise<RequestRes> => {
        return axios({
            baseURL,
            headers: {
                "x-auth-token": Constant.getToken(),
            },
            method: 'get',
            params: para,
            responseType: 'json',
            timeout,
            url: path,
        }).then((res) => {
            return new Promise((reslove, reject) => {
                if (res.data.retCode === 0) {
                    reslove(res.data);
                } else {
                    if (res.data.retCode === 8193 || res.data.retCode === 8194) {
                        goPage("/login")
                    }
                    if (isShowMsg) {
                        message.warning(res.data.retMsg);
                    }
                    reject(res.data);
                }
            })
        });
    },

    // 在login时，根据域名信息查询appCode 减少用户登录时的输入
    getIdForDomain: (domain: string): Promise<RequestRes> => {
        return axios({
            baseURL: Constant.getDomainUrl(),
            method: 'get',
            params: { domainUrl: domain },
            responseType: 'json',
            timeout: 60000,
            url: "/app/detail",
        }).then((res) => {
            return new Promise((reslove, reject) => {
                if (res.data.retCode === 0) {
                    reslove(res.data);
                } else {
                    reject(res.data);
                }
            })
        });
    },

    post: (path: string, para: object = {}, isShowMsg: boolean = true, baseURL = Constant.getNetWork(), timeout: number = 60000): Promise<RequestRes> => {
        return axios({
            baseURL,
            data: para,
            headers: {
                "x-auth-token": Constant.getToken(),
            },
            method: 'post',
            responseType: 'json',
            timeout,
            url: path,
        }).then((res) => {
            return new Promise((reslove, reject) => {
                if (res.data.retCode === 0) {
                    reslove(res.data);
                } else {
                    if (isShowMsg) {
                        message.error(res.data.retMsg);
                    }
                    reject(res.data);
                }
            })
        });
    }
}
export default goPage