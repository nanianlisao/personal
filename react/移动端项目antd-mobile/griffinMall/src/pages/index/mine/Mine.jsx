import React from 'react'
import './Mine.less'
import { Axios, goPage, postMessage } from 'util/util'
import Constant from 'util/Constant'
export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
            orderTab: [
                { name: '待支付', img: require('common/img/order_status1.png'), newCount: 0, state: 1 },
                { name: '待配送', img: require('common/img/order_status2.png'), newCount: 0, state: 2 },
                { name: '待评价', img: require('common/img/order_status3.png'), newCount: 0, state: 3 },
                // { name: '退款', img: require('common/img/order_status4.png'), newCount: 0, state: 4 },
            ]
        }
    }

    componentWillMount() {
        this.getMyInfo()
    }

    async getMyInfo() {
        let { orderTab } = this.state
        let res = await Axios.get(`/appService/find/shopping/all`)
        console.log(res)
        orderTab[0].newCount = res.data.waitPayOrderNumber
        orderTab[1].newCount = res.data.waitTakeOrderNumber
        orderTab[2].newCount = res.data.waitCommentOrderNumber
        if(res.data.serviceTel){
            Constant.data.serviceTel = res.data.serviceTel
        }
        this.setState({
            item: res.data
        })
    }

    render() {
        let { orderTab, item } = this.state
        return (
            <main className="page-mine">
                <section className="top flex-center"
                    style={{
                        backgroundImage: `url(${require('common/img/mine_bg.png')})`,
                    }}
                >
                    <div className="user-info flex-middle">
                        <img src={item.avatarUrl ? item.avatarUrl : require('common/img/0.jpg')} alt="" />
                        <span>{item.userName?item.userName:'神秘人'}</span>
                    </div>
                    <div className="ticket-entrance flex-middle" onClick={() => {
                        goPage('/mine/ticket')
                    }}>
                        <img src={require('common/img/ticket_entrance.png')} alt="" />
                        <span>优惠券 {item.ticketNumber}</span>
                    </div>
                </section>
                <section className="order-wrap">
                    <div className="order-header border2 flex-between" onClick={() => {
                        goPage('/mine/order')
                    }}>
                        <div className="title">全部订单</div>
                        <div className="flex-center">
                            <span>查看全部订单</span>
                            <img src={require('common/img/arrowBG.png')} alt="" />
                        </div>
                    </div>
                    <div className="order-tab flex-center">
                        {orderTab.map((x, i) => (
                            <div className="order-tab-item flex-middle" key={i} onClick={() => {
                                goPage(`/mine/order?state=${x.state}`)
                            }}>
                                <img src={x.img} alt="" />
                                <span>{x.name}</span>
                                {x.newCount > 0 ? <div className="new-count">{x.newCount}</div> : null}
                            </div>
                        ))}
                    </div>
                </section>
                <section className="mine-items">
                    <div className="mine-item flex-between border2" onClick={() => {
                        if (item.serviceTel) {
                            postMessage('callphone', item.serviceTel)
                        }
                    }}>
                        <span>联系客服</span>
                        {item.beginTime ? <span className="date">{item.beginTime}-{item.endTime}</span> : ""}
                    </div>
                    <div className="mine-item flex-between border2" onClick={() => {
                        goPage('/mine/extend')
                    }}>
                        <span>推广有奖</span>
                        <img src={require('common/img/arrowBG.png')} alt="" />
                    </div>
                    {/* <div className="mine-item flex-between border2">
                        <span>我的拼团</span>
                        <img src={require('common/img/arrowBG.png')} alt="" />
                    </div> */}
                </section>
            </main>
        )
    }
}