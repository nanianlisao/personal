import React from 'react'
import { Row, Col, Dropdown, Menu, Icon } from 'antd';
import { goPage } from '../../utils/util';
import { Constant } from "../../utils/Constant";
export interface ITopHeaderProps {
    [propName: string]: any
}

export interface ITopHeaderState {
    showDot: boolean,
}

export default class TopHeader extends React.Component<ITopHeaderProps, ITopHeaderState> {
    constructor(props: ITopHeaderProps) {
        super(props)
        this.state = {
            showDot: true,
        }
    }

    componentWillMount() {
        let user = Constant.getLocalStorage('user')
        if (!user) {
            goPage('/login')
        }
    }

    render() {
        let user = JSON.parse(Constant.getLocalStorage('user') as string)
        let menu = (
            <Menu style={{ textAlign: 'center' }}>
                <Menu.Item onClick={() => {
                    if (localStorage.getItem('token')) {
                        localStorage.removeItem('token')
                    }
                    goPage('/login')
                }}>
                    退出登录
                </Menu.Item>
                <Menu.Item onClick={() => {
                    if (localStorage.getItem('token')) {
                        localStorage.removeItem('token')
                    }
                    goPage('/login')
                }}>
                    切换账号
                </Menu.Item>
                <Menu.Item>
                    取消
                </Menu.Item>
            </Menu>
        );

        // let menuMessage = this.state.messageList.map(item => {
        //     return (
        //         <Menu.Item key={item.id}>
        //             <div>
        //                 <div style={{ whiteSpace: 'normal' }}>{item.title}</div>
        //                 <div style={{ color: '#999', marginTop: '5px', fontSize: '12px' }}>{item.addTime}</div>
        //             </div>
        //         </Menu.Item>
        //     )
        // })

        // let menu2 = (
        //     <Menu style={{ width: '300px' }}>
        //         <Menu.Item>通知</Menu.Item>
        //         <Menu.Divider></Menu.Divider>
        //         {menuMessage}
        //         <Menu.Divider></Menu.Divider>
        //         <Menu.Item onClick={() => {
        //             goPage('/main/message')
        //         }}>
        //             查看更多
        //         </Menu.Item>
        //     </Menu>
        // );
        return (
            <Row justify={'space-between'} type={'flex'}>
                <Col span={6} >{user && user.appName}</Col>
                <Col span={18}>
                    <Row justify={'end'} type={'flex'} gutter={{ xs: 8, sm: 16, md: 24 }}>
                        {/* <Col>
                            <Dropdown overlay={menu2}
                                disabled={this.state.messageList.length == 0}
                                placement="bottomCenter" onVisibleChange={(e) => {
                                    console.log(e)
                                    if (e) {
                                        this.setState({
                                            showDot: false
                                        })
                                    }
                                }}>
                                <div onClick={() => {
                                    goPage('/main/message')
                                }}>
                                    <Badge dot={this.state.messageList.length > 0 && this.state.showDot}>
                                        <a href="#" className="head-example" />
                                        <Icon type="bell" style={{ fontSize: '20px' }}></Icon>
                                    </Badge>
                                </div>
                            </Dropdown>
                        </Col> */}
                        <Col>
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <div>{user && user.userName} <Icon type="down" /></div>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}