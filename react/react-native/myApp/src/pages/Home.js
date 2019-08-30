import React from "react";
import styles2 from "~/common/style";
import { StackActions, NavigationActions } from 'react-navigation'
import { AsyncStorage, AppState, TouchableOpacity, View, Text, Image, StyleSheet, TextInput, Alert } from "react-native";
import { Axios, print, playVoice } from "~/util/util";
import Constant from "~/util/Constant"
import BackgroundJob from 'react-native-background-job';  // 后台任务
import GMBluetooth from 'react-native-gm-bluetooth';
const { ESC } = GMBluetooth;

var ws = null
export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            payAmount: 0,
            payCount: 0,
            newOrderCount: 0
        }
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: params ? params.title : "首页",
        };
    };


    async componentWillMount() {
        var appName = await AsyncStorage.getItem('appName')
        this.props.navigation.setParams({ title: appName });
    }

    componentWillUnmount() {
        // console.log('即将卸载了 页面')
        AppState.removeEventListener('change', this._handleAppStateChange);
        ws && ws.close()
    }


    async componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        // this.createWebsocket()
        this.loadData()
        this.createBackgroundJob()  // 创建后台任务

        this.autoConnectBlueTooth() // 自动连接蓝牙设备
    }

    async loadData() {
        console.log('loadData')
        var timestamp = await AsyncStorage.getItem('timestamp')
        let res = await Axios.get(this, '/stores/statistic', {
            timestamp: timestamp ? timestamp : 0
        })
        this.setState({
            payAmount: res.data.payAmount,
            payCount: res.data.payCount,
            newOrderCount: res.data.newOrderCount
        })
    }


    // 切换app当前状态
    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active') { // 切换到前台 
            this.loadData()  // 刷新一次数据
            var isEnabled = await GMBluetooth.isEnabled() // 进行一次蓝牙检测 
            if (!isEnabled) {
                await AsyncStorage.setItem('SwitchValBluetooth', '0')
            }
        }
    }

    initListener() {
        // 监听是否断开
        // GMBluetooth.on('connectionLost', (e) => {
        //     console.log('connectionLost',e)
        // });

        // GMBluetooth.on('bluetoothEnabled', () => {  // 蓝牙打开
        //     console.log('bluetoothEnabled')
        // });

        // GMBluetooth.on('connectionSuccess', () => {
        //     // playVoice('蓝牙连接成功')
        //     console.log('connectionSuccess')
        // });
        // GMBluetooth.on('connectionFailed', () => {
        //     console.log('connectionFailed')
        // });
        GMBluetooth.on('error', () => {  // 蓝牙链接失败
            console.log('error')
            playVoice('蓝牙连接已断开，请重新连接')
        });

    }

    // 创建socket任务
    async createWebsocket() {
        var token = await AsyncStorage.getItem('token')
        var url = Constant.getWsWork() + `/webSocket/order/2/${token}`
        console.log('Websocket,url:', url)
        ws = new WebSocket(url);
        ws.onopen = () => {
            console.log("open");
        };
        ws.onmessage = async (e) => {

            var state = AppState.currentState
            console.log(state);
            if (state == 'active') { // 如果是在前台 更新数据
                this.loadData()
            }
            var item = JSON.parse(e.data)
            print(item)
            playVoice(item.broadcast) // 语音播报

        };
        ws.onerror = (e) => {
            console.log(e);
        };
        ws.onclose = (e) => {
            console.log('onclose')
            // ws = new WebSocket(url);
            // console.log(e.code, e.reason);
        };
        this.initListener()
    }


    // 创建后台任务
    createBackgroundJob() {
        BackgroundJob.cancelAll();
        var myJob = {
            jobKey: "myJob",
            job: () => {
                if (ws) {
                    ws.send("send webSocket");
                } else {
                    console.log("create webSocket");
                    this.createWebsocket()
                }
            }
        };
        BackgroundJob.register(myJob);
        let backgroundSchedule = {
            jobKey: "myJob",
            period: 10000,
            exact: true,                     //安排一个作业在提供的时间段内准确执行
            allowWhileIdle: true,            //允许计划作业在睡眠模式下执行
            allowExecutionInForeground: true,//允许任务在前台执行
        }
        BackgroundJob.schedule(backgroundSchedule);
    }

    // 自动连接蓝牙设备
    async autoConnectBlueTooth() {
        var connectBluetoothId = await AsyncStorage.getItem('connectBluetoothId')
        var connectBluetoothName = await AsyncStorage.getItem('connectBluetoothName')
        // console.log(connectBluetoothId)
        var isEnabled = await GMBluetooth.isEnabled()
        if (isEnabled && connectBluetoothId) {
            // console.log('自动重连打印设备')
            GMBluetooth.connect(connectBluetoothId).then(async (info) => {
                // console.log('自动连接到蓝牙设备' + connectBluetoothName)
                Alert.alert(
                    '提示',
                    '自动连接到蓝牙设备' + connectBluetoothName,
                    [
                        { text: '确定' },
                    ],
                )
            })
        }

    }

    render() {
        let { payAmount, payCount, newOrderCount } = this.state
        return (
            <View style={[styles2.container, styles.wrapper]}>
                <View style={[styles.notice, styles.center]}>
                    <Text style={styles.noticeTxt}>今日收款{payCount ? payCount : 0}笔，共计</Text>
                    <View style={[styles.noticeTxtBot]}><Text style={styles.noticeTxt}>￥</Text><Text style={styles.noticeMoney}>{payAmount ? payAmount : 0}</Text></View>
                </View>
                <View style={[styles.content, styles.center]}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.push('Order', {
                            refresh: () => {
                                this.loadData();
                            }
                        })
                    }}>
                        <View style={[styles.contentItem, styles.center]}>
                            {newOrderCount ? <Text style={styles.huizhang}>{newOrderCount}</Text> : null}
                            <Image source={require('~/img/order.png')} style={styles.contentImg}></Image>
                            <Text style={styles.contentTxt}>订单记录</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.contentItem2}></View>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.push('Setting', {})
                    }}>
                        <View style={[styles.contentItem, styles.center]}>
                            <Image source={require('~/img/setting.png')} style={styles.contentImg}></Image>
                            <Text style={styles.contentTxt}>设置与管理</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FF9900',
        // height: 1334,
        overflow: 'hidden'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notice: {
        marginTop: 120,
    },
    noticeTxt: {
        color: '#ffffff',
        lineHeight: 48,
        fontSize: 32,
    },
    noticeMoney: {
        fontSize: 68,
        color: '#fff',
        marginLeft: 8,
        lineHeight: 88
    },
    noticeTxtBot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: 20
    },
    content: {
        flexDirection: 'row',
        marginTop: 100,

    },
    contentItem: {
        width: 370,
        height: 250,
        position: 'relative'
    },
    contentItem2: {
        backgroundColor: '#fff',
        height: 250,
        width: 2,
        // borderLeftColor: '#ffffff',
        // borderLeftWidth: 2,
        // borderStyle: 'solid',
    },
    huizhang: {
        position: 'absolute',
        top: 0,
        right: 110,
        width: 48,
        height: 48,
        fontSize: 28,
        borderRadius: 24,
        color: '#FF9900',
        lineHeight: 48,
        textAlign: 'center',
        backgroundColor: '#fff',
        zIndex: 10,
    },
    contentImg: {
        width: 160,
        height: 160
    },
    contentTxt: {
        fontSize: 38,
        lineHeight: 58,
        color: '#fff',
        marginTop: 20
    },

})