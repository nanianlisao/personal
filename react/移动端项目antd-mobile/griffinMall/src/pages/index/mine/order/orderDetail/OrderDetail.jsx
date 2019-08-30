import React from 'react'
import { OrderGoodsStyles } from 'components/goods-style/GoodsStyles'
import { withRouter } from 'react-router-dom';
import './OrderDetail.less'
import { goPage, Axios, postMessage } from 'util/util'
import { ShoppingPayAgain } from 'util/pay'
import { Toast, Modal } from 'antd-mobile';
import Constant from 'util/Constant';

let Timer = null
class OrderDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            showModal: false,
            state: 1,
            item: {},
            //  配送到家', takeOutType:3 ,  '到店自提', type: 2
            topContentArr: [
                {
                    state: 2, img: require('common/img/detail_status1.png'),
                    title: '您的订单准备中，等待配送！', width: 1.19,
                    remark: '快递名称   单号18746576390073',
                    takeOutType: 3,
                }, {
                    state: -1, img: require('common/img/detail_status2.png'),
                    title: '订单已关闭！', width: 1.09,
                    remark: '如您需要，请重新下单！',
                }, {
                    state: 4, img: require('common/img/detail_status3.png'),
                    title: '订单已成功！', width: 1.13,
                    remark: '谢谢惠顾！',
                }, {
                    state: 2, img: require('common/img/detail_status4.png'),
                    title: '您的订单准备中，等待到店自提！', width: 1.05,
                    remark: '',
                    takeOutType: 2,
                }, {
                    state: 1, img: require('common/img/detail_status5.png'),
                    title: '等待用户付款', width: 1.28,
                    remark: '剩余0小时0分0秒自动关闭',
                }, {
                    state: 3, img: require('common/img/detail_status6.png'),
                    title: '等待您的评价！', width: 1.11,
                    remark: '谢谢惠顾！',
                },
            ]
        }
    }

    componentWillMount() {
        this.getOrderDetail()
    }

    // 查询订单详情
    async getOrderDetail() {
        let id = this.props.match.params.id
        let res = await Axios.get(`/order/list/shopping/my`, {
            orderId: id
        })
        console.log(res)
        this.setState({
            item: res.data.items[0]
        })
    }

    // 再次付款
    async payAgain() {
        let res = await ShoppingPayAgain(this.state.item.id)
        console.log(res)
    }

    // 取消订单
    async cancelOrder() {
        let res = await Axios.post(`/order/${this.state.item.id}/cancel`, {}, true)
        console.log(res)
        Toast.success('订单已取消')
        setTimeout(() => {
            this.getOrderDetail()
        }, 500)

    }
    // 联系客服
    async callServiceTel() {
        if (!Constant.data.serviceTel) {
            let res = await Axios.get('/appService/find')
            console.log(res)
            Constant.data.serviceTel = res.data.serviceTel
        }
        postMessage('callphone', Constant.data.serviceTel)
    }

    // 查看取货码
    async showModal() {
        let res = await Axios.get(`/order/pick/goods/qr/code/${this.state.item.id}`)
        console.log(res)
        this.setState({
            oneQrcode: res.data.oneQrcode,
            twoQrcode: res.data.twoQrcode,
            code: this.state.item.id,
            showModal: true,
        })
    }

    // 重新购买
    async buyAgain() {
        let res = await Axios.get(`/order/double/shopping/${this.state.item.id}`, {}, true)
        Toast.success('加入购物车成功')
        setTimeout(() => {
            localStorage.setItem('selectedTab', 'cart')
            goPage('/index')
        }, 500)
    }

    async sureOrder() {
        let res = await Axios.post(`/order/${this.state.item.id}/receive`, {}, true)
        Toast.success('订单已确认收货')
        setTimeout(() => {
            this.getOrderDetail()
        }, 500)
    }



    componentWillUnmount() {
        if (Timer) {
            clearInterval(Timer)
        }
    }


    render() {
        let { topContentArr, item, imgUrl } = this.state
        let topContent = topContentArr.find((x) => {
            if (x.state == 2) {
                return x.state === item.state && x.takeOutType === item.takeOutType
            } else {
                return x.state === item.state
            }
        })
        // 配送中 配送到家
        if (item.state == 2 && item.takeOutType == 3) {
            if (item.orderTakeOutVo.sendType == 2) { // 快递配送
                topContent.remark = item.orderTakeOutVo.expressCompany + '   ' + item.orderTakeOutVo.expressNumber
            } else if (item.orderTakeOutVo.sendType == 1) { // 骑手配送
                topContent.remark = '骑手配送中  骑手电话' + item.orderTakeOutVo.sendPhone
            } else {
                topContent.remark = '暂未发货，请耐心等待'
            }
            if (item.orderQueryVoState == 8) {
                topContent.title = '您的订单已发出，请耐心等待'
            }
        }

        // 待付款 加一个付款倒计时
        if (item.state == 1) {
            clearInterval(Timer)
            Timer = setInterval(() => {
                let addTime = new Date(item.addTime.replace(/-/g, '/')).getTime() + 2 * 60 * 60 * 1000
                let allTime = (addTime - Date.now()) / 1000
                if (allTime <= 0) {   // 倒计时为0时自动更改订单状态， 后台定时任务存在时间差
                    this.cancelOrder()
                    clearInterval(Timer)
                    return
                }
                let hh = parseInt(allTime / 60 / 60)
                let mm = parseInt(allTime / 60 % 24)
                let ss = parseInt(allTime % 60)
                topContent.remark = `剩余${hh}小时${mm}分${ss}秒自动关闭`
                this.setState({
                    topContent
                })
            }, 1000)
        }

        if (!item.id) {
            return (<div></div>)
        }


        return (
            <main className="page-orderDetail">
                <section className="top-content flex-between">
                    <div>
                        <div className="title">{topContent.title}</div>
                        <div className="remark">{topContent.remark}</div>
                    </div>
                    <div style={{
                        width: topContent.width + 'rem',
                        height: topContent.width + 'rem',
                    }}>
                        <img src={topContent.img} alt="" />
                    </div>
                </section>
                {item.takeOutType == 3
                    ? <section className="addr flex-center">
                        <div className="addr-left"><img src={require('common/img/order_addr.png')} alt="" /></div>
                        <div>
                            <div className="shop-name">{item.orderTakeOutVo.receiveName}<span>{item.orderTakeOutVo.receivePhone}</span></div>
                            <div className="addr-info">{item.orderTakeOutVo.receiveAddress}</div>
                        </div>
                    </section>
                    : <section className="addr flex-center">
                        <div className="addr-left"><img src={require('common/img/order_addr.png')} alt="" /></div>
                        <div>
                            <div className="shop-name">{item.storesVo.name}<span>{item.storesVo.tel}</span></div>
                            <div className="addr-info">{item.storesVo.address}</div>
                        </div>
                    </section>}
                <section className="goods-list">
                    {item.orderGoodsVos && item.orderGoodsVos.map((x, i) => {
                        let redMark = ''
                        redMark += x.refundingQuantity ? x.refundingQuantity + '件退款中' : ''
                        redMark += x.refundQuantity ? x.refundQuantity + '已退' : ''
                        return (
                            <OrderGoodsStyles
                                onClick={() => {
                                    goPage(`/home/goodsDetail?id=${x.goodsTemplateId}`)
                                }}
                                reply={() => {
                                    goPage(`/mine/order/refund?item=${encodeURIComponent(JSON.stringify(x))}`)
                                }}
                                key={i}
                                redMark={redMark}
                                showReply={item.state == 2 && x.quantity > Number(x.refundQuantity) + Number(x.refundingQuantity)}
                                fileId={x.imgFileId}
                                name={x.goodsName}
                                price={x.price}
                                quantity={x.quantity}
                                spec={<div>{x.orderGoodsSpecificationVos && x.orderGoodsSpecificationVos.map((y, z) => (
                                    <span className="mr-10" key={z}>{y.specificationName}:{y.specificationValueName}</span>
                                ))}</div>}
                            />
                        )
                    })}
                </section>
                <section className="price-info">
                    <div className="price-info-item flex-between border2"><span>商品总价</span><span>¥ {item.amount}</span></div>
                    <div className="price-info-item flex-between border2"><span>优惠金额</span><span>-¥ {item.allDiscounts}</span></div>
                    <div className="price-info-item flex-between total"><span>实付金额</span><span>¥ {Number(item.amount - item.allDiscounts).toFixed(2)}</span></div>
                </section>

                <section className="order-info">
                    <div className="order-info-item header border2">订单号：{item.id}</div>
                    <div className="order-info-item border2">交易单号：{item.payId ? item.payId : '无'}</div>
                    <div className="order-info-item border2">下单时间：{item.addTime}</div>
                    <div className="order-info-item border2">支付时间：{item.payTime ? item.payTime : '无'}</div>
                </section>
                <section className="footer-wrap">
                    <div className="footer flex-between">
                        {/* 配送到家', takeOutType:3 ,  '到店自提', type: 2  */}
                        {item.state == 1 ? <div className="footer-btn" onClick={() => {
                            this.cancelOrder()
                        }}>取消订单</div> : ""}
                        {item.state == 1 ? <div className="footer-btn" onClick={() => {
                            this.payAgain()
                        }}>立即付款</div> : ""}

                        {item.state == 2 || item.state == 4 ? <div className="footer-btn" onClick={() => {
                            this.callServiceTel()
                        }}>联系客服</div> : ""}

                        {item.state == 2 && item.takeOutType == 3 ? <div className="footer-btn" onClick={() => {
                            this.sureOrder()
                        }}>确认收货</div> : ""}

                        {item.state == 3 ? <div className="footer-btn" onClick={() => {
                            localStorage.setItem('orderDetail', JSON.stringify(item))
                            goPage('/mine/order/evaluate')
                        }}>立即评价</div> : ""}
                        {item.state == -1 ? <div className="footer-btn" onClick={() => {
                            this.buyAgain()
                        }}>重新购买</div> : ""}

                        {item.state == 2 && item.takeOutType == 2 ? <div className="footer-btn" onClick={() => {
                            this.showModal()
                        }}>查看取货码</div> : ""}
                    </div>
                    <Modal
                        style={{ width: 'auto' }}
                        visible={this.state.showModal}
                        onClose={() => { this.setState({ showModal: false }) }}
                        transparent
                        title=""
                    >
                        <div style={{ width: '5rem' }}>
                            <img src={imgUrl + this.state.twoQrcode} alt="" style={{ height: '5rem' }} />
                            <img src={imgUrl + this.state.oneQrcode} alt="" style={{ height: '2rem', margin: '0.1rem 0' }} />
                            <span>订单号：{this.state.code}</span>
                        </div>
                    </Modal>
                </section>

            </main>
        )
    }
}

export default withRouter(OrderDetail)