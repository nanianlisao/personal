import React from 'react'
import { TabBar } from 'antd-mobile';
import Home from 'pages/index/home/Home'
import Baojia from 'pages/index/baojia/Baojia'
import Quanzi from 'pages/index/quanzi/Quanzi'
import Huangye from 'pages/index/huangye/Huangye'
import Mine from 'pages/index/mine/Mine'
const TabBars = [{
    title: '首页',
    key: 'home',
    icon: require('common/img/home.png'),
    selectedIcon: require('common/img/home_ac.png'),
    component: <Home />
}, {
    title: '报价',
    key: 'baojia',
    icon: require('common/img/baojia.png'),
    selectedIcon: require('common/img/baojia_ac.png'),
    component: <Baojia />
},
{
    title: '圈子',
    key: 'quanzi',
    icon: require('common/img/quanzi.png'),
    selectedIcon: require('common/img/quanzi_ac.png'),
    component: <Quanzi />
},
{
    title: '黄页',
    key: 'huangye',
    icon: require('common/img/huangye.png'),
    selectedIcon: require('common/img/huangye_ac.png'),
    component: <Huangye />
}, {
    title: '我的',
    key: 'mine',
    icon: require('common/img/mine.png'),
    selectedIcon: require('common/img/mine_ac.png'),
    component: <Mine />
}]
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

    }

    switchTab(name) {
        localStorage.setItem('selectedTab', name)
        this.setState({
            selectedTab: name,
        })
    }

    render() {
        return (
            <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                <TabBar
                    unselectedTintColor="#666"
                    prerenderingSiblingsNumber={0}
                    tintColor="#24C789"
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
                                    this.switchTab(item.key)
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