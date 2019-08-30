import React from 'react'
import "pages/register/Register.less"
import { goPage, Axios, postMessage, onMessage } from 'util/util'
import { List, InputItem, Button, Toast } from 'antd-mobile';
import Constant from 'util/Constant'
export default class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            canSms: false
        }
    }
    componentDidMount() {

    }

    async sendSms() {
        if (!/^1\d{10}$/.test(this.state.phone)) {
            Toast.offline('请输入正确的手机号码', 2)
            return
        }
        if (!this.state.canSms) {
            return
        }
        this.setState({
            canSms: false
        })
        await Axios.get(`/system/login/${Constant.data.app_id}/send/${this.state.phone}`, {}, true)
        Toast.success('短信验证码已发送')
        var timing = 60
        this.timers = setInterval(() => {
            timing--
            this.setState({
                timing: timing
            })
            if (timing <= 0) {
                this.setState({
                    canSms: true
                })
                clearInterval(this.timers)
            }
        }, 1000)

    }

    componentWillUnmount() {
        this.timers && clearInterval(this.timers)
    }

    async login() {
        if (!this.state.code) {
            return
        }
        postMessage('userInfo', 'userInfo')
        onMessage('userInfo', async (data) => {
            postMessage('loginCode', 'loginCode')
            onMessage('loginCode', async (wxCode) => {
                var res = await Axios.get(`/system/login/${Constant.data.app_id}/${wxCode}/check/${this.state.phone}/${this.state.code}`, {}, true)
                console.log(res)
                Toast.success('登陆成功')
                localStorage.setItem('token', res.data.token)
                setTimeout(() => {
                    localStorage.setItem('selectTab', 'home')
                    goPage('/index')
                }, 500)
                try{let res2 = await Axios.post('thirdparty/modify/relate', data)}catch(e){}
            })
        })
    }

    render() {
        let { canSms, timing } = this.state
        return (
            <main className="register-page">
                <div className="title">你好,请登录!</div>
                <List className="form">
                    <List.Item className="form-item">
                        <InputItem
                            type="number"
                            maxLength={11}
                            placeholder="请输入手机号码"
                            onChange={(e) => {
                                let canSms = /^1\d{10}$/.test(e)
                                this.setState({
                                    phone: e,
                                    canSms: canSms
                                })
                            }}
                        >
                            <img src={require('common/img/l_phone.png')} alt="" />
                        </InputItem>
                    </List.Item>
                    <List.Item className="form-item">
                        <InputItem
                            type="number"
                            placeholder="请输入验证码"
                            maxLength={6}
                            onChange={(e) => {
                                this.setState({
                                    code: e
                                })
                            }}
                            extra={<div className={["ext", canSms ? "act" : ""].join(" ")} onClick={() => {
                                this.sendSms()
                            }}>{timing ? timing + '秒' : '获取验证码'}</div>}
                        >
                            <img src={require('common/img/l_email.png')} alt="" />
                        </InputItem>
                    </List.Item>
                </List>
                <div className="submit"><Button className="btn" activeClassName="hover" disabled={!this.state.code} onClick={() => {
                    this.login()
                }}>登 录</Button></div>
                <div className="go-register" onClick={() => {
                    goPage('/register')
                }}>账号注册&gt;</div>
            </main >
        )
    }
}