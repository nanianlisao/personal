import React from 'react'
import { withRouter } from 'react-router-dom';
import { CartGoodsStyles } from 'components/goods-style/GoodsStyles'
import './ConfirmOrder.less'
import 'pages/index/mine/ticket/Ticket.less'
import { goPage, parseQueryString, Axios, postMessage, onMessage, checkPhone } from 'util/util'
import { ShoppingPay } from 'util/pay'

import Constant from 'util/Constant'
import { InputItem, Modal, Drawer } from 'antd-mobile';
const alert = Modal.alert
class ConfirmOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            open: false, // 优惠券列表展开
            canUseTicket: [], // 可用的优惠券列表
            takeOutType: 3, // 2:到店 3:外卖 ,
            tab: [{ name: '配送到家', type: 3 }, { name: '到店自提', type: 2 }],
            origin: null, // 1来自购物车 2 来自商品详情页面
            auactPay: 0,
            totalPrice: 0,
            order: null,
            obj: null,
            checkAddr: {}, // 选择的地址
            takePhone: Constant.user_id.phone, // 自提的号码
        }
    }

    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        // 数据来自购物车或者商品详情页 解析不相同 下面通过origin区分 1来自购物车 2 来自商品详情页面
        if (options.order) {
            let order = JSON.parse(decodeURIComponent(options.order))
            this.setState({
                order: order,
                totalPrice: options.totalPrice,
                auactPay: options.totalPrice,
                origin: 1,  // 1来自购物车 2 来自商品详情页面
            }, () => {
                this.getCanUseTicket(1)
            })
            console.log(order)
        } else if (options.obj) {
            let obj = JSON.parse(decodeURIComponent(options.obj))
            this.setState({
                obj: obj,
                totalPrice: options.totalPrice,
                auactPay: options.totalPrice,
                origin: 2,  // 1来自购物车 2 来自商品详情页面
            }, () => {
                this.getCanUseTicket(2)
            })
            console.log(obj)
        }

    }

    // 查询可用的优惠券列表
    async getCanUseTicket(origin = this.state.origin) {
        let { order, obj, takeOutType } = this.state
        let goodsSaleRequests = origin === 1 ? order.map((x) => ({ goodsId: x.goodsId, count: x.quantity })) : [{ goodsId: obj.goodsId, count: obj.quantity }]
        let res = await Axios.get('/ticket/find/canuse/ticket', {
            takeOutType,
            goodsSaleRequests: JSON.stringify(goodsSaleRequests),
            storesId: Constant.data.storesId,
        })
        this.setState({
            canUseTicket: res.data
        })
    }

    // 更改配送方式
    changeTab(type) {
        if (type !== this.state.takeOutType) {
            this.setState({
                takeOutType: type
            }, this.getCanUseTicket)
        }
    }

    toCheckTicket = () => {
        if (this.state.canUseTicket.length > 0) {
            this.onOpenChange()
        }
    }
    // 打开选择优惠券
    onOpenChange(e) {
        this.setState({
            open: !this.state.open
        })
    }

    // 提交订单
    submitOrder = async () => {
        // 配送到家', takeOutType:3 ,  '到店自提', type: 2 
        //  1来自购物车 2 来自商品详情页面
        let { origin, takeOutType, checkAddr, takePhone, order, obj, ticketId } = this.state
        if (takeOutType === 3 && (!checkAddr.telNumber)) {
            alert('提示', '请选择配送地址')
            return
        }
        if (takeOutType === 2 && (!checkPhone(takePhone))) {
            alert('提示', '请输入正确的手机号码')
            return
        }
        let goodsSaleRequestList = origin === 1 ? order.map((x) => ({ goodsId: x.goodsId, count: x.quantity })) : [{ goodsId: obj.goodsId, count: obj.quantity }]
        let options = {
            phone: takeOutType === 3 ? checkAddr.telNumber : takePhone,
            sharedUserId: Constant.data.sharedUserId, // 推广人编号 暂时固定没有
            storesId: Constant.data.storesId,
            takeOutType: takeOutType,
            address: takeOutType === 3 ? checkAddr.provinceName + checkAddr.cityName + checkAddr.countyName + checkAddr.detailInfo : '', // 详细地址
            receiveName: takeOutType === 3 ? checkAddr.userName : '',
            ticketId: ticketId,
            goodsSaleRequestList: goodsSaleRequestList
        }
        try {
            let res = await ShoppingPay(options)
            console.log(res)
            goPage(`/home/goodsDetail/paySuccess?orderId=${res.data.orderIds[0]}`)
        } catch (e) {
            console.log(e)
        }
    }

    handleCheckAddr() {
        postMessage('chooseAddress', 'chooseAddress')
        onMessage('chooseAddress', data => {
            console.log(data)
            this.setState({
                checkAddr: data
            })
        })
    }

    render() {
        let { tab, takeOutType, totalPrice, canUseTicket, obj, order, origin, auactPay, checkAddr, takePhone, totalDiscountAmount } = this.state
        let storesVos = Constant.data.storesVos
        console.log(canUseTicket)
        return (
            <Drawer
                className="my-drawer page-ticket"
                position="bottom"
                style={{ minHeight: document.documentElement.clientHeight }}
                enableDragHandle
                sidebar={
                    <div className="slide-list ticket-list">
                        {canUseTicket.map((item, index) => {
                            return (
                                <div key={index} className="ticket-item flex-between act">
                                    <div className="ticket-name">{item.activeName}</div>
                                    <div className="left">
                                        {item.activeType == 1 ? <div className="price">￥<span>{item.ticketQueryDetailVo.ruleMap.reduce}元</span></div> : <div className="price"><span>{item.ticketQueryDetailVo.ruleMap.sale}折</span></div>}
                                        <div className="font-22 center">（有效期至{item.endTime}）</div>
                                    </div>
                                    <div className="right">
                                        <div className="remark">购物满{item.ticketQueryDetailVo.ruleMap.minConsume ? item.ticketQueryDetailVo.ruleMap.minConsume : 0}元可用</div>
                                        <div className="name">{item.ticketQueryDetailVo.ruleMap.goods && item.ticketQueryDetailVo.ruleMap.goods != "all" ? "（部分商品可用）" : "（全场通用）"}</div>
                                        <div className="btn" onClick={() => {
                                            let auactPay = Number(totalPrice - item.totalDiscountAmount).toFixed(2)
                                            this.setState({
                                                open: false,
                                                ticketId: item.ticketId,
                                                auactPay: auactPay,
                                                totalDiscountAmount: item.totalDiscountAmount.toFixed(2)
                                            })
                                        }}>立即使用</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
                open={this.state.open}
                onOpenChange={this.onOpenChange.bind(this)}
            >
                <main className="page-confirmOrder">
                    <section className="top-tab flex-middle">
                        {tab.map((x, i) => (
                            <div className={["tab-item", takeOutType === x.type ? 'act' : ''].join(' ')} key={i} onClick={this.changeTab.bind(this, x.type)}>
                                <span>{x.name}</span>
                            </div>
                        ))}
                    </section>
                    <section className="connect">
                        {takeOutType === 3 ? <div onClick={() => {
                            this.handleCheckAddr()
                        }}>
                            {checkAddr.userName ? <div className="connect-addr-val">
                                <div className="val-header flex-center"><img src={require('common/img/check_addr.png')} alt="" /> {checkAddr.userName}<span className="phone">{checkAddr.telNumber}</span></div>
                                <div className="val-info">{checkAddr.provinceName + checkAddr.cityName + checkAddr.countyName + checkAddr.detailInfo}</div>
                            </div> : <div className="connect-addr flex-center" >
                                    <img src={require('common/img/check_addr.png')} alt="" />
                                    <span>请选择配送地址</span>
                                </div>}
                        </div> : <div>
                                <div className="connect-addr-val">
                                    <div className="val-header flex-center"><img src={require('common/img/order_addr.png')} alt="" /> {storesVos.name}<span className="phone">{storesVos.tel}</span></div>
                                    <div className="val-info">{storesVos.address}</div>
                                </div>
                                <div className="connect-phone flex-center">
                                    <div className="flex-center">
                                        <span>联系电话：</span>
                                        <InputItem className="input-phone" type="number" value={takePhone} maxLength={11} onChange={(e) => {
                                            this.setState({
                                                takePhone: e
                                            })
                                        }}></InputItem></div>
                                    <div className="one-keys" onClick={() => {
                                        postMessage('phone', 'phone')
                                        onMessage('phone', data => {
                                            console.log(data)
                                            Constant.user_id.phone = data
                                            this.setState({
                                                takePhone: data
                                            })
                                        })
                                    }}>一键获取</div>
                                </div>
                            </div>}
                    </section>
                    <section className="goods-list">
                        {/*  1来自购物车 解析obj 2 来自商品详情页面 */}
                        {origin === 1 ? <div>
                            {order.map((x, i) => (
                                <CartGoodsStyles
                                    key={i}
                                    spec={<div>{x.goodsDetailVo.goodsSpecificationDetailVoList && x.goodsDetailVo.goodsSpecificationDetailVoList.map((y, z) => (
                                        <span className="mr-10" key={z}>{y.specificationName}:{y.specificationValueName}</span>
                                    ))}</div>}
                                    fileId={x.goodsDetailVo.imgFileId}
                                    name={x.goodsDetailVo.goodsTemplateName}
                                    price={x.price}
                                    quantity={x.quantity}
                                />
                            ))}
                        </div> : <div>
                                <CartGoodsStyles
                                    spec={obj.specStr}
                                    fileId={obj.imgFileId}
                                    name={obj.name}
                                    price={obj.price}
                                    quantity={obj.quantity}
                                />
                            </div>}
                    </section>
                    <section className="check-ticket flex-between">
                        <span>优惠力度：</span>
                        {totalDiscountAmount ? <span className="act" onClick={this.toCheckTicket}>-￥{totalDiscountAmount}</span> : canUseTicket.length === 0 ? <span className="act">暂无可用优惠券</span> :
                            <span className="act" onClick={this.toCheckTicket}>{canUseTicket.length}张可用优惠券</span>
                        }
                    </section>
                    <section className="footer-wrap model-footer">
                        <div className="footer flex-between">
                            <div className="footer-btn price">合计金额：¥ {auactPay}</div>
                            <div className="footer-btn submit-order" onClick={this.submitOrder}>提交订单</div>
                        </div>
                    </section>
                </main>
            </Drawer>
        )
    }
}

export default withRouter(ConfirmOrder)