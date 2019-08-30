import React from 'react'
import "pages/index/mine/levelUp/LevelUp.less"
import { goPage, Axios, parseQueryString, postMessage } from 'util/util'
import Constant from 'util/Constant'
import { InputItem, Button, Toast, Modal } from 'antd-mobile';
const alert = Modal.alert
export default class LevelUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeList: [],
            tIndex: null,
            bIndex: null
        }
    }
    componentDidMount() {
        this.getTypeList()
        this.getServierPhone()
    }

    async getTypeList() {
        let res = await Axios.get(`/member/level/list/app/${Constant.data.app_id}`, {
            startIndex: 0,
            pageSize: 10000
        })
        var data = res.data.filter(x => x.level != 1)
        this.setState({
            typeList: data
        })
    }

    async getServierPhone() {
        let res = await Axios.get(`/appService/find/applet/${Constant.data.app_id}`)
        this.setState({
            serviceTel: res.data.serviceTel
        })
    }


    render() {
        let { tIndex, bIndex, typeList } = this.state
        let chargeList = tIndex !== null ? typeList[tIndex].memberLevelFeeVos : []
        return (
            <main className="levelUp-page">
                <div className="top">请选择您想要升级的类型</div>
                <div className="type-list">
                    {typeList.map((item, index) => (
                        <div className={["type-item", index == tIndex ? 'act' : ''].join(" ")} key={index} onClick={async () => {
                            this.setState({
                                tIndex: index,
                                bIndex: null
                            })

                        }}>{item.name}</div>
                    ))}
                </div>
                <div className="charge-list">
                    {chargeList && chargeList.map((item, index) => (
                        <div className={["charge-item", bIndex == index ? 'act' : ''].join(" ")} key={index} onClick={async () => {
                            this.setState({
                                bIndex: index,
                            })
                            try {
                                let res = await Axios.get('/message/member/apply', {
                                    memberLevelFeeId: item.id
                                })
                                Toast.success('发送会员等级申请成功')
                            } catch (e) {
                                alert(e.res.retMsg)
                            }
                        }}>
                            <div className="info">
                                <span>{item.type == 100 ? '长期' : item.type + '年'}/{item.fee}元</span>
                                <img src={require('common/img/discount.png')} alt="" />
                            </div>
                            <div className="levelUp">开通</div>
                        </div>
                    ))}
                </div>
                <div className="submit">
                    <Button className="submit-btn" activeClassName="hover" onClick={() => {
                        postMessage('callphone', this.state.serviceTel)
                    }}>直接联系我们</Button>
                </div>
            </main >
        )
    }
}