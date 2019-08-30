import React from 'react'
import { withRouter } from 'react-router-dom';
import "pages/register/chooseType/ChooseType.less"
import { InputItem, Button, Modal, Toast } from 'antd-mobile';
import { goPage, Axios, parseQueryString, postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant'
let alert = Modal.alert
class ChooseType extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeList: [],
            tIndex: null,
            bIndex: null
        }
    }
    componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        Object.assign(this.state, options)
        this.getTypeList()
    }


    async getTypeList() {
        let res = await Axios.get(`/member/level/list/app/${Constant.data.app_id}`, {
            startIndex: 0,
            pageSize: 10000
        })
        console.log(res)
        // res.data.items.map((x, index) => {
        //     x.value = index
        //     x.label = x.name
        // })
        this.setState({
            typeList: res.data
        })
    }

    async submit() {
        let { tIndex, bIndex, typeList } = this.state
        if (!((tIndex || tIndex === 0) && (bIndex || bIndex === 0))) {
            alert('请选择会员类型')
            return
        }
        let memberLevelFeeId = typeList[tIndex].memberLevelFeeVos[bIndex].id
        postMessage('loginCode', 'loginCode')
        onMessage('loginCode', async (data) => {
            let openCode = data
            let openType = window.env == 'wx' ? 1 : 2
            let { address, area, areaCode, companyName, idCard, memberIndustryId, name, province, phone, city } = this.state
            try {

                let res = await Axios.post('/system/register', {
                    address, area, areaCode, companyName, idCard, memberIndustryId, memberLevelFeeId, name, openCode, province, city,
                    appId: Constant.data.app_id,
                    tel: phone,
                    openType
                })

                localStorage.setItem('user', JSON.stringify(res.data.user))
                localStorage.setItem('token', res.data.token)
                let res2 = await Axios.post('thirdparty/modify/relate', JSON.parse(localStorage.getItem('userInfo')))
                console.log(res2)
                alert('您的信息注册审核中', '请耐心等待，如有需要可以直接联系客服', [
                    { text: '我知道了', style: { color: '#24C789' }, onPress: () => { goPage(`/`) }, },
                ])
            } catch (e) {
                alert('提示', e.res.retMsg)
            }
        })

    }

    render() {
        let { typeList, tIndex, bIndex } = this.state
        let chargeList = tIndex !== null ? typeList[tIndex].memberLevelFeeVos : []
        return (
            <main className="chooseType-page">
                <div className="top">您的注册会员类型？</div>
                <div className="type-list">
                    {typeList.map((item, index) => (
                        <div className={["type-item", index == tIndex ? 'act' : ''].join(" ")} key={index} onClick={() => {
                            this.setState({
                                tIndex: index,
                                bIndex: null
                            })
                        }}>{item.name}</div>
                    ))}
                </div>
                <div className="charge-list">
                    {chargeList && chargeList.map((item, index) => (
                        <div className={["charge-item", bIndex == index ? 'act' : ''].join(" ")} key={index} onClick={() => {
                            this.setState({
                                bIndex: index,
                            })
                        }}>
                            <div className="info">
                                <span>{item.type == 100 ? '长期' : item.type + '年'}/{item.fee}元</span>
                                <img src={require('common/img/discount.png')} alt="" />
                            </div>
                            <div className="levelUp">选我</div>
                        </div>
                    ))}
                </div>
                <div className="remark">
                    <p>您的信息等待后台审核</p>
                    <p>请耐心等待，客服人员会和您联系</p>
                </div>
                <div className="submit">
                    <Button className="submit-btn" onClick={() => {
                        this.submit()
                    }} activeClassName="hover">确 认</Button>
                </div>
            </main >
        )
    }
}

export default withRouter(ChooseType)