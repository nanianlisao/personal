import React from 'react'
import { TabBar } from 'antd-mobile';
import Home from 'pages/index/home/Home'
import Mine from 'pages/index/mine/Mine'
import Ordering from 'pages/index/ordering/Ordering'

import { postMessage, parseQueryString, goPage } from 'util/util'
import Constant from 'util/Constant'

const TabBars = [{
    title: '首页',
    key: 'home',
    icon: require('common/img/home.png'),
    selectedIcon: require('common/img/home_ac.png'),
    component: <Home />
}, {
    title: '订单',
    key: 'order',
    icon: require('common/img/ordering.png'),
    selectedIcon: require('common/img/ordering_ac.png'),
    component: <Ordering />
}, {
    title: '我的',
    key: 'mine',
    icon: require('common/img/mine.png'),
    selectedIcon: require('common/img/mine_ac.png'),
    component: <Mine />
}]

function jsonToStr(o) {
    let str = ''
    for (let [key, value] of Object.entries(o)) {
        str += `&${key}=${value}`
    }
    return '?' + str.substr(1)
}
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'home',
            hidden: false,
            fullScreen: false,
        };
    }
    componentWillMount() {
        let selectedTab = localStorage.getItem('selectedTab') || this.state.selectedTab
        if (selectedTab) {
            this.setState({
                selectedTab: selectedTab
            })
        }
    }

    componentDidMount() {
        let count = 0;
        let timer = setInterval(() => {
            if (!Constant.user_id.phone) {
                // if (window.env == 'wx' && window.ws && window.ws.readyState != 1) {
                //     clearInterval(timer)
                //     Constant.data.taskArr.push({ type: 'phone', key: 'phone' })
                // } else
                if (window.env == 'wx' && window.ws && window.ws.readyState == 1) {
                    clearInterval(timer)
                    postMessage('phone', 'phone')
                }
                if(window.env == 'ali'){
                    clearInterval(timer)
                    postMessage('phone', 'phone')
                }
                count++;
                if (count > 30) {
                    clearInterval(timer)
                }

            }
        }, 300)
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        if (options.webview && Constant.data.firstIn) { // 通过分享页面进入
            Constant.data.firstIn = false
            let url = decodeURIComponent(options.webview)
            goPage(url)
        }
        if (options.check && Constant.data.firstIn) { // 通过扫码进入
            Constant.data.firstIn = false
            let url = `/checkGoods/CheckGoods` + jsonToStr(options)
            goPage(url)
        }
    }

    switchTab(name, title) {
        localStorage.setItem('selectedTab', name)
        this.setState({
            selectedTab: name,
        })
        document.title = title
    }

    render() {
        return (
            <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                <TabBar
                    unselectedTintColor="#666"
                    prerenderingSiblingsNumber={0}
                    tintColor="#EA5420"
                    barTintColor="white"
                    hidden={this.state.hidden}
                >
                    {TabBars.map((item, index) => {
                        return (
                            <TabBar.Item
                                title={item.title}
                                ref={item.key}
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