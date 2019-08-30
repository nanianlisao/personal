
import { StackActions, NavigationActions } from 'react-navigation'
import { AsyncStorage } from 'react-native';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import Constant from '~/util/Constant'
import GMBluetooth from 'react-native-gm-bluetooth';
import Sound from 'react-native-sound';  // 语音播放
const { ESC } = GMBluetooth;


export const Axios = {

    get: async (target, path, para, isShowMsg = false, baseURL = Constant.getNetWork()) => {

        var toast = Toast.show('加载中')
        var token = await AsyncStorage.getItem('token')
        return new Promise((reslove, reject) => {
            axios({
                method: 'get',
                url: path,
                baseURL: baseURL,
                params: para,
                headers: {
                    "x-auth-token": token,
                },
                timeout: 60000,
                responseType: 'json',
            }).then((res) => {
                // console.log(res)
                if (res.data.retCode == 0) {
                    Toast.hide(toast)
                    reslove(res.data);
                } else if (res.data.retCode == '8193') { // token验证过期
                    target.props.navigation.dispatch(resetNavigation(0, 'Login', {}))
                } else {
                    if (isShowMsg) {
                        Toast.hide(toast)
                        alert(res.data.retMsg);
                    }
                    reject({
                        res: res.data,
                        msg: `请求失败！，请检查参数： ${JSON.stringify(para)}`
                    });
                }
            }).catch((res) => {
                // console.log('出错了：', res)
            })
        })
    },
    post: async (target, path, para, isShowMsg = false, baseURL = Constant.getNetWork()) => {

        var toast = Toast.show('加载中')
        var token = await AsyncStorage.getItem('token')
        // console.log('toekn')
        return new Promise((reslove, reject) => {
            axios({
                method: 'post',
                url: path,
                baseURL: baseURL,
                data: para,
                headers: {
                    "x-auth-token": token,
                },
                timeout: 60000,
                responseType: 'json',
            }).then((res) => {
                if (res.data.retCode == 0) {
                    Toast.hide(toast)
                    reslove(res.data);
                } else if (res.data.retCode == '8193') { // token验证过期 
                    target.props.navigation.dispatch(resetNavigation(0, 'Login', {}))
                } else {
                    Toast.hide(toast)
                    if (isShowMsg) {
                        alert(res.data.retMsg);
                    }
                    reject({
                        res: res.data,
                        msg: `请求失败！，请检查参数： ${JSON.stringify(para)}`
                    });
                }
            }).catch((res) => {
                // console.log('出错了：', res)
            });
        })
    }
}

export function resetNavigation(index = 0, routeName, params = {}) {
    return StackActions.reset({
        index: index,
        actions: [
            NavigationActions.navigate({
                routeName: routeName,
                params: params
            })
        ],
    });
}


export async function print(data = {}) {
    ESC.init();
    ESC.alignCenter();
    ESC.fontBold();
    ESC.printAndNewLine();
    ESC.text('收款小票');
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.init();
    ESC.text('门店名称：' + data.storesName);
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.text('收款单号：' + data.payId);
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.text('付款方式：' + data.typeDesc);
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.text('付款金额：' + data.totalFee);
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.text('付款时间：' + data.createTimeEnd);
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.text(data.storesName + '欢迎您的到来');
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.printAndNewLine();
    ESC.sound();

}

export async function playVoice(str) {
    var SwitchVal = await AsyncStorage.getItem('SwitchVal')
    if (SwitchVal != 1) { // 语音播报开关未开启
        return
    }
    var s = new Sound('http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=' + str, null, (error) => {
        if (error) {
            // console.log('failed to load the sound', error);
            return;
        }
        s.setVolume(1.0)
        s.play((success) => {
            if (success) {
                // console.log('successfully finished playing');
            } else {
                // console.log('playback failed due to audio decoding errors');
            }
        });
    });
}