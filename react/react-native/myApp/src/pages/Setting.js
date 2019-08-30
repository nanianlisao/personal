import React from "react";
import styles2, { scale } from "~/common/style";
import { resetNavigation } from '~/util/util'
import { AppState, TouchableOpacity, View, Text, Image, StyleSheet, TextInput, Switch, ScrollView, Alert, AsyncStorage } from "react-native";
import GMBluetooth from 'react-native-gm-bluetooth';
const { ESC } = GMBluetooth;
export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appName: '',
            storesCashierName:'',
            storesName:'',
            SwitchVal: false,   // 语音播报开关
            SwitchValBluetooth: false,  // 蓝牙连接开关
            connectBluetoothId: null,
            connectBluetoothName: '',
            deviceList: [],
            bluetoothStatus: '已连接'
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    async componentDidMount() {
        var storesName = await AsyncStorage.getItem('storesName')
        var appName = await AsyncStorage.getItem('appName')
        var storesCashierName = await AsyncStorage.getItem('storesCashierName')
        this.setState({
            storesName: storesName,
            appName: appName,
            storesCashierName:storesCashierName
        })
        AppState.addEventListener('change', this._handleAppStateChange);
        // 判断是否连接上蓝牙设备
        GMBluetooth.isConnected().then(async (isConnected) => {

            // console.log('判断是否重连上打印机' + isConnected)
            if (isConnected) {
                var connectBluetoothId = await AsyncStorage.getItem('connectBluetoothId')
                var connectBluetoothName = await AsyncStorage.getItem('connectBluetoothName')
                if (connectBluetoothId) {
                    // console.log(connectBluetoothId)
                    this.setState({
                        connectBluetoothName, connectBluetoothId
                    })
                }
            }
        })
        GMBluetooth.on('bluetoothDisabled', async () => {  // 蓝牙关闭
            this.setState({
                SwitchValBluetooth: false
            })
            await AsyncStorage.setItem('SwitchValBluetooth', '0')
        });
        this.initStates()   // 初始化语音播报开关 蓝牙连接开关等
    }

    // 切换app当前状态
    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active') { // 切换到前台 进行一次蓝牙检测
            var isEnabled = await GMBluetooth.isEnabled()
            if (!isEnabled) {
                this.setState({
                    SwitchValBluetooth: false
                })
                await AsyncStorage.setItem('SwitchValBluetooth', '0')
            }
        }
    }

    // 初始化语音播报开关 蓝牙连接开关等
    async initStates() {
        var SwitchVal = await AsyncStorage.getItem('SwitchVal')
        var SwitchValBluetooth = await AsyncStorage.getItem('SwitchValBluetooth')
        var isEnabled = await GMBluetooth.isEnabled()   // 判断蓝牙是否可用
        if (!isEnabled) {   // 蓝牙未开启 
            SwitchValBluetooth = '0'
        }
        this.setState({
            SwitchVal: SwitchVal === '1' ? true : false,
            SwitchValBluetooth: SwitchValBluetooth === '1' ? true : false
        })
        if (SwitchValBluetooth === '1') {
            this.getDeviceList()
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerRight: (
                <Text
                    style={{
                        fontSize: 16,
                        paddingRight: 20,
                        color: '#fff'
                    }}
                    onPress={async () => {
                        await AsyncStorage.clear()
                        var isConnected = await GMBluetooth.isConnected() // 如果蓝牙连接着 就断开连接
                        if (isConnected) {
                            GMBluetooth.disconnect()
                        }
                        navigation.dispatch(resetNavigation(0, 'Login', { params: {} }))
                    }}
                >切换账号</Text>
            ),
            headerLeft: <TouchableOpacity onPress={() => {
                if (params && params.refresh) {
                    params.refresh()
                }
                navigation.goBack()
            }}>
                <View style={{ padding: 10, marginLeft: 10 }}>
                    <Image
                        source={require('~/img/return.png')}
                        style={{ width: 20, height: 20 }}
                    />
                </View>
            </TouchableOpacity>,
        }
    }

    // 连接蓝牙设备
    handleConnect(item) {
        if (item.id == this.state.connectBluetoothId) return
        this.setState({
            bluetoothStatus: <Text><Image source={require('~/img/loading.gif')}></Image> 连接中</Text>,
            connectBluetoothId: item.id,
            connectBluetoothName: item.name
        })
        GMBluetooth.connect(item.id).then(async (info) => {
            this.setState({
                bluetoothStatus: '已连接',
            })
            await AsyncStorage.setItem('connectBluetoothId', item.id)
            await AsyncStorage.setItem('connectBluetoothName', item.name)
        }).catch(async () => {
            Alert.alert(
                '提示',
                '无法连接到该设备',
                [
                    { text: '确定' },
                ],
            )
            this.setState({
                connectBluetoothId: null,
            });
            await AsyncStorage.removeItem('connectBluetoothId')
        });
    }

    // 查找蓝牙设备列表
    getDeviceList() {
        // 列出已配对的设备列表
        GMBluetooth.list().then(deviceList => {
            this.setState({
                deviceList
            });
        });
    }

    render() {
        return (
            <View style={[styles2.container, styles.wrapper]}>
                <View style={[styles.center, styles.top]}>
                    <View style={[styles.center, styles.topItem]}>
                        <Text style={[styles.topTxt, styles.topKey]}>小程序名称</Text>
                        <Text style={styles.topTxt}>{this.state.appName}</Text>
                    </View>
                    <View style={[styles.center, styles.topItem]}>
                        <Text style={[styles.topTxt, styles.topKey]}>门店名</Text>
                        <Text style={styles.topTxt}>{this.state.storesName}</Text>
                    </View>
                    <View style={[styles.center, styles.topItem]}>
                        <Text style={[styles.topTxt, styles.topKey]}>桌台名</Text>
                        <Text style={styles.topTxt}>{this.state.storesCashierName}</Text>
                    </View>
                </View>
                <View style={[styles.content]}>
                    <View style={[styles.sound, styles.soundSpe]}>
                        <Text style={styles.contentTxt}>语音播报</Text>
                        <Switch
                            style={styles.switch}
                            trackColor="#FF9900"
                            ios_backgroundColor="#FF9900"
                            // thumbTintColor='#fff'
                            value={this.state.SwitchVal}
                            onValueChange={async (e) => {
                                this.setState({
                                    SwitchVal: e
                                })
                                await AsyncStorage.setItem('SwitchVal', e ? '1' : '0')
                            }}
                        />
                    </View>
                    <View style={[styles.sound, styles.bluetooth]}>
                        <Text style={styles.contentTxt}>蓝牙连接</Text>
                        <Switch
                            style={styles.switch}
                            trackColor="#FF9900"
                            ios_backgroundColor="#FF9900"
                            // thumbTintColor='#fff'
                            value={this.state.SwitchValBluetooth}
                            onValueChange={async (e) => {
                                if (e) {  // 开启连接查找蓝牙列表
                                    var isEnabled = await GMBluetooth.isEnabled()
                                    if (!isEnabled) { // 如果蓝牙未开启
                                        Alert.alert(
                                            '提示',
                                            '你的设备未开启蓝牙，请开启后再试',
                                            [
                                                { text: '确定' },
                                            ],
                                            { cancelable: false }
                                        )
                                        this.setState({
                                            SwitchValBluetooth: false
                                        })
                                        await AsyncStorage.setItem('SwitchValBluetooth', '0')
                                        return
                                    }
                                    this.getDeviceList()
                                } else {
                                    var isConnected = await GMBluetooth.isConnected() // 如果蓝牙连接着 就断开连接
                                    if (isConnected) {
                                        GMBluetooth.disconnect()
                                    }
                                    await AsyncStorage.removeItem('connectBluetoothId')
                                    this.setState({
                                        connectBluetoothId: null
                                    })
                                }
                                this.setState({
                                    SwitchValBluetooth: e
                                })
                                await AsyncStorage.setItem('SwitchValBluetooth', e ? '1' : '0')

                            }}
                        />
                        {/* <Text style={styles.device}>{this.state.connectBluetoothId ? this.state.connectBluetoothName : '请选择打印机设备'}</Text> */}
                    </View>
                    {this.state.SwitchValBluetooth ? <ScrollView style={styles.deviceList}>
                        {this.state.deviceList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        this.handleConnect(item)
                                    }}>
                                    <View style={[styles.sound, styles.deviceItem]} >
                                        <Text style={styles.deviceName}>{item.name}</Text>
                                        <Text style={styles.deviceStatus}>{this.state.connectBluetoothId == item.id ? this.state.bluetoothStatus : ''}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView> : <View></View>}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#f2f2f2'
        // display: 'flex',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // height: 1334,
        // overflow: 'hidden'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    top: {
        backgroundColor: '#FF9900',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
    },
    topItem: {
        width: 720,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    topTxt: {
        color: '#ffffff',
        fontSize: 40,
        lineHeight: 80
    },
    topKey: {
        width: 260
    },
    content: {
        paddingLeft: 20,
        paddingRight: 20
    },
    soundSpe: {
        borderBottomColor: '#333',
        borderBottomWidth: 2,
        borderStyle: 'solid',
        height: 140,
    },
    sound: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
    },
    contentTxt: {
        fontSize: 40,
        color: '#333',
        lineHeight: 80
    },
    switch: {
        transform: [{ scale: 1 / scale }]
    },
    bluetooth: {
        marginTop: 20,
    },
    device: {
        fontSize: 36,
        color: '#666',
        lineHeight: 80
    },
    deviceList: {
        height: 500
    },
    deviceItem: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        borderStyle: 'solid',
    },
    deviceName: {
        fontSize: 36,
        color: '#333',
        lineHeight: 80
    },
    deviceStatus: {
        fontSize: 36,
        color: '#666',
        lineHeight: 80
    },



    // headerTxt: {
    //     color: '#ffffff',
    //     fontSize: 48,
    //     lineHeight: 80
    // },
    // notice: {
    //     marginTop: 40,
    // },
    // noticeTxt: {
    //     color: '#ffffff',
    //     lineHeight: 48,
    //     fontSize: 32,
    // },
    // noticeMoney: {
    //     fontSize: 68,
    //     color: '#fff',
    //     marginLeft: 8,
    //     lineHeight: 88
    // },
    // noticeTxtBot: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'flex-start',
    //     flexDirection: 'row',
    //     marginTop: 20
    // },
    // content: {
    //     flexDirection: 'row',
    //     marginTop: 100,

    // },
    // contentItem: {
    //     width: 370,
    //     height: 250,
    //     position: 'relative'
    // },
    // contentItem2: {
    //     borderLeftColor: '#ffffff',
    //     borderLeftWidth: 2,
    //     borderStyle: 'solid',
    // },
    // huizhang: {
    //     position: 'absolute',
    //     top: 0,
    //     right: 110,
    //     width: 48,
    //     height: 48,
    //     fontSize: 28,
    //     borderRadius: 24,
    //     color: '#FF9900',
    //     lineHeight: 48,
    //     textAlign: 'center',
    //     backgroundColor: '#fff',
    //     zIndex: 10,
    // },
    // contentImg: {
    //     width: 160,
    //     height: 160
    // },
    // contentTxt: {
    //     fontSize: 38,
    //     lineHeight: 58,
    //     color: '#fff',
    //     marginTop: 20
    // },

})