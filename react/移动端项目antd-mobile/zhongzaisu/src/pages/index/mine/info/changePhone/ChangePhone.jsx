import React from 'react'
import { withRouter } from 'react-router-dom';
import './ChangePhone.less'
import { goPage, Axios, parseQueryString,checkPhone } from 'util/util'
import { InputItem, Button, Picker, Modal, Toast } from 'antd-mobile';
import Constant from 'util/Constant'
let alert = Modal.alert
class ChangePhone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timing: '',
            showInput: false,
            phone: '',
            code: ''
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.setState({
            phone: options.phone ? options.phone : ''
        })
    }

    // 发送短信验证码
    async sendSms() {
        if (checkPhone(this.state.phone)) {
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
            let res = await Axios.get(`/system/${Constant.data.app_id}/check/${this.state.phone}/${this.state.code}`, {}, true)
            goPage(`/mine/myInfo/change?phone=${this.state.phone}`)
        }
    }

    render() {
        let { timing, showInput, phone, code } = this.state
        return (
            <main className="changePhone-page">
                <div className="top">
                    <img src={require('common/img/phone_1.png')} alt="" />
                </div>
                {showInput ? <div className="remark">
                    <div>请验证你的手机号以进行下一步操作</div>
                    <div>{phone}</div>
                </div> : <div className="remark">
                        <div>当前绑定手机号为 {phone}</div>
                        <div>如果你的手机号已不用，请及时更换。</div>
                    </div>}
                {showInput ? <div className="get-input">
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
                </div> : ""}

                {showInput ? <Button className="submit-btn" onClick={() => {
                    this.checkSms()
                }}>下一步</Button> : <Button className="submit-btn" onClick={() => {
                    this.setState({
                        showInput: true
                    })
                }}>更换手机号</Button>}
            </main>
        )
    }

}

export default withRouter(ChangePhone)