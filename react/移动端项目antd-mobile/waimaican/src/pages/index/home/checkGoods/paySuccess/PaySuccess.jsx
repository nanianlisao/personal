import React from 'react'
import { Modal, Button } from 'antd-mobile';
import { Axios, goPage, scanCode, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
import './PaySuccess.less'
const alert = Modal.alert;
export default class PaySuccess extends React.Component {
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
        document.title = '支付完成'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.setState({
            orderId: options.orderId
        })
        this.orderDetail(options.orderId)
    }

    // 获取订单信息
    async orderDetail(orderId) {
        try {
            let res = await Axios.get(`order/detail/${orderId}`)
            let order = res.data.orderAndGoodsVos[0]
            order.orderGoodsVos.map(x => {
                x.totalPrice = Number(x.price * x.quantity).toFixed(2)
            })
            order.storesVo = res.data.storesVo
            order.totalCount = order.orderGoodsVos.reduce((prev, next) => prev + next.quantity, 0)
            order.normalQuantity = order.totalCount
            order.actualPayment = Number(order.amount - order.totalDiscounts).toFixed(2)

            order.allDiscounts = order.totalDiscounts
            this.setState({
                order: order
            })
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let { order } = this.state
        return (
            <div className="page-paySuccess">
                <div className="header">订单支付成功，请等待送餐！</div>
                <OrderList
                    order={order}
                />
                <div className="footer">
                    <Button className="btn" activeClassName="hover-btn" onClick={()=>{
                        goPage('/index')
                    }}>返回首页</Button>
                    <Button className="btn" activeClassName="hover-btn" onClick={()=>{
                        goPage(`/waimaiOrderDetail?item=${encodeURIComponent(JSON.stringify(order))}`)
                    }}>查看订单</Button>
                </div>
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
            <div>{order ? <div className='order-info shadow-box'>
                <div className='title flex-middle'>
                    <span>订单详情：</span></div>
                <div className='goods-list'>
                    {order.orderGoodsVos.map((item) => {
                        return (
                            <div key={item.id}>
                                <div className='goods-info'>
                                    <span className='goods-name'>{item.goodsName}</span>
                                    {item.orderGoodsSpecificationVos && item.orderGoodsSpecificationVos.map(litem => (<span key={litem.specificationValueId}>{litem.specificationValueName}</span>))}
                                </div>
                                <div className='goods-bottom flex-middle'>
                                    <span className='price'>￥ {item.price}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>共{order.normalQuantity}件商品</div>
                <div className='remark flex-middle'>
                    <span className='price-name'>优惠金额</span>
                    <span className='price-value'>-￥{order.allDiscounts}</span>
                </div>
                <div className='remark flex-middle'>
                    <span className='price-name'>配送费</span>
                    <span className='price-value'>￥{order.orderTakeOutVo.deliveryExpense}</span>
                </div>
                <div className='remark flex-middle'>
                    <span className='price-name'>包装费</span>
                    <span className='price-value'>￥{order.orderTakeOutVo.allPackingExpense}</span>
                </div>
                <div className='all-price flex-middle'>
                    <span className='price-name'>总计金额</span>
                    <span className='price-value'>￥ {order.actualPayment}</span>
                </div>
                <div className="pay-code flex-middle">
                    <span className="code">订单号：{order.id}</span>
                    <span className="date">{order.addTime}</span>
                </div>
            </div> : ""}</div>
        )
    }
}
