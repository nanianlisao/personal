import React from 'react'
import { Modal, InputItem, Toast, List } from 'antd-mobile';
import { Axios, goPage, scanCode } from 'util/util'
import './OrderDetail.css'
export default class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
        };
    }
    componentWillMount() {
        let item = localStorage.getItem('orderingItem')
        this.setState({
            order: JSON.parse(item)
        })
        console.log(JSON.parse(item))
    }

    // 去加餐
    goCheckGoods() {
        let item = this.state.order
        goPage(`/checkGoods?scene=${item.storesVo.id},${item.tableId}&noquer=true`)
    }

    // 去付款
    goPay() {
        let item = this.state.order
        goPage(`/submitPay?orderId=${item.orderId}&amount=${item.totalPrice}`)
    }

    // 扫码绑定
    async scanCode(e) {
        let item = this.state.order
        let res = await scanCode(item.storesId, item.id)
        setTimeout(() => {
            this.props.history.goBack()
        }, 1000)
    }

    async cancleOrder() {
        let res = await Axios.post(`/order/${this.state.order.id}/cancel`)
        Toast.success('取消成功！')
        setTimeout(() => {
            this.props.history.goBack()
        }, 1000)
    }

    render() {
        let order = this.state.order
        return (
            <div className="page-orderDetail">
                <div className='header'>
                    <div className='flex-middle'>
                        <div className='shop-name'>{order.storesVo.name}</div>
                        <div className='desk-code'>
                            <img src={require(`common/img/${order.tableId ? "desk_bg2.png" : "desk_bg1.png"}`)}></img>
                            <span className={[order.tableId ? "" : "grey"].join(" ")}>桌号：{order.tableId ? order.tableName : "暂无"}</span>
                        </div>
                    </div>
                    <div className='addr'>{order.storesVo.address}</div>
                </div>
                {order.tableOrder
                    ? <div className='content'>{order.tableOrder.map((item, index) => {
                        return (
                            <OrderInfo key={index} order={item} />
                        )
                    })}</div>
                    : <div className='content'><OrderInfo order={order} /></div>}
                {order.state == 2 || order.state == 3 ? <div className='jiaoyi flex-middle' >
                    <span>交易号：{order.payId}</span>
                    <span style={{ fontSize: '0.24rem', color: '#999' }}>{order.payTime}</span>
                </div> : ""}
                {order.state == 3 ? <div className='finish'>
                    <div className='remark'>支付金额：
    <span style={{ color: '#EC1010' }}>￥ {order.totalPrice}</span>
                    </div>
                    <div className='more-button' bindtap='moreOrder'>再来一单</div>
                </div> : ""}
                {!order.tableId ? <div className='cancle' onClick={() => {
                    this.cancleOrder()
                }}>
                    <div className='cancle-button'>取消订单</div>
                </div> : ""}
                <div className='footer'>
                    {!order.tableId ? <div className='noscan flex-middle'>
                        <div>待绑定桌号</div>
                        <div className='footer-btn' style={{ background: '#FCA62A' }} onClick={()=>{
                            this.scanCode()
                        }}>扫码绑定</div>
                    </div> : ""}
                    {order.tableOrder ? <div className='flex-middle' >
                        <div style={{ flex: '1' }}>合计金额：
      <span style={{ color: '#EC1010' }}>￥ {order.totalPrice}</span>
                        </div>
                        <div className='footer-btn' style={{ background: '#FCA62A' }} onClick={() => {
                            this.goCheckGoods()
                        }}>去加餐</div>
                        <div className='footer-btn' style={{ background: '#FC612A' }} onClick={() => {
                            this.goPay()
                        }}>去付款</div>
                    </div> : ""}
                    {order.state == 2 ? <div className='haspay'>已付款</div> : ""}
                </div>
            </div>
        )
    }
}

class OrderInfo extends React.Component {
    static defaultProps = {
        order: null
    }
    constructor(props) {
        super(props)
    }
    render() {
        let { order } = this.props
        return (
            <div className='order-item'>{order ? <div >
                <div className='order-header flex-middle'>
                    <div className='owner flex-center-ver'>
                        <img src={order.avatarUrl}></img>
                        <span>{order.nickName}</span>
                    </div>
                    {order.state == 2 || order.state == 1 && order.tableId ? <div className='order-status'>订单准备中</div> : ""}
                    {!order.tableId ? <div className='order-status'>待绑定桌号</div> : ""}
                    {order.state == -1 ? <div className='order-status'>订单已关闭</div> : ""}
                    {order.state == 3 && order.tableId ? <div className='order-status'>订单已完成</div> : ""}
                </div>
                <div className='order-content'>
                    <div className='title'>订单详情：</div>
                    {order.orderGoodsVos.map((litem, index) => {
                        return (
                            <div style={{ marginBottom: '0.10rem' }} key={litem.id}>
                                <div style={{ paddingRight: '0.40rem' }}>
                                    <span style={{ marginRight: '0.28rem' }}>{litem.goodsName}</span>
                                    {litem.orderGoodsSpecificationVos && litem.orderGoodsSpecificationVos.map(sitem => (<span style={{ color: '#999' }} key={sitem.specificationId}>{sitem.specificationValueName}</span>))}
                                </div>
                                <div className='flex-middle'>
                                    <span style={{ color: "#EC1010" }}>￥ {litem.price}</span>
                                    <span>x{litem.quantity}</span>
                                </div>
                            </div>
                        )
                    })}
                    <div>共{order.totalCount}件商品</div>
                    <div className='all-count flex-middle'>
                        <span style={{ fontWeight: "bold" }}>总计金额</span>
                        <span style={{ color: "#EC1010" }}>￥ {order.totalPrice}</span>
                    </div>
                </div>
                <div className='order-footer flex-middle'>
                    <span>订单号：{order.id}</span>
                    <span style={{ color: "#999", fontSize: '0.24rem' }}>{order.addTime}</span>
                </div>
            </div> : ""}</div>
        )
    }
}