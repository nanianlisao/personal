import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import Constant from 'util/Constant'
import { parseQueryString } from 'util/util'
import { Router } from 'react-router-dom';
// import { createStore } from 'redux'
import { Provider } from 'react-redux'
// import 'antd-mobile/dist/antd-mobile.css';
import myEE from 'util/eventEmitter';
import './index.css';
import 'common/rem.js'
import { Toast } from 'antd-mobile';
import store from './reducers/index'
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import { LocaleProvider } from 'antd'
// import App from './App';
import * as serviceWorker from './serviceWorker';
import RouteMap from './router/routerMap'

// const store = createStore(appReducer)
class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        localStorage.clear();
        localStorage.setItem('selectedTab', 'home')
        var options = parseQueryString(window.location.href)
        if (options.token) {
            localStorage.setItem('token', options.token)
        }
        // 通过url传递phone
        if(options.phone){
            Constant.user_id.phone = options.phone
        }
        // 通过url传递appId
        if(options.appId){
            Constant.data.app_id = options.appId
        }
        window.wx.miniProgram.getEnv((res) => {
            if (res.miniprogram) {
                var options = parseQueryString(window.location.href)
                let token = options.token
                window.env = 'wx'
                window.ws = null
                this.createWxSocket(token) // 创建全局socket，和微信小程序通信
            }
        })
        if (window.my) {
            window.env = 'ali'
            window.my.postMessage({ type: 'init' })
            window.my.onMessage = (e) => {
                if (e.init) { // 建立通信 初始化数据
                    localStorage.clear()
                    Constant.data.app_id = e.appId
                    localStorage.setItem('selectedTab', 'home')
                } else if (e.userInfo) {
                    Constant.data.userInfo = JSON.stringify(e.userInfo)
                } else {
                    myEE.emit(e.key, e.data);
                }
            }
        }
    }

    createWxSocket(token) {
        let type = 2
        let url = `${Constant.getWsWork()}/webSocket/bothway/${token}/${type}`
        window.ws = new WebSocket(url);
        console.log(window.ws)
        window.ws.onopen = (e) => {
            window.ws.send(JSON.stringify({
                type: '1',
                token: localStorage.getItem('token'),
                data: {
                    type: 'init'
                }
            }))
            var taskArr = Constant.data.taskArr
            if (taskArr.length > 0) {
                taskArr.map((x) => {
                    window.ws.send(JSON.stringify({
                        type: '1',
                        token: localStorage.getItem('token'),
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
            Toast.loading('重新连接会话',1)
            setTimeout(() => {
                clearInterval(this.socketTimer)
                this.createWxSocket(token)
            }, 1000);
        }

        window.ws.onmessage = (e) => {
            let data = JSON.parse(e.data)
            if (data.key == 'init') {
                Constant.user_id.phone = data.data.phone
                Constant.data.userInfo = JSON.stringify(data.data.userInfo)
                Constant.data.app_id = data.data.appId
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


ReactDOM.render(
    // <LocaleProvider locale={zhCN}>
    <Provider store={store}>
        <Index />
    </Provider>

    // </LocaleProvider>
    , document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
