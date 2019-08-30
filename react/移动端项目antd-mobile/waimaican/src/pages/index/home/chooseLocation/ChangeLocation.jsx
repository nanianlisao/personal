import React from 'react'
import './ChooseLocation.less'
import { Axios, goPage, chooseLocation, checkPhone, parseQueryString } from 'util/util'
import { Button, InputItem, Modal, Toast } from 'antd-mobile';
import Constant from 'util/Constant'
const alert = Modal.alert
export default class ChangeLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 1000,
            imgUrl: Constant.getPicUrl(),
            dizhiList: [],
            nowType: 2,  // 1 查看当前列表 2 编辑地址 3 添加地址
            dizhiObj: {},
            token: localStorage.getItem('token'),
        };
    }
    componentWillMount() {
        document.title = '编辑地址'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        let dizhiObj = JSON.parse(decodeURIComponent(options.dizhiObj))
        this.setState({
            dizhiObj,
            nowType: dizhiObj.id ? 2 : 3
        })

    }


    // 添加|修改收货地址
    async addAddress() {
        let { dizhiObj } = this.state
        if (!dizhiObj.lat) {
            alert('提示', '请选择位置区域')
            return
        }
        if (!dizhiObj.receiveName) {
            alert('提示', '请输入收货人姓名')
            return
        }
        if (!checkPhone(dizhiObj.receivePhone)) {
            alert('提示', '请输入正确的联系电话')
            return
        }

        let url = dizhiObj.id ? '/user/address/modify' : '/user/address/create'
        try {
            let res = await Axios.post(url, dizhiObj)
            alert('提示', `${dizhiObj.id ? '修改' : '添加'}地址成功`, [
                {
                    text: '确定', onPress: () => {
                        this.props.history.goBack()
                    }
                }
            ])
        } catch (e) {
            alert('提示', e.res.retMsg)
        }
    }

    // 删除收获地址
    delAddress() {
        alert('提示', '是否确定删除该地址', [
            {
                text: '确定', onPress: async () => {
                    try {
                        await Axios.post(`/user/address/delete/${this.state.dizhiObj.id}`)
                        Toast.success('删除成功')
                        setTimeout(() => {
                            this.props.history.goBack()
                        }, 500)
                    } catch (e) {
                        console.log(e)
                        alert('提示', e.res.retMsg)
                    }
                }
            }, { text: '取消' }
        ])
    }




    render() {
        let {  nowType, dizhiObj } = this.state
        return (
            <div className="page-chooseLocation">
                <div className="top">
                    <img src={require('common/img/test.png')} alt="" />
                </div>
                <div className="wrapper">
                    <div className="header flex">
                        <img src={nowType != 2 ? require('common/img/dizhi2.png') : require('common/img/bianji2.png')} alt="" />
                        <span>{nowType == 2 ? '编辑' : '添加'}送餐地址</span>
                    </div>
                    <div className="content">
                        <div>
                            <div className="input-wrap" onClick={() => {
                                // var res = {
                                //     address: "江苏省南京市秦淮区太平南路1号",
                                //     errMsg: "chooseLocation:ok",
                                //     latitude: 32.040109,
                                //     longitude: 118.79521,
                                //     name: "新世纪广场"
                                // }
                                chooseLocation((res) => {
                                    dizhiObj.roughAddress = res.address
                                    dizhiObj.lat = res.latitude
                                    dizhiObj.lon = res.longitude
                                    this.setState({
                                        dizhiObj: dizhiObj
                                    })
                                })
                            }}>
                                <InputItem
                                    placeholder="请选择位置区域"
                                    disabled={true}
                                    value={dizhiObj.roughAddress}
                                    className="content-input"
                                ></InputItem>
                                <div className="input-null"></div>
                            </div>
                            <InputItem
                                placeholder="请输入详细地址"
                                value={dizhiObj.address}
                                onChange={(e) => {
                                    dizhiObj.address = e
                                    this.setState({
                                        dizhiObj
                                    })
                                }}
                                className="content-input"
                            ></InputItem>
                            <InputItem
                                placeholder="请输收货人姓名"
                                value={dizhiObj.receiveName}
                                onChange={(e) => {
                                    dizhiObj.receiveName = e
                                    this.setState({
                                        dizhiObj
                                    })
                                }}
                                className="content-input"
                            ></InputItem>
                            <InputItem
                                placeholder="请输联系电话"
                                value={dizhiObj.receivePhone}
                                maxLength={11}
                                onChange={(e) => {
                                    dizhiObj.receivePhone = e
                                    this.setState({
                                        dizhiObj
                                    })
                                }}
                                className="content-input"
                            ></InputItem>
                        </div>
                    </div>
                    <div className="footer zhai">
                        <Button className="btn" activeClassName="hover-btn" onClick={() => {
                            this.addAddress()
                        }}>确认</Button>
                        {dizhiObj.id ? <Button className="btn" activeClassName="hover-btn" onClick={() => {
                            this.delAddress()
                        }}>删除</Button> : <Button className="btn" activeClassName="hover-btn" onClick={() => {
                            this.props.history.goBack()
                        }}>返回</Button>}
                    </div>
                </div>
            </div>
        )
    }
}