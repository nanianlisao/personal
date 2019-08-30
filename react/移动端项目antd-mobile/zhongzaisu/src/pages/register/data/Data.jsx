import React from 'react'
import { withRouter } from 'react-router-dom';
import "pages/register/data/Data.less"
import AreaPicker from 'common/areaPicker/AreaPicker'
import { goPage, Axios, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
import { List, InputItem, Button, Picker, Modal } from 'antd-mobile';
let alert = Modal.alert
class Data extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            companyName: '',
            idCard: '',
            typeList: [],
            typeListIndex: ''

        }
    }
    componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.state.phone = options.phone
        this.getTypeList()
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

    continue() {
        console.log(this.props)
        let { area, city, province, areaCode, address, name, companyName, idCard, typeListIndex, typeList, phone } = this.state
        let memberIndustryId = typeListIndex.length > 0 ? typeList[typeListIndex[0]].id : ''
        if (!name) {
            alert('请输入姓名')
            return
        }
        if (!area) {
            alert('请选择省市区')
            return
        }
        if (!address) {
            alert('请输入详细地址')
            return
        }

        if (!memberIndustryId) {
            alert('请选择行业')
            return
        }
        goPage(`/register/chooseType?phone=${phone}&area=${area}&city=${city}&province=${province}&areaCode=${areaCode}&address=${address}&name=${name}&idCard=${idCard}&memberIndustryId=${memberIndustryId}&companyName=${companyName}`)
    }

    render() {
        let { typeListIndex, typeList, area, city, province, areaCode } = this.state
        return (
            <main className="data-page">
                <List className="form">
                    <List.Item className="form-item">
                        <div className="label-name">姓名</div>
                        <InputItem
                            className="borderB"
                            type="text"
                            placeholder="请输入您的真实姓名"
                            onChange={(e) => {
                                this.state.name = e
                            }}
                        >
                        </InputItem>
                    </List.Item>
                    <List.Item className="form-item">
                        <div className="label-name">公司名称</div>
                        <InputItem
                            className="borderB"
                            type="text"
                            placeholder="请输入您的公司名称（选填）"
                            onChange={(e) => {
                                this.state.companyName = e
                            }}
                        >
                        </InputItem>
                    </List.Item>
                    <List.Item className="form-item">
                        <div className="label-name">身份证号</div>
                        <InputItem
                            className="borderB"
                            maxLength={26}
                            type="text"
                            placeholder="请输入您的身份证号（选填）"
                            onChange={(e) => {
                                this.state.idCard = e
                            }}
                        >
                        </InputItem>
                    </List.Item>
                    <List.Item className="form-item">
                        <div className="label-name">行业</div>
                        <Picker
                            data={this.state.typeList}
                            cols={1}
                            value={typeListIndex}
                            onChange={(e) => {
                                this.setState({
                                    typeListIndex: e
                                })
                            }}>
                            <div>
                                <InputItem
                                    className="borderB"
                                    type="text"
                                    value={typeListIndex.length > 0 ? typeList[typeListIndex[0]].name : ''}
                                    disabled
                                    extra={<img src={require('common/img/rArrow.png')} alt="" />}
                                    placeholder="请选择您的行业"
                                >
                                </InputItem>
                            </div>
                        </Picker>
                    </List.Item>
                    <List.Item className="form-item">
                        <div className="label-name">地址</div>
                        <AreaPicker onChange={(e) => {
                            let [provinceObj, cityObj, areaObj] = e
                            this.setState({
                                province: provinceObj.label,
                                city: cityObj.label,
                                area: areaObj.label,
                                areaCode: areaObj.value
                            })
                        }}>
                            <div>
                                <InputItem
                                    className="borderB"
                                    type="text"
                                    value={areaCode ? province + city + area : ''}
                                    disabled
                                    extra={<img src={require('common/img/rArrow.png')} alt="" />}
                                    placeholder="请选择您所在的省、市、区"
                                >
                                </InputItem>
                            </div>
                        </AreaPicker>
                        <InputItem
                            className="borderB"
                            type="text"
                            placeholder="详细地址：如街道单元楼楼栋号等"
                            onChange={(e) => {
                                this.state.address = e
                            }}
                        >
                        </InputItem>
                    </List.Item>
                </List>
                <div className="submit"><Button className="btn" activeClassName="hover" onClick={() => {
                    this.continue()
                }}>继 续</Button></div>
            </main >
        )
    }
}

export default withRouter(Data)