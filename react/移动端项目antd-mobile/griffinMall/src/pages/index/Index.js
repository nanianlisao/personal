import React from 'react'
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { parseQueryString, goPage, postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant'
import Home from 'pages/index/home/Home'
import Cart from 'pages/index/cart/Cart'
import Mine from 'pages/index/mine/Mine'
const TabBars = [{
    title: '首页',
    key: 'home',
    icon: require('common/img/tab_home.png'),
    selectedIcon: require('common/img/tab_home_ac.png'),
    component: <div><Home /></div>
}, {
    title: '购物车',
    key: 'cart',
    icon: require('common/img/tab_cart.png'),
    selectedIcon: require('common/img/tab_cart_ac.png'),
    component: <div><Cart /></div>
}, {
    title: '我的',
    key: 'mine',
    icon: require('common/img/tab_mine.png'),
    selectedIcon: require('common/img/tab_mine_ac.png'),
    component: <Mine />
}]
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'home',
            hidden: false,
            fullScreen: false,
        };
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        if (options.themeId && Constant.data.firstIn) { // 通过分享专题进入
            Constant.data.firstIn = false
            goPage(`/home/themeDetail?id=${options.themeId}`)
        }
        if (options.goodsId && Constant.data.firstIn) { // 通过分享专题进入
            Constant.data.firstIn = false
            goPage(`/home/goodsDetail?id=${options.goodsId}`)
        }
        if (options.webview && Constant.data.firstIn) { // 通过分享页面进入
            Constant.data.firstIn = false
            let url = decodeURIComponent(options.webview)
            goPage(url)
        }
        let selectedTab = localStorage.getItem('selectedTab') || this.state.selectedTab
        let title = TabBars.find(x => x.key === selectedTab).title
        document.title = title
        this.setState({
            selectedTab: selectedTab
        })

    }

    componentDidMount() {

    }

    async switchTab(name, title) {
        // 跳转我的  切并未授权用户信息，发送请求 获取用户信息
        if (name == 'mine' && (!Constant.data.scopeUserInfo)) {
            await new Promise((resolve) => {
                postMessage('userInfo', 'userInfo')
                onMessage('userInfo', data => {
                    Constant.data.scopeUserInfo = true
                    resolve()
                })
            })
        }
        localStorage.setItem('selectedTab', name)
        this.setState({
            selectedTab: name,
        })
        document.title = title    // 更改navgation

    }

    render() {
        return (
            <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                <TabBar
                    unselectedTintColor="#999"
                    prerenderingSiblingsNumber={0}
                    tintColor="#25A1C5"
                    barTintColor="white"
                    hidden={this.state.hidden}
                >
                    {TabBars.map((item, index) => {
                        return (
                            <TabBar.Item
                                title={item.title}
                                key={item.key}
                                selectedIcon={<div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(' + item.selectedIcon + ') center center /  21px 21px no-repeat'
                                }}
                                />
                                }
                                icon={<div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(' + item.icon + ') center center /  21px 21px no-repeat'
                                }}
                                />
                                }
                                selected={this.state.selectedTab === item.key}
                                onPress={(e) => {
                                    this.switchTab(item.key, item.title)
                                }}
                            >
                                {item.component}
                            </TabBar.Item>
                        )
                    })}

                </TabBar>
            </div>
        )
    }
}


export default withRouter(App)