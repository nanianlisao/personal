import React from "react";
import styles2, { px } from "~/common/style";
import { AsyncStorage, Alert } from 'react-native';
import { resetNavigation, Axios } from '~/util/util'
import Constant from '~/util/Constant'
import { TouchableHighlight, View, Text, Image, StyleSheet, TextInput } from "react-native";
import BackgroundJob from 'react-native-background-job';  // 后台任务

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            password: '',
            phone: ''
        }
    }
    componentWillMount() {
        BackgroundJob.cancelAll();
    }

    // 登录
    async login() {
        try {
            let res = await Axios.post(this, '/system/login/app', {
                appCode: Constant.data.app_id,
                password: this.state.password,
                phone: this.state.phone
            })
            console.log(res)
            await AsyncStorage.setItem('token', res.data.token)
            await AsyncStorage.setItem('appName', res.data.user.appName)
            await AsyncStorage.setItem('storesCashierName', res.data.user.storesCashierName)
            await AsyncStorage.setItem('storesName', res.data.user.storesName)
            this.props.navigation.dispatch(resetNavigation(0, 'Home', { shopName: res.data.user.appName }))
        } catch (e) {
            console.log(e)
            Alert.alert('提示', '登录失败', [{ text: '确定' }])
        }

        //  this.props.navigation.replace("Home") 
    }

    render() {
        return (
            <View style={[
                // styles2.container,
                styles.wrapper]}>
                <View style={[styles.center, styles.top]}>
                    <Image
                        source={require('~/img/0.jpg')}
                        style={{ width: px(140), height: px(140), }}
                    />
                </View>
                <View style={[styles.userName,]}>
                    <Text style={styles.remakeInput}>账号:</Text>
                    <TextInput
                        style={styles.TextInput}
                        editable={true}
                        onChangeText={(val) => {
                            this.setState({
                                phone: val
                            })
                        }}
                        value={this.state.phone}
                        keyboardType="number-pad"
                        placeholder="请输入手机号"
                        underlineColorAndroid="transparent"
                        maxLength={800}
                    />

                </View>
                <View style={[styles.userName,]}>
                    <Text style={styles.remakeInput}>密码:</Text>
                    <TextInput
                        style={styles.TextInput}
                        editable={true}
                        onChangeText={(val) => {
                            this.setState({
                                password: val
                            })
                        }}
                        value={this.state.password}
                        secureTextEntry={true}
                        placeholder="请输入登录密码"
                        underlineColorAndroid="transparent"
                        type="password"
                    />
                </View>
                <View style={styles.buttonBox}>
                    <TouchableHighlight onPress={() => {
                        this.login()
                    }}>
                        <Text style={styles.loginButton}>登录</Text>
                    </TouchableHighlight>
                </View>
                <View><Text style={styles.remark}>仅限收银账号登录</Text></View>
            </View>
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
    top: {
        marginTop: px(200)
    },
    userName: {
        width: px(660),
        height: px(100),
        lineHeight: px(100),
        marginTop: px(20),
        borderBottomWidth: px(1),
        borderBottomColor: '#ccc',
        borderStyle: 'solid',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        fontSize: px(40),
        color: '#333333'
    },
    remakeInput: {
        fontSize: px(40),
        marginRight: px(94)
    },
    TextInput: {
        paddingVertical: 0,
        width: px(470),
        lineHeight: px(80),
        fontSize: px(40),
    },
    buttonBox: {
        marginTop: px(90),
        width: px(660),
    },
    loginButton: {
        fontSize: px(40),
        height: px(102),
        lineHeight: px(102),
        color: '#f2f2f2',
        backgroundColor: "#E64322",
        textAlign: 'center'
    },
    remark: {
        marginTop: px(40),
        lineHeight: px(48),
        textAlign: 'center',
        color: '#4D6990',
        fontSize: px(32)
    }
})