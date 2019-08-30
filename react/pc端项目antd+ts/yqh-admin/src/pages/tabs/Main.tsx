import * as React from 'react';
import { Layout, Button, Menu, Icon, Breadcrumb } from 'antd';
import { withRouter } from 'react-router-dom';
import { Router2 } from '../../router/index';
import { goPage } from '../../utils/util';
import TopHeader from '../../components/topHeader/TopHeader';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
export interface IMainProps {
    [propName: string]: any
}

export interface IMainState {
    [propName: string]: any
}


class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);
        this.state = {
            collapsed: false,
            pathKey: [],
            openKey: [],
            msg: "支付宝收款90.02元",
            menuList: [{
                key: "1",
                value: "图片管理",
                icon: "picture",
                children: [{
                    key: "1-1",
                    value: "启动页列表",
                    url: "/main/img/start"
                }, {
                    key: "1-2",
                    value: "首页banner列表",
                    url: "/main/img/banner"
                }, {
                    key: "1-3",
                    value: "广告图片",
                    url: "/main/img/advert"
                }]
            }, {
                key: "2",
                value: "资讯管理",
                icon: "read",
                children: [{
                    key: "2-1",
                    value: "合作品牌列表",
                    url: "/main/news/brand"
                }, {
                    key: "2-2",
                    value: "会场列表",
                    url: "/main/news/meeting"
                }]
            }, {
                key: "3",
                value: "报名管理",
                icon: "fork",
                children: [{
                    key: "3-1",
                    value: "活动列表",
                    url: "/main/sign/activity"
                }, {
                    key: "3-2",
                    value: "报名列表",
                    url: "/main/sign/list"
                }, {
                    key: "3-3",
                    value: "签到记录",
                    url: "/main/sign/record"
                }]
            }, {
                key: "4",
                value: "订单管理",
                icon: "file",
                children: [{
                    key: "4-1",
                    value: "交易列表",
                    url: "/main/order/list"
                }]
            }, {
                key: "5",
                value: "权限管理",
                icon: "user",
                children: [{
                    key: "5-1",
                    value: "人员列表",
                    url: "/main/scope/user"
                }]
            }, {
                key: "6",
                value: "APP管理",
                icon: "setting",
                children: [{
                    key: "6-1",
                    value: "基础设置",
                    url: "/main/app/setting"
                }, {
                    key: "6-2",
                    value: "小程序码",
                    url: "/main/app/qrcode"
                }]
            }]
        };
    }

    componentWillMount = async () => {
        try {
            let crtUrl = this.props.location.pathname // 当前的url
            let pathKey: string[] = [];
            let openKey: string[] = [];
            this.state.menuList.map((menu: any) => {
                if (menu.url == crtUrl) {
                    pathKey[0] = String(menu.key);
                    openKey[0] = String(menu.key);
                } else if (menu.children) {
                    menu.children.map((child: any) => {
                        if (child.url == crtUrl) {
                            pathKey[0] = String(child.key);
                            openKey[0] = String(menu.key);
                        }
                    })
                }
            });
            this.setState({
                openKey,
                pathKey,
            })
        } catch (e) {
            console.log(e);
        }
    }

    componentDidMount = async () => {
        this.props.history.listen((e: { pathname: string }) => {
            this.watchActiveUrl(e.pathname)
        })
    }

    watchActiveUrl(crtUrl: string) {
        let pathKey: string[] = [];
        this.state.menuList.map((menu: any) => {
            if (menu.url == crtUrl) {
                pathKey[0] = String(menu.key);
            } else if (menu.children) {
                menu.children.map((child: any) => {
                    if (child.url == crtUrl) {
                        pathKey[0] = String(child.key);
                    }
                })
            }
        });
        this.setState({
            selectedKeys: pathKey.length > 0 ? pathKey : null,
        })
    }


    // 菜单收起
    public toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    // 点击二级导航 进行页面跳转
    public goTo = (e: { keyPath: any }) => {
        let url = "";
        this.state.menuList.map((menu: any) => {
            if (menu.key == e.keyPath[e.keyPath.length - 1]) {
                if (menu.children) {
                    menu.children.map((child: any) => {
                        if (child.key == e.keyPath[e.keyPath.length - 2]) {
                            url = child.url;
                        }
                    })
                } else {
                    url = menu.url;
                }
            }
        });
        goPage(url);
    }

    public render() {
        // let user = JSON.parse(.getLocalStorage('user'));
        let path = window.location.pathname;
        let breadList: object[] = [];
        let { menuList } = this.state
        // 生成菜单
        let menus = menuList.map((menu: any) => {
            if (menu.children) {
                let children = menu.children.map((child: any) => {
                    // 生成面包屑与当前menus业务无关
                    if (path == child.url) {
                        breadList.push(menu.value);
                        breadList.push(child.value);
                    }
                    return (
                        <Menu.Item key={child.key}>
                            <span>{child.value}</span>
                        </Menu.Item>
                    )
                })
                return (
                    <SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.value}</span></span>}>
                        {children}
                    </SubMenu>
                )
            } else {
                // 生成面包屑
                if (path == menu.url) {
                    breadList.push(menu.value);
                }
                return (
                    <Menu.Item key={menu.key}>
                        <Icon type={menu.icon} />
                        <span>{menu.value}</span>
                    </Menu.Item>
                )
            }
        });
        let breads = breadList.map((bread, index: number) => {
            return (
                <Breadcrumb.Item key={index}>{bread}</Breadcrumb.Item>
            )
        })
        return (
            <Layout style={{ height: '100%' }}>
                <Header style={{ color: '#fff' }}>
                    <TopHeader />
                </Header>
                <Layout style={{ height: 'calc(100% - 44px)' }}>
                    <Sider
                        collapsible={true}
                        collapsed={this.state.collapsed}
                        className="fixed-sider-content main-sider"
                        style={{ background: '#fff' }}
                        trigger={null}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Button type="primary" onClick={() => {
                                this.toggleCollapsed()
                            }}
                                style={{ margin: '10px auto' }}>
                                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                            </Button>
                        </div>
                        {menuList.length > 0 ? <Menu
                            style={{ borderRight: 'none' }}
                            defaultSelectedKeys={this.state.pathKey}
                            defaultOpenKeys={this.state.openKey}
                            selectedKeys={this.state.selectedKeys ? this.state.selectedKeys : this.state.pathKey}
                            mode="inline"
                            theme="light"
                            // inlineCollapsed={this.state.collapsed}
                            onClick={this.goTo}
                        >
                            {menus}
                        </Menu> : ""}
                    </Sider>
                    <Layout className="main-content">
                        <Breadcrumb>
                            {breads}
                        </Breadcrumb>
                        <Content id="noScroll" className="fixed-sider-content noScroll" style={{ paddingRight: '20px' }}>
                            <Router2 />
                        </Content>
                    </Layout>
                </Layout>
                <audio id="tts_autio_id" style={{ display: "none" }} />

            </Layout>
        );
    }
}
export default withRouter(Main as any);