import React from 'react'
import { Modal, Button } from 'antd-mobile';
import { Axios, goPage, scanCode, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
import './SubmitOrderOk.css'
const alert = Modal.alert;
export default class SubmitOrderOk extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderList: [],
            amount: 0,
            orderIds: [],
            stores: null
        }
    }
    componentWillMount() {
        document.title = '确认订单'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var { tableId, orderId } = options
        this.setState({ tableId, orderId })
        if (tableId) {
            this.tableDetail(tableId)
        } else {
            this.orderDetail(orderId)
        }
    }
    // 有桌牌码
    async tableDetail(tableId) {
        let res = await Axios.get(`/order/table/detail/${tableId}`)
        console.log(res)
        let orderList = res.data.orderAndGoodsVos
        let orderIds = []
        let amount = 0;
        orderList.map(order => {
            orderIds.push(order.id)
            amount = Number(Number(amount) + Number(order.amount)).toFixed(2)
            order.orderGoodsVos.map(x => {
                x.totalPrice = Number(x.price * x.quantity).toFixed(2)
            })
            order.totalCount = order.orderGoodsVos.reduce((prev, next) => prev + next.quantity, 0)
            order.totalPrice = Number(order.amount - order.totalDiscounts).toFixed(2)
        })
        this.setState({
            orderList: orderList,
            amount: amount,
            orderIds: orderIds,
            order: null,
            stores: res.data.storesVo
        })
    }

    // 获取订单信息
    async orderDetail(orderId) {
        try {
            let res = await Axios.get(`order/detail/${orderId}`)
            let order = res.data.orderAndGoodsVos[0]
            order.orderGoodsVos.map(x => {
                x.totalPrice = Number(x.price * x.quantity).toFixed(2)
            })
            order.totalCount = order.orderGoodsVos.reduce((prev, next) => prev + next.quantity, 0)
            order.totalPrice = Number(order.amount - order.totalDiscounts).toFixed(2)
            this.setState({
                order: order,
                stores: res.data.storesVo
            })
        } catch (e) {
            console.log(e)
        }
    }

    // 去支付
    toPay() {
        goPage(`/submitPay?orderId=${this.state.orderIds}&amount=${this.state.amount}`)
    }

    // 返回订单
    toOrdering() {
        localStorage.setItem('selectedTab', 'order')
        goPage('/index')
    }

    // 去加餐
    goCheckGoods() {
        goPage(`/checkGoods?scene=${this.state.stores.id},${this.state.tableId}&noquer=true`)
    }

    // 绑定桌码
    async scanCode() {
        let res = await scanCode(this.state.order.storesId, this.state.orderId)
        console.log(res)
        setTimeout(() => {
            this.toOrdering()
        }, 1000)
    }
    render() {
        let { tableId, orderList, order } = this.state
        return (
            <div className="page-submitOrderOk">
                {tableId
                    ? <div>
                        <div style={{ paddingTop: '0.2rem' }}>
                            {orderList.map((item, index) => {
                                return (<OrderList key={index} order={item} />)
                            })}
                        </div>
                        <div className='remark'>如需加餐可直接点击返回订单按钮去加餐，或点击
    <span onClick={() => {
                                this.goCheckGoods()
                            }}>去加餐</span>
                        </div>
                        <div className='move'>
                            <Button className='pay' onClick={() => {
                                this.toPay()
                            }}>立即支付</Button>
                            <Button className='return' onClick={() => {
                                this.toOrdering()
                            }}>返回订单</Button>
                        </div>
                    </div>
                    : <div>
                        <div className='header'>
                            <div className='status flex-center-ver'>
                                <img src={require('common/img/waiting.png')}></img>
                                <span>您的订单已经成功提交，请等待</span>
                            </div>
                        </div>
                        <OrderList order={order} />
                        <div className='remark'>您还没有绑定桌号哦，点击扫码绑定可以直接下单</div>
                        <div className='move'>
                            <Button className='return2' onClick={() => {
                                this.toOrdering()
                            }}>返回订单</Button>
                            <Button className='return' onClick={() => {
                                this.scanCode()
                            }}>扫码绑定</Button>
                        </div>
                    </div>}
            </div>
        )
    }
}

class OrderList extends React.Component {
    static defaultProps = {
        order: null
    }
    constructor(props) {
        super(props)
    }
    render() {
        let { order } = this.props
        return (
            <div>{order ? <div className='order-info'>
                <div className='title flex-middle'>
                    <span>订单详情：</span>
                    <span></span>{order.id}</div>
                <div className='goods-list'>
                    {order.orderGoodsVos.map((item) => {
                        return (
                            <div key={item.id}>
                                <div className='goods-info'>
                                    <span className='goods-name'>{item.goodsName}</span>
                                    {item.orderGoodsSpecificationVos && item.orderGoodsSpecificationVos.map(litem => (<span key={litem.specificationValueId}>{litem.specificationValueName}</span>))}
                                </div>
                                <div className='goods-bottom flex-middle'>
                                    <span className='price'>￥ {item.totalPrice}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>共{order.totalCount}件商品</div>
                <div className='all-price flex-middle'>
                    <span className='price-name'>总计金额</span>
                    <span className='price-value'>￥ {order.totalPrice}</span>
                </div>
            </div> : ""}</div>
        )
    }
}