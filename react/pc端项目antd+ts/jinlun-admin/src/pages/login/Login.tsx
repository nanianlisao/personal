import * as React from 'react'
import { Layout, Row, Col, Button, Icon, message } from 'antd'
import InputCom from '../../components/input/InputCom'
import { Axios, goPage } from '../../utils/util'
import { Constant } from '../../utils/Constant'
const { Header, Content, Footer } = Layout
export interface ILoginProps {
    [propName: string]: any
}

export interface ILoginState {
    userName: string,
    passWord: string,
    appCode: number,
}


export default class Login extends React.Component<ILoginProps, ILoginState> {

    private userNameRef: InputCom | null = null
    private passWordRef: InputCom | null = null


    constructor(props: ILoginProps) {
        super(props)
        this.state = {
            userName: '',
            passWord: '',
            appCode: 0,
        }
    }


    async componentDidMount() {
        // 根据域名 查询该系统的appCode
        try {
            let res = await Axios.getIdForDomain(document.domain)
            if (res.data.appId) {
                this.setState({
                    appCode: res.data.appId
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    private login = async () => {
        // 验证用户名格式是否正确
        let reg = this.state.appCode ? /^1[0-9]{10}$/ : /^(1[0-9]{10})+@(\d)+$/
        let { userName, passWord } = this.state
        if (!reg.test(userName)) {
            message.warning('用户名格式不正确')
            return
        }
        if (passWord == "") {
            (this.passWordRef as InputCom).showErr()
            return
        }
        let phone: string | number, appCode: string | number
        if (this.state.appCode) {
            phone = userName
            appCode = this.state.appCode
        } else {
            phone = userName.split('@')[0]
            appCode = userName.split('@')[1]
        }
        try {
            let res = await Axios.post('/system/login', {
                "password": passWord,
                "phone": phone,
                "appCode": appCode,
            }, true)
            message.success('登录成功')
            // 将token、appCode和用户信息存入localStorage
            Constant.setLocalStorage("token", res.data.token)
            Constant.setLocalStorage('appCode', appCode)
            Constant.setLocalStorage('user', JSON.stringify(res.data.user))
            goPage('/main/panel/panel')
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <Layout style={{
                height: '100%',
                background: `url(${require('@assets/img/bg1.jpg')}) center center no-repeat`
            }}>
                <Header style={{ background: 'none', borderBottom: '1px solid #eee' }}>
                    <Row type="flex" justify="space-between">
                        <Col>
                            <img src={require('@assets/img/index-logo.png')} alt="" width='192' />
                        </Col>
                    </Row>
                </Header>
                <Content>
                    <div className='pos-center' style={{
                        padding: '40px 60px',
                        background: 'linear-gradient(80deg,rgba(53,57,74,0),#000)',
                        borderRadius: '20px'
                    }}>
                        <InputCom
                            ref={ele => { this.userNameRef = ele }}
                            titleWidth="50px"
                            inputWidth="300px"
                            placeholder="请输入用户名"
                            regex={this.state.appCode ? /^1[0-9]{10}$/ : /^(1[0-9]{10})+@(\d)+$/}
                            errMsg="用户名不合法"
                            onChange={(val: string) => {
                                this.setState({
                                    userName: val
                                })
                            }}
                            title={<Icon type='user' style={{ fontSize: '18px', color: '#ccc' }} />}
                        />
                        <InputCom
                            ref={ele => { this.passWordRef = ele }}
                            titleWidth="50px"
                            inputWidth="300px"
                            validate={true}
                            placeholder="请输入密码"
                            errMsg="密码不能为空"
                            type="password"
                            onChange={(val: string) => {
                                this.setState({
                                    passWord: val
                                })
                            }}
                            title={<Icon type='lock' style={{ fontSize: '18px', color: '#ccc' }} />}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <Button type="primary" onClick={this.login}>登录</Button> <Button>取消</Button>
                        </div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', background: 'transparent', color: '#fff' }}>©南京数说智能科技有限公司 <a href="http://www.miitbeian.gov.cn" rel="noopener noreferrer" target="_blank">苏ICP备14037308号-5</a></Footer>
            </Layout>
        )
    }
}
