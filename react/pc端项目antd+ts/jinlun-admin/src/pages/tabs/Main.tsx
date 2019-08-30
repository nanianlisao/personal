import * as React from 'react'
import { Layout, Button, Menu, Icon, Breadcrumb } from 'antd'
import { withRouter } from 'react-router-dom'
import { Router2 } from '../../router/index'
import { goPage } from '../../utils/util'
import TopHeader from '../../components/topHeader/TopHeader'  // 页面顶部组件
const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu
export interface IObjectAny {
    [propName: string]: any
}

// menu的类型
type menuType = { key: string, value: string, icon?: string, url?: string, children?: menuType }[]

export interface IMainState {
    collapsed: boolean
    openKey: string[]   // menu中 当前展开的一级列表keys
    selectedKeys: string[] | undefined  // menu中 当前选中的列表key
    menuList: menuType, // menu数据列表
}


class Main extends React.Component<IObjectAny, IMainState> {
    constructor(props: IObjectAny) {
        super(props)
        this.state = {
            collapsed: false, // 菜单是否收起
            openKey: [], // menu中 当前展开的一级列表keys
            selectedKeys: undefined,  // menu中 当前选中的列表key
            menuList: [{
                key: "1",
                value: "数据看板",
                icon: "pie-chart",
                url: "/main/panel/panel"
            }, {
                key: "2",
                value: "图片管理",
                icon: "picture",
                children: [{
                    key: "2-1",
                    value: "图片列表",
                    url: "/main/img/imgList"
                }, {
                    key: "2-2",
                    value: "活动详情",
                    url: "/main/img/active"
                // }, {
                //     key: "2-3",
                //     value: "广告管理",
                //     url: "/main/img/advert"
                }]
            }, {
                key: "3",
                value: "店铺管理",
                icon: "shop",
                children: [{
                    key: "3-1",
                    value: "楼层列表",
                    url: "/main/shop/floor"
                }, {
                    key: "3-2",
                    value: "分类列表",
                    url: "/main/shop/type"
                }, {
                    key: "3-3",
                    value: "店铺列表",
                    url: "/main/shop/shopList"
                }]
            }, {
                key: "4",
                value: "订单管理",
                icon: "file",
                children: [{
                    key: "4-1",
                    value: "交易列表",
                    url: "/main/order/orderList"
                }]
            }, {
                key: "5",
                value: "优惠券管理",
                icon: "gift",
                children: [{
                    key: "5-1",
                    value: "创建优惠券",
                    url: "/main/ticket/ticketAdd"
                }, {
                    key: "5-2",
                    value: "优惠券列表",
                    url: "/main/ticket/ticketList"
                }]
            }, {
                key: "6",
                value: "APP管理",
                icon: "setting",
                children: [{
                    key: "6-1",
                    value: "权限管理",
                    url: "/main/app/user"
                }, {
                    key: "6-2",
                    value: "小程序码",
                    url: "/main/app/qrcode"
                }]
            }]
        }
    }

    // 根据url，判断当前选中和展开的列表
    componentWillMount = async () => {
        let crtUrl = this.props.location.pathname // 当前的url
        let user = localStorage.getItem('user')
        if (!user) {
            goPage('/login')
            return
        }
        let roleId = JSON.parse(user).roleId
        let { menuList } = this.state
        if (roleId === 3) {
            (menuList[2].children as []).splice(0, 2)
            let NewMenuList = [menuList[2], menuList[3]]
            crtUrl = '/main/shop/shopList'
            goPage(crtUrl)
            this.setState({
                menuList: NewMenuList
            })
        }

        let selectedKeys: string[] = [], openKey: string[] = []
        menuList.forEach((menu) => {
            if (menu.url == crtUrl) {  // 如果当前选中为一级列表，则展开项和选中项 均为当前key
                selectedKeys[0] = menu.key
                openKey[0] = menu.key
            } else if (menu.children) {
                menu.children.forEach((child) => {
                    // 如果当前选中为二级列表，则展开项为父级key，选中项为当前key
                    if (child.url == crtUrl) {
                        selectedKeys[0] = child.key
                        openKey[0] = menu.key
                    }
                })
            }
        })
        this.setState({
            openKey,
            selectedKeys,
        })
    }


    componentDidMount = async () => {
        this.props.history.listen((e: { pathname: string }) => {
            this.watchActiveUrl(e.pathname)
        })
    }

    // 点击menu进行路由跳转时，实时更新selectedKeys
    private watchActiveUrl(crtUrl: string) {
        let selectedKeys: string[] = []
        this.state.menuList.map((menu) => {
            if (menu.url == crtUrl) {
                selectedKeys[0] = menu.key
            } else if (menu.children) {
                menu.children.map((child) => {
                    if (child.url == crtUrl) {
                        selectedKeys[0] = child.key
                    }
                })
            }
        })
        this.setState({
            selectedKeys: selectedKeys.length > 0 ? selectedKeys : undefined,
        })
    }


    // 菜单收起和展开
    private toggleCollapsed = () => {
        this.setState((preState) => ({
            collapsed: !preState.collapsed,
        }))
    }

    // 点击二级导航 进行页面跳转
    private goTo = (e: { keyPath: string[] }): void => {
        let url: string | undefined = ""
        // 根据传入keyPath查询选中key的url
        this.state.menuList.forEach((menu) => {
            if (menu.key == e.keyPath[e.keyPath.length - 1]) {
                if (menu.children) {
                    menu.children.forEach((child) => {
                        if (child.key == e.keyPath[e.keyPath.length - 2]) {
                            url = child.url
                        }
                    })
                } else {
                    url = menu.url
                }
            }
        })
        // 查找到url 进行跳转
        goPage(url)
    }

    public render() {
        let path = window.location.pathname
        let breadList: string[] = []   // 面包屑数据列表
        let { menuList } = this.state
        // 根据menuList生成menu菜单的reactNode 同时根据选中的url生成面包屑
        let menus = menuList.map((menu) => {
            if (menu.children) {
                let children = menu.children.map((child) => {
                    if (path == child.url) { // 生成面包屑
                        breadList.push(menu.value)
                        breadList.push(child.value)
                    }
                    return <Menu.Item key={child.key}><span>{child.value}</span></Menu.Item>
                })
                // 生成二级菜单列表
                return <SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.value}</span></span>}>{children} </SubMenu>
            } else {
                if (path == menu.url) { // 生成面包屑
                    breadList.push(menu.value)
                }
                return <Menu.Item key={menu.key}> <Icon type={menu.icon} /><span>{menu.value}</span></Menu.Item>
            }
        })
        let breads = breadList.map((bread, index: number) => {
            return <Breadcrumb.Item key={index}>{bread}</Breadcrumb.Item>
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
                            defaultOpenKeys={this.state.openKey}
                            selectedKeys={this.state.selectedKeys ? this.state.selectedKeys : this.state.selectedKeys}
                            mode="inline"
                            theme="light"
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
            </Layout>
        )
    }
}
export default withRouter(Main as any)