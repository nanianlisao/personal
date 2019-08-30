import React from "react";
import styles2, { px } from "~/common/style";
import { StatusBar, BackHandler, Dimensions, TouchableOpacity, AsyncStorage, View, Text, Image, StyleSheet, TextInput, FlatList, Alert, ScrollView } from "react-native";
import { Axios, print } from '~/util/util'
import { scale } from '~/common/style'
import GMBluetooth from 'react-native-gm-bluetooth';
const { ESC } = GMBluetooth;
import { Header } from 'react-navigation';
export default class Home extends React.Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
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
        };
    };
    constructor(props) {
        super(props)
        this.state = {
            orderList: [],
            refreshing: false,
            pageSize: 10,
            page: 1,
            searchVal: '',
            tradeNo: '',
            phone: ''
        }
    }

    async componentWillUnmount() {
        this.backHandler.remove();
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
            var refresh = this.props.navigation.getParam('refresh')
            // console.log(refresh)
            if (refresh) {
                refresh()
            }
            // this.goBack(); // works best when the goBack is async
            this.props.navigation.goBack()
        });
        var timestamp = Date.now()
        await AsyncStorage.setItem('timestamp', String(timestamp))
        this.getOrderList()
    }

    async getOrderList() {
        let { pageSize, phone, tradeNo } = this.state
        try {
            let res = await Axios.get(this, '/pay/list/app', {
                startIndex: (this.state.page - 1) * pageSize,
                pageSize: pageSize,
                phone: phone,
                tradeNo: tradeNo
            })
            console.log(res)
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
            this.setState({
                orderList: [...this.state.orderList, ...data],
                refreshing: false,
                isLoading: false,
                finish: true, allPage
            })
            // console.log(data)
        } catch (e) {
            // console.log(e)
        }
    }

    // 退款
    async refund(id) {
        try {
            let res = await Axios.post(this, `/refund/consume/refund/${id}`)
            console.log(res)
            Alert.alert('提示', res.data.resultMsg, [{ text: '确定',onPress:()=>{
                console.log('加载订单')
                this.state.page = 1
                this.state.orderList = []
                this.getOrderList()
            } }])
        } catch (e) {
            Alert.alert('提示', '网络请求失败', [{ text: '确定' }])
        }

    }


    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.dataItem} key={index}>
                <View style={[styles.center, styles.dataTop]}>
                    <View style={[styles.center, styles.avatar]}>
                        <Image
                            source={(item.type == 1 || item.type == 2) ? require('~/img/wxpay.png') : require('~/img/alipay.png')}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.infoTxt}>交易单号：{item.id}</Text>
                        <Text style={styles.infoTxt}>{item.phone}</Text>
                        <Text style={styles.dateTxt}>{item.addTime}</Text>
                    </View>
                    <View style={styles.orderStatus}>
                        <Text style={styles.money}>+{item.actualPayment}</Text>
                        {item.state == 2 && item.refundPrice == 0 ? <Text style={[styles.status]}>交易成功</Text> : null}
                        {item.state == 2 && item.refundPrice > 0 && item.refundPrice == item.actualPayment ? <Text style={[styles.status, styles.fail]}>退款成功</Text> : null}
                        {item.state == 2 && item.refundPrice > 0 && item.refundPrice < item.actualPayment ? <Text style={[styles.status, styles.fail]}>部分退款</Text> : null}
                        {item.state == 1 ? <Text style={[styles.status, styles.nopay]}>未支付</Text> : null}
                        {item.state == -1 ? <Text style={[styles.status, styles.nopay]}>支付超时</Text> : null}
                    </View>
                </View>
                {item.state == 2 ? <View style={styles.moving}>
                    {item.refundPrice < item.actualPayment ? <Text style={styles.moveItem} onPress={() => {
                        this.refund(item.id)
                    }}>退款</Text> : null} 
                    <Text style={styles.moveItem} onPress={() => {
                        this.handlePrint(item)
                    }}>补打小票</Text>
                </View> : <View></View>}
            </View>
        )
    }

    // 打印小票
    handlePrint(item) {
        // console.log(item)
        GMBluetooth.isConnected().then(isConnected => {
            if (isConnected) {
                print({
                    storesName: item.storesVo.name,
                    payId: item.id,
                    typeDesc: (item.type == 2 || item.type == 1) ? '微信支付' : '支付宝支付',
                    totalFee: item.actualPayment,
                    createTimeEnd: item.createTimeEnd,
                })
                // console.log('已连接');
            } else {
                Alert.alert(
                    '提示',
                    '未连接到打印机设备',
                    [
                        { text: '取消' },
                        { text: '去连接', onPress: () => this.props.navigation.push("Setting"), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            }
        });

    }



    // 触底加载更多
    onEndReached = (event) => {
        // console.log('onEndReached')
        if (this.state.isLoading || this.state.allPage === this.state.page) {
            return;
        }
        this.setState({
            refreshing: true
        })
        this.state.isLoading = true
        this.state.page++
        this.getOrderList()
    }
    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
        })
        this.state.orderList = []
        this.state.page = 1
        this.getOrderList()
    }

    render() {
        var winHeight = Dimensions.get("window").height;
        var headHeight = Header.HEIGHT
        var listHeight = winHeight - headHeight - px(80) - StatusBar.currentHeight
        return (
            // <ScrollView style={{ height: Dimensions.get("window").height }}>
            <View style={[
                // styles2.container,
                styles.wrapper]}>
                <View style={[styles.center, styles.header]}>
                    <TextInput
                        style={styles.TextInput}
                        editable={true}
                        value={this.state.searchVal}
                        onChangeText={(val) => {
                            this.setState({
                                searchVal: val
                            })
                        }}
                        keyboardType="number-pad"
                        placeholder="输入手机号/订单号查询"
                        underlineColorAndroid="transparent"
                    />
                    <Text style={styles.headerTxt} onPress={() => {
                        if (this.state.searchVal.length == 0) {
                            this.state.phone = ''
                            this.state.tradeNo = ''
                        } else if (this.state.searchVal.length == 11) {
                            this.state.phone = this.state.searchVal
                            this.state.tradeNo = ''
                        } else {
                            this.state.tradeNo = this.state.searchVal
                            this.state.phone = ''
                        }
                        this.setState({
                            refreshing: true,
                            orderList: []
                        })
                        this.state.page = 1
                        this.getOrderList()
                    }}>搜索</Text>
                </View>
                <View style={{ height: listHeight }}>
                    {this.state.orderList.length > 0 ? <FlatList
                        data={this.state.orderList}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.onEndReached}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    /> : <View style={[styles.center, { height: 300 }]}>
                            <Image
                                source={require('~/img/null3.png')}
                                style={{ width: 60, height: 60 }}
                            />
                            <Text style={{ marginTop: px(30) }}>暂无订单记录</Text>
                        </View>}
                </View>
            </View>
            //  </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: px(700),
        height: px(60),
        marginTop: px(20),
        backgroundColor: '#f2f2f2',
        borderRadius: px(30),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    TextInput: {
        paddingVertical: 0,
        width: px(500),
        height: px(50),
        lineHeight: px(50),
        fontSize: px(24),
        paddingLeft: px(20),
        backgroundColor: '#fff',
        marginLeft: px(40)
    },
    headerTxt: {
        marginLeft: px(20),
        textAlign: 'center',
        flex: 1,
        color: '#16B3E2',
        fontSize: px(28),
        lineHeight: px(60)
    },

    dataItem: {
        width: px(702),
        borderBottomColor: '#ccc',
        borderBottomWidth: px(2),
        borderStyle: 'solid',
        paddingTop: px(20),
        paddingBottom: px(20),
    },
    dataTop: {
        flexDirection: 'row'
    },
    avatar: {
        width: px(120),
        height: px(120),
    },
    info: {
        marginLeft: px(20),
        flex: 1,
    },
    infoTxt: {
        fontSize: px(28),
        lineHeight: px(48),
        color: '#333'
    },
    dateTxt: {
        fontSize: px(24),
        color: '#666'
    },
    orderStatus: {
        width: px(160),
    },
    money: {
        fontSize: px(38),
        color: '#333',
        lineHeight: px(68),
        textAlign: 'right'
    },
    status: {
        fontSize: px(24),
        color: '#333',
        textAlign: 'right'
    },
    fail: {
        color: '#f00'
    },
    nopay: {
        color: '#999'
    },
    moving: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: px(20)
    },
    moveItem: {
        width: px(140),
        height: px(64),
        lineHeight: px(64),
        textAlign: 'center',
        fontSize: px(30),
        color: '#FF9900',
        borderRadius: px(10),
        borderColor: '#FF9900',
        borderWidth: px(2),
        borderStyle: 'solid',
        marginLeft: px(20),
        marginRight: px(20)

    }
})