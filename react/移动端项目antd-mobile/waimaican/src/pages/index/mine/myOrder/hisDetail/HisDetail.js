import React from 'react'
import { Modal, InputItem, Toast, List } from 'antd-mobile';
import { Axios, goPage } from 'util/util'
import 'pages/index/ordering/orderDetail/OrderDetail.css'
export default class HisDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
        };
    }
    componentWillMount() {
        document.title = '订单详情'
        let item = localStorage.getItem('hisOrderItem')
        this.setState({
            order: JSON.parse(item)
        })
        console.log(JSON.parse(item))
    }

    async moreOrder(item) {
        try {
            let res = await Axios.get(`/order/double/${item.id}`)
            console.log(res)
            goPage(`/checkGoods?id=${item.storesId}&cartId=${res.data}`)
        } catch (e) {
            console.log(e)
            goPage(`/checkGoods?id=${item.storesId}`)
        }
    }

    render() {
        let order = this.state.order
        return (
            <div className="page-orderDetail">
                <div className='header'>
                    <div className='flex-middle'>
                        <div className='shop-name'>{order.storesVo.name}</div>
                    </div>
                    <div className='addr'>{order.storesVo.address}</div>
                </div>
                <div className='content'>{order.orderQueryVos.map((item, index) => {
                    return (
                        <OrderInfo
                            key={index}
                            item={item}
                            order={order}
                            moreOrder={this.moreOrder.bind(this)}
                        />
                    )
                })}</div>
                <div className='footer' style={{ paddingRight: '0.35rem' }}>
                    <div className='flex-middle'>
                        <div style={{ flex: '1' }}>支付金额：
      <span style={{ color: '#EC1010' }}>￥ {order.actualPayment}</span>
                        </div>
                        <div style={{ fontSize: '0.24rem', color: '#666' }}>已优惠：￥{order.discountAmount}</div>
                    </div>
                </div>
            </div>
        )
    }
}

class OrderInfo extends React.Component {
    static defaultProps = {
        item: null
    }
    constructor(props) {
        super(props)
    }
    render() {
        let { item, order } = this.props
        return (
            <div className='order-item'>{order ? <div>
                <div className='order-header flex-middle'>
                    <div className='owner flex-center-ver'>
                        <img src={item.avatarUrl}></img>
                        <span>{item.nickName}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {item.state == 2 || item.state == 1 ? <div className='order-status'>订单准备中</div> : ""}
                        {item.state == 3 ? <div className='order-status'>订单已完成</div> : ""}
                        <div style={{ color: "#FC612A" }}>桌号：{item.tableName}</div>
                    </div>
                </div>
                <div className='order-content'>
                    <div className='title'>订单详情：</div>
                    {item.orderGoodsVos.map((litem, index) => {
                        return (
                            <div style={{ marginBottom: '0.1rem' }} key={litem.id}>
                                <div style={{ paddingRight: '0.4rem' }}>
                                    <span style={{ marginRight: '0.28rem' }}>{litem.goodsName}</span>
                                    {litem.orderGoodsSpecificationVos && litem.orderGoodsSpecificationVos.map((sitem) => (<span style={{ color: "#999" }} key={sitem.specificationId}>{sitem.specificationValueName}</span>))}

                                </div>
                                <div className='flex-middle'>
                                    <span style={{ color: "#EC1010" }}>￥ {litem.price}</span>
                                    <span>x{litem.quantity}</span>
                                </div>
                            </div>
                        )
                    })}
                    <div>共{item.totalCount}件商品</div>
                    <div className='all-count flex-middle'>
                        <span style={{ fontWeight: "bold" }}>总计金额</span>
                        <span style={{ color: "#EC1010" }}>￥ {item.totalPrice}</span>
                    </div>
                </div>
                <div className='order-code'>
                    <div className='flex-middle'>
                        <span>交易号：{order.id}</span>
                        <span style={{ fontSize: '0.24rem' }}>{order.addTime}</span>
                    </div>
                    <div className='flex-middle'>
                        <span>订单号：{item.id}</span>
                        <span style={{ fontSize: '0.24rem' }}>{item.addTime}</span>
                    </div>
                </div>
                <div className='order-more' onClick={() => {
                    this.props.moreOrder(item)
                }}>再来一单</div>
            </div> : ""}</div>
        )
    }
}