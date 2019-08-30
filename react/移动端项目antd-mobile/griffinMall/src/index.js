import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill'
import { createBrowserHistory } from "history";
import Constant from 'util/Constant'
import { parseQueryString } from 'util/util'
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux'
// import 'antd-mobile/dist/antd-mobile.css';
import myEE from 'util/eventEmitter';
import './index.css';
import './common.css';
import 'common/rem.js'
import { Toast } from 'antd-mobile';
import store from './reducers'
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import { LocaleProvider } from 'antd'
// import App from './App';
import * as serviceWorker from './serviceWorker';
import RouteMap from './router/routerMap'
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        // localStorage.setItem('token', '6ec71ca56d9ed6b47693b590158aaf97')
        // localStorage.setItem('token', '5644a172989a2eb634d3d8b005251e18')

        localStorage.clear()
        localStorage.setItem('selectedTab', 'home')

        var options = parseQueryString(window.location.href)
        // options.appId = 103
        // options.token = '54bd7070f5705877e28e7adb09ccb24a'
        if (options.appId) {
            Constant.data.appId = options.appId
        }
        if (options.token) {
            localStorage.setItem('token', options.token)
        }
        if (options.storesId) {
            Constant.data.storesId = options.storesId  // 分享商品进入时 店铺id会带上
        }
        Constant.user_id.userId = options.userId                         // 分享商品时需要带userId 通过url带过来
        if (options.sharedUserId) {                                        // 如果携带分享者userId 设为全局的分享者
            Constant.data.sharedUserId = options.sharedUserId
        }
        var ua = window.navigator.userAgent.toLowerCase(); //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            window.env = 'wx'
            window.ws = null
            this.createWxSocket() // 创建全局socket，和微信小程序通信
        }
        // window.wx.miniProgram.getEnv((res) => {
        //     console.log(window.wx)
        //     if (res.miniprogram) {
        //         window.env = 'wx'
        //         window.ws = null
        //         this.createWxSocket() // 创建全局socket，和微信小程序通信
        //     }
        // })
        if (window.my) {
            window.env = 'ali'
            window.my.postMessage({ type: 'init' })
            window.my.onMessage = (e) => {
                if (e.init) { // 建立通信 初始化数据
                    localStorage.clear()
                    Constant.data.appId = e.appId
                    localStorage.setItem('selectedTab', 'home')
                } else if (e.userInfo) {
                    Constant.data.userInfo = JSON.stringify(e.userInfo)
                } else {
                    myEE.emit(e.key, e.data);
                }
            }
        }
    }


    createWxSocket() {
        var token = localStorage.getItem('token')
        var appId = Constant.data.appId
        let type = 2
        let url = `${Constant.getWsWork()}/webSocket/bothway/${token}/${type}`
        window.ws = new WebSocket(url);
        window.ws.onopen = (e) => {
            window.ws.send(JSON.stringify({
                type: '1',
                appId: appId,
                token: token,
                data: {
                    type: 'init'
                }
            }))
            var taskArr = Constant.data.taskArr
            if (taskArr.length > 0) {
                console.log(taskArr)
                taskArr.forEach((x) => {
                    window.ws.send(JSON.stringify({
                        type: '1',
                        token: token,
                        data: {
                            type: x.type,
                            key: x.key,
                        }
                    }))
                })
                taskArr = []
            }
        }

        this.socketTimer = setInterval(() => {
            window.ws.send('socket')
        }, 30000)




        window.ws.onclose = (e) => {
            Toast.loading('重新连接会话', 1)
            setTimeout(() => {
                clearInterval(this.socketTimer)
                this.createWxSocket()
            }, 1000);
            // var r = window.confirm("正在重新连接会话")
            // if (r) {
            //     clearInterval(this.socketTimer)
            //     this.createWxSocket()
            // } else {
            //     clearInterval(this.socketTimer)
            //     this.createWxSocket()
            // }
            console.log("close");
        }

        window.ws.onmessage = (e) => {
            let data = JSON.parse(e.data)
            if (data.key === 'init') {
                Constant.user_id.phone = data.data.phone
                Constant.data.scopeUserInfo = data.data.scopeUserInfo
                Constant.data.appId = data.data.appId
            } else {
                myEE.emit(data.key, data.data);
            }
        }

    }


    componentWillUnmount() {
        // localStorage.clear()
        if (window.ws) {
            window.ws.close()
        }
    }

    render() {
        let history = createBrowserHistory();
        return (
            <Router history={history}>
                <RouteMap />
            </Router>
        )
    }
}

class PotentialError extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
    }
    componentDidCatch(error, info) {
        this.setState({ error, info });
    }
    render() {
        if (this.state.error) {
            return <h1>Error: {this.state.error.toString()}</h1>;
        }
        return this.props.children;
    }
}


ReactDOM.render(
    <PotentialError>
        <Provider store={store} >
            <Index />
        </Provider>
    </PotentialError>

    , document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
