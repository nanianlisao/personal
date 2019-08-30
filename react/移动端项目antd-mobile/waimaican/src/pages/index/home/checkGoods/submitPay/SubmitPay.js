import React from 'react'
import { Toast, Button, Modal } from 'antd-mobile';
import { Axios, goPage, parseQueryString } from 'util/util'
import { dinnerPay } from 'util/pay'
import CheckTicket from 'components/checkTicket/CheckTicket' // 购物车底部弹窗
import Constant from 'util/Constant'
import './SubmitPay.css'
const alert = Modal.alert;
export default class SubmitPay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
            ticketId: '',
            discountMent: 0,
            ticketList: [],
            autuPrice: 0
        }
    }
    componentWillMount() {
        document.title = '去支付'

        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var { orderId, amount } = options
        this.setState({ amount, orderId, autuPrice: amount })
        this.orderTicket(orderId) // 根据订单去查询可用的优惠券
    }
    async orderTicket(orderId) {
        let res = await Axios.get(`/order/list/ticket?orderIds=${orderId}`)
        console.log(res)
        this.setState({
            ticketList: res.data.ticketDetailVos,
            amount: res.data.allAmount
        })
    }

    showTicketList() {
        if (this.state.ticketList.length > 0) {
            this.refs.checkTicket.show()
        }
    }
    toUse(item) {
        console.log(item)
        let amount = this.state.amount
        let discountMent = item.totalDiscountAmount; // 实际优惠价格
        let autuPrice = Number(amount - discountMent).toFixed(2)
        this.setState({
            ticketId: item.ticketId,
            discountMent: discountMent,
            autuPrice: autuPrice
        })
        this.refs.checkTicket.hide()
    }
    async pay() {
        let res = await dinnerPay({
            orderId: this.state.orderId,
            ticketId: this.state.ticketId
        })
        Toast.success('支付成功')
        setTimeout(() => {
            localStorage.setItem('selectedTab', 'home')
            goPage(`/index`)
        }, 1000)
    }
    render() {
        let { amount, ticketId, discountMent, ticketList, autuPrice } = this.state
        return (
            <div className="page-submitPay">
                <div className='header'>
                    <div className='status flex-center-ver'>
                        <img src={require('common/img/topay.png')}></img>
                        <span>总计金额：</span>
                        <span style={{ fontSize: '0.26rem', color: '#EC1010', fontWeight: 'normal' }}>￥</span>
                        <span style={{ fontSize: '0.36rem', color: '#EC1010' }}>{amount}</span>
                    </div>
                </div>
                <div className='box flex-middle'>
                    <div>优惠券</div>
                    <div className='youhui flex-center-ver' onClick={() => {
                        this.showTicketList()
                    }}>
                        {ticketId ? <span>￥ {discountMent}</span> : <span>{ticketList.length ? ticketList.length + '张' : '无'}可用优惠券</span>}
                        <img src={require('common/img/arrow_right.png')}></img>
                    </div>
                </div>
                <div className='box flex-middle'>
                    <div>实际支付金额</div>
                    <div>
                        <span style={{ fontSize: '0.26rem', color: '#EC1010' }}>￥</span>
                        <span style={{ color: '#EC1010', fontWeight: 'bold' }}>{autuPrice}</span>
                    </div>

                </div>
                <div className='move'>
                    <Button className='pay button' onClick={() => {
                        this.pay()
                    }}>立即支付</Button>
                </div>
                <div>
                    <CheckTicket ref="checkTicket" ticketList={ticketList} toUse={this.toUse.bind(this)} />
                </div>
            </div>
        )
    }
}