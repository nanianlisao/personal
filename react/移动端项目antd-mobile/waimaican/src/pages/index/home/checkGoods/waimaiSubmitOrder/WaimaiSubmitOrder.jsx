import React from 'react'
import { Modal, InputItem, Toast, List } from 'antd-mobile';
import { Axios, goPage, checkPhone, postMessage, onMessage, parseQueryString } from 'util/util'
import CheckTicket from 'components/checkTicket/CheckTicket' // 购物车底部弹窗
import Constant from 'util/Constant'
import { payTakeOut } from 'util/pay'
import './WaimaiSubmitOrder.less'
const alert = Modal.alert;
export default class SubmitOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            timer: false,
            ticketList: [],
            storesId: '', // 店铺id
            shoppingCartId: '', // 购物车id
            totalPrice: 0,
            totalCount: 0,
            shoppingCartGoodsVoList: [],
        }
    }
    componentWillMount() {
        document.title = '提交订单'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)

        var { shoppingCartId, storesId, storesName, allPackingExpense, deliveryExpense } = options
        let shoppingCartGoodsVoList = localStorage.getItem('shoppingCartGoodsVoList')
        this.setState({
            shoppingCartId,
            storesId,
            allPackingExpense,
            deliveryExpense,
            storesName: decodeURIComponent(storesName),
            shoppingCartGoodsVoList: JSON.parse(shoppingCartGoodsVoList),
        }, () => {
            this._watchCount(JSON.parse(shoppingCartGoodsVoList))
            this.findcanuseticket()
        })
    }

    // 查询可用的优惠券
    async findcanuseticket() {
        let res = await Axios.get('/ticket/find/canuse/take/out', {
            shoppingCartId: this.state.shoppingCartId,
            storesId: this.state.storesId,
            userTakeOutAddressId: Constant.data.userAddress.id,
            takeOutType: 3,
        })
        console.log(res)
        this.setState({
            ticketList: res.data
        })
    }


    toUse(item) {
        console.log(item)
        let amount = this.state.totalPrice
        let discountMent = item.totalDiscountAmount; // 实际优惠价格
        let autuPrice = Number(amount - discountMent).toFixed(2)
        this.setState({
            ticketId: item.ticketId,
            discountMent: discountMent,
            autuPrice: autuPrice
        })
        this.refs.checkTicket.hide()
    }

    _watchCount(shoppingCartGoodsVoList) {
        let totalPrice = 0,
            totalCount = 0
        shoppingCartGoodsVoList.map(x => {
            totalPrice = Number(Number(totalPrice) + Number(x.price * x.quantity)).toFixed(2)
            totalCount += x.quantity
            x.totalPrice = Number(x.price * x.quantity).toFixed(2)
        })
        totalPrice = Number(Number(totalPrice) + Number(this.state.allPackingExpense) + Number(this.state.deliveryExpense)).toFixed(2)
        this.setState({
            shoppingCartGoodsVoList,
            totalPrice,
            autuPrice: totalPrice,
            totalCount
        })
    }


    async toPay() {
        if (this.state.timer) {
            return
        }
        this.state.timer = true
        let {
            message,
            shoppingCartId,
            storesId,
            ticketId
        } = this.state
        try {
            let res = await payTakeOut({
                phone: Constant.data.userAddress.receivePhone,
                "remark": message,
                "shoppingCartId": shoppingCartId,
                "storesId": storesId,
                "ticketId": ticketId,
                "takeOutType": 3,
                userTakeOutAddressId: Constant.data.userAddress.id,
            })
            console.log(res)
            this.state.timer = false
            Toast.success('支付成功')
            setTimeout(() => {
                goPage(`/paySuccess?orderId=${res.data.orderIds[0]}`)
            }, 1000)
        } catch (e) {
            console.log(e)
            this.state.timer = false
            if (e.res) {
                if (e.res.retCode == 12289 || e.res.retCode == 12290 || e.res.retCode == 12291) {
                    alert('提示', e.res.data.resultMsg, [
                        {
                            text: '确定', style: { color: '#EA5520' }, onPress: () => {
                                this.props.history.goBack()
                            }
                        },
                    ])
                } else if (e.res && e.res.retMsg) {
                    alert('提示', e.res.retMsg, [
                        {
                            text: '确定', style: { color: '#EA5520' }
                        },
                    ])
                }

            }
        }
        this.state.timer = false
    }

    showTicketList() {
        if (this.state.ticketList.length > 0) {
            this.refs.checkTicket.show()
        }
    }

    render() {
        let { shoppingCartGoodsVoList, autuPrice, totalCount, ticketList, ticketId, discountMent, storesName, allPackingExpense, deliveryExpense } = this.state
        return (
            <div className="page-waimaiSubmitOrder">
                <div className='content'>
                    <div className="content-item shadow-box">
                        <div className="title">就餐方式:</div>
                        <div className="val-right">外卖送餐</div>
                    </div>
                    <div className="content-item shadow-box">
                        <div className="title">配送门店</div>
                        <div className="val-right">{storesName}</div>
                    </div>
                    <div className="addr-wrap shadow-box">
                        <div className="addr-header">
                            <span>{Constant.data.userAddress.receiveName}</span>
                            <span>{Constant.data.userAddress.receivePhone}</span>
                        </div>
                        <div className="addr-info">
                            <div className="info-title">配送地址：</div>
                            <div>{Constant.data.userAddress.roughAddress + Constant.data.userAddress.address} </div>
                        </div>
                    </div>
                    <div className='order-wrap little-box shadow-box'>
                        <div className='order-title'>订单详情：</div>
                        <div className='order-info'>
                            {shoppingCartGoodsVoList.map((item, index) => {
                                return (
                                    <div className='order-info-people' key={index}>
                                        <div className='people-avatar'>
                                            <img src={item.avatarUrl} mode='aspectFill'></img>
                                        </div>
                                        <div className='goods-list'>
                                            <div className='goods-item'>
                                                <div className='goods-info'>
                                                    <span className='goods-detail'>{item.goodsDetailVo.goodsTemplateName}</span>
                                                    <span className='sku'>
                                                        {item.goodsDetailVo.goodsSpecificationDetailVoList.map((litem) => (<span key={litem.specificationValueId}>{litem.specificationValueName}</span>))}</span>
                                                </div>
                                                <div className='goods-footer flex-middle'>
                                                    <div className='goods-price'>￥ {item.totalPrice}</div>
                                                    <div className='goods-move flex-middle'>
                                                        <span className="num">*{item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='order-footer'>共{totalCount}件商品</div>
                    </div>

                    <div className="content-item shadow-box" onClick={() => {
                        this.showTicketList()
                    }}>
                        <div className="title">优惠券</div>
                        <div className="right">
                            {ticketId ? <span>优惠{discountMent}元</span> : <span>{ticketList.length > 0 ? '有' + ticketList.length + '张可用' : '暂无可用优惠券'}</span>}
                            <img src={require("common/img/arrow_right.png")} mode="aspectFit"></img>
                        </div>
                    </div>

                    <div className='remark little-box flex-middle shadow-box'>
                        <span>备注:</span>
                        <InputItem className="input" onChange={(e) => {
                            this.setState({
                                message: e
                            })
                        }}></InputItem>
                    </div>
                </div>
                <div>
                    <CheckTicket ref="checkTicket" ticketList={ticketList} toUse={this.toUse.bind(this)} title="外卖优惠专享" />
                </div>

                <div className='footer flex-middle'>
                    <div className='all-price'>
                        <span>合计金额</span>
                        <span className='price-count'>￥ {autuPrice}</span>
                    </div>
                    <div className="more-info">
                        <span>配送费：{deliveryExpense}元</span>
                        <span>包装费：{allPackingExpense}元</span>
                    </div>
                    <div className='submit-order' onClick={() => {
                        this.toPay()
                    }}>去支付</div>
                </div>
            </div>
        )
    }
}