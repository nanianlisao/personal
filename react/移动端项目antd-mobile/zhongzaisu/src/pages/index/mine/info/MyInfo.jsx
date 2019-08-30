import React from 'react'
import 'pages/index/mine/info/MyInfo.less'
import { goPage, Axios, isHttpImg } from 'util/util'
import AreaPicker from 'common/areaPicker/AreaPicker'
import { InputItem, Button, Picker, Modal, Toast } from 'antd-mobile';
import Constant from 'util/Constant'
let alert = Modal.alert
export default class MyInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            obj: {},
            imgUrl: Constant.getPicUrl(),
            typeListIndex: [0]
        }
    }
    componentDidMount() {
        this.getMemberDetail()
        this.getTypeList()
    }

    async getMemberDetail() {
        let res = await Axios.get('/member/detail')
        res.data.memberIndustryName = res.data.memberIndustryVo.name
        res.data.memberLevelName = res.data.memberLevelVo.name
        this.setState({
            obj: res.data,
            name: res.data.name
        })
        console.log(res)
    }

    async getTypeList() {
        let res = await Axios.get(`/member/industry/list/app/${Constant.data.app_id}`, {
            startIndex: 0,
            pageSize: 10000
        })
        res.data.items.map((x, index) => {
            x.value = index
            x.label = x.name
        })
        this.setState({
            typeList: res.data.items
        })
    }

    async submit() {
        let { obj } = this.state
        if (!obj.name) {
            alert('请输入姓名')
            return
        }
        if (!obj.companyName) {
            alert('请输入公司名称')
            return
        }
        if (!obj.address) {
            alert('请输入详细地址')
            return
        }
        if (!obj.moto) {
            alert('请输入月产量')
            return
        }
        if (!/^1\d{10}$/.test(obj.tel)) {
            alert('请输入正确的电话号码')
            return
        }
        try {
            let res = await Axios.post('/member/modify', {
                id: obj.id,
                area: obj.area,
                areaCode: obj.areaCode,
                city: obj.city,
                address: obj.address,
                companyName: obj.companyName,
                memberIndustryId: obj.memberIndustryId,
                moto: obj.moto,
                name: obj.name,
                province: obj.province,
                tel: obj.tel,
            })
            Toast.success('会员信息修改成功')
            setTimeout(() => {
                this.props.history.goBack()
            }, 500)
        } catch (e) {
            alert(e.res.retMsg)
        }
    }

    render() {
        let { obj, imgUrl, typeListIndex, typeList, name } = this.state
        return (
            <main className="myInfo-page">
                <div className='top'>
                    <div className="left">
                        <div className="name">{name}</div>
                        <div className="btm">
                            <div className="level">
                                <img src={require("common/img/v.png")}></img>
                                <span>{obj.memberLevelName}</span>
                            </div>
                            <div className="upLevel" onClick={() => {
                                goPage('/mine/levelUp')
                            }}>升级会员</div>
                        </div>
                    </div>
                    <div className="profile">
                        <img src={isHttpImg(obj.avatarUrl) ? obj.avatarUrl : imgUrl + obj.avatarUrl}></img>
                    </div>
                </div>
                <div className="form-content">
                    <div className="item">
                        <InputItem
                            value={obj.name}
                            placeholder="请输入姓名"
                            onChange={(e) => {
                                obj.name = e
                                this.setState({
                                    obj
                                })
                            }}
                        >姓名</InputItem>
                    </div>
                    <div className="item">
                        <InputItem
                            value={obj.companyName}
                            type="text"
                            placeholder="请输入公司名称"
                            onChange={(e) => {
                                obj.companyName = e
                                this.setState({
                                    obj
                                })
                            }}
                        >公司名称</InputItem>
                    </div>
                    <Picker
                        data={typeList}
                        cols={1}
                        value={typeListIndex}
                        onChange={(e) => {
                            obj.memberIndustryId = typeList[e[0]].id
                            obj.memberIndustryName = typeList[e[0]].name
                            this.setState({
                                typeListIndex: e,
                                obj
                            })
                        }}>
                        <div className="item border">
                            <InputItem
                                value={obj.memberIndustryName}
                                disabled
                                type="text"
                                placeholder="请选择行业"
                            >行业</InputItem>
                        </div>
                    </Picker>
                    <div className="item">
                        <AreaPicker onChange={(e) => {
                            let [provinceObj, cityObj, areaObj] = e
                            obj.province = provinceObj.label
                            obj.city = cityObj.label
                            obj.area = areaObj.label
                            obj.areaCode = areaObj.value
                            this.setState({
                                obj
                            })
                        }}>
                            <div className="choose-area">
                                <div className="title-area">省市区</div>
                                <InputItem
                                    className="borderB"
                                    type="text"
                                    value={obj.areaCode ? obj.province + obj.city + obj.area : ''}
                                    disabled
                                    extra={<img src={require('common/img/rArrow.png')} alt="" />}
                                    placeholder="请选择您所在的省、市、区"
                                >
                                </InputItem>
                            </div>
                        </AreaPicker>
                    </div>
                    <div className="item">
                        <InputItem
                            value={obj.address}
                            placeholder="请输入详细地址"
                            onChange={(e) => {
                                obj.address = e
                                this.setState({
                                    obj
                                })
                            }}
                        >详细地址</InputItem>
                    </div>
                    <div className="item">
                        <InputItem
                            type="number"
                            value={obj.tel}
                            maxLength={11}
                            placeholder="请输入电话"
                            disabled
                            onChange={(e) => {
                                obj.tel = e
                                this.setState({
                                    obj
                                })
                            }}
                            extra={<div className="flex-center phone-extra"><span>已绑定</span><img src={require('common/img/rArrow.png')} alt="" /></div>}
                            onExtraClick={()=>{
                                goPage(`/mine/myInfo/changePhone?phone=${obj.tel}`)
                            }}
                        >电话</InputItem>
                    </div>
                    <div className="item">
                        <InputItem
                            value={obj.moto}
                            placeholder="请输入月产量"
                            onChange={(e) => {
                                obj.moto = e
                                this.setState({
                                    obj
                                })
                            }}
                        >月产量</InputItem>
                    </div>
                </div>
                <div className="remark">修改月产量、行业需后台重新审核，请谨慎修改！</div>
                <div className="submit">
                    <Button className="submit-btn" activeClassName="hover" onClick={() => {
                        this.submit()
                    }}>确认提交</Button>
                </div>
            </main >
        )
    }
}