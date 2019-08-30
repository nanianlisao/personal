import React from 'react'
import { postMessage, parseQueryString } from 'util/util'
import './WaimaiOrderDetail.less'
export default class SubmitOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount() {
        document.title = '订单详情'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var item = JSON.parse(decodeURIComponent(options.item))
        this.setState({
            item: item
        })
        console.log(item)
    }

    render() {
        let { item } = this.state
        return (
            <div className="page-waimaiOrderDetail">
                <div className="top">
                    {item.state == 3 ? <div className="status">订单已完成!</div> :
                        <div>
                            {item.orderTakeOutVo.state == 1 ? <div className="status">等待商家接单中！</div> : ""}
                            {item.orderTakeOutVo.state == 2 ? <div className="status">店家配餐中，请耐心等待！</div> : ""}
                            {item.orderTakeOutVo.state == 3 ? <div className="status">已安排骑手,很快送达哦！</div> : ""}
                        </div>
                    }
                    <div className="shop-name">{item.storesVo.name}</div>
                    <div className="shop-addr">{item.storesVo.address}</div>
                </div>
                <div className='content'>
                    <div className="addr-wrap shadow-box">
                        <div className="addr-header">
                            <span>{item.orderTakeOutVo.receiveName}</span>
                            <span>{item.orderTakeOutVo.receivePhone}</span>
                        </div>
                        <div className="addr-info">
                            <div className="info-title">配送地址：</div>
                            <div>{item.orderTakeOutVo.receiveAddress} </div>
                        </div>
                    </div>
                    <OrderList order={item} />
                </div>

                <div className='footer flex-middle'>
                    <div className="footer-item" onClick={() => {
                        if (item.storesVo.tel) {
                            postMessage('callphone', item.storesVo.tel)
                        }
                    }}>联系店家</div>
                    {item.orderTakeOutVo.state == 3 ? <div className="footer-item" onClick={() => {
                        if (item.orderTakeOutVo.sendPhone) {
                            postMessage('callphone', item.orderTakeOutVo.sendPhone)
                        }
                    }}>联系骑手</div> : ""}
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