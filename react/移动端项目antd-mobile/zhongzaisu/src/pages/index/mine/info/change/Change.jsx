import React from 'react'
import { withRouter } from 'react-router-dom';
import '../changePhone/ChangePhone.less'
import { goPage, Axios, parseQueryString,checkPhone } from 'util/util'
import { InputItem, Button, Picker, Modal, Toast } from 'antd-mobile';
import Constant from 'util/Constant'
let alert = Modal.alert
class Change extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timing: '',
            phone: '',
            code: ''
        }
    }
    componentWillMount() {
        // var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        // this.setState({
        //     phone: options.phone ? options.phone : ''
        // })
    }

    // 发送短信验证码
    async sendSms() {
        if(checkPhone(this.state.phone)){
            await Axios.post(`/system/${Constant.data.app_id}/send/${this.state.phone}`, {}, true)
            Toast.success('短信验证码已发送',1)
            var timing = 60
            this.timers = setInterval(() => {
                timing--
                this.setState({
                    timing: timing
                })
                if (timing <= 0) {
                    clearInterval(this.timers)
                }
            }, 1000)
        }
       
    }

    // 验证短信验证码
    async checkSms() {
        if (this.state.code) {
            let res = await Axios.get(`/user/modify/phone/${this.state.phone}/${this.state.code}`, {}, true)
            Toast.success('修改手机号码成功',0.5)
            setTimeout(()=>{
                localStorage.setItem('selectedTab','mine')
                goPage('/index')
            },500)
        }
    }

    render() {
        let { timing, showInput, phone, code } = this.state
        return (
            <main className="changePhone-page">
                <div className="top">
                    <img src={require('common/img/phone_1.png')} alt="" />
                </div>
                <div className="remark">
                    <div>更换手机号成功后</div>
                    <div>原手机号将不能用于此账号的登陆</div>
                </div>
                <div className="get-input">
                    <InputItem
                        type="number"
                        placeholder="请输入新手机号"
                        maxLength={11}
                        onChange={(e) => {
                            this.setState({
                                phone: e
                            })
                        }}
                    >
                    </InputItem>
                </div>
                <div className="get-input">
                    <InputItem
                        type="number"
                        placeholder="请输入验证码"
                        maxLength={6}
                        onChange={(e) => {
                            this.setState({
                                code: e
                            })
                        }}
                    >
                    </InputItem>
                    <div className="ext act" onClick={() => {
                        this.sendSms()
                    }}>{timing ? timing + '秒' : '获取验证码'}</div>
                </div>

                <Button className="submit-btn" onClick={() => {
                    this.checkSms()
                }}>确定更换</Button>
            </main>
        )
    }

}

export default withRouter(Change)