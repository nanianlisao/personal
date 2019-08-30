import React from 'react'
import './Ordering.css'
import { Axios, goPage, goCheckGoodsByScan, scanCode } from 'util/util'
import NoToken from 'components/noToken/NoToken'
const stepLeft = 1.2;
const stepRight = 4.95;
class Ordering extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            waimaiOrderList: [],
            token: localStorage.getItem('token'),
            kindType: null,
            step: stepLeft,
            tabArr: [{
                name: "点餐订单",
                left: stepLeft,
            }, {
                name: "外卖订单",
                left: stepRight,
            }]
        };
    }
    componentDidMount() {
        document.title = '订单'
        this.getOrderList()
    }

    async getOrderList() {
        let res = await Axios.get('order/list/relate/my', {
            states: '1,2'
        })
        let data = res.data
        data.map(order => {
            if (order.tableOrder) {
                order.storesVo = order.tableOrder[0].storesVo
                order.tableName = order.tableOrder[0].tableName
                order.addTime = order.tableOrder[0].addTime
                order.totalPrice = order.tableOrder.reduce((prev, next) => prev + next.amount, 0)
                order.totalPrice = Number(order.totalPrice).toFixed(2)
                order.totalCount = 0;
                order.orderId = order.tableOrder.map(x => x.id)
                order.orderGoodsVos = []
                order.tableOrder.map(x => {
                    x.totalCount = x.orderGoodsVos.reduce((prev, next) => prev + next.quantity, 0)
                    x.totalPrice = Number(x.amount - x.allDiscounts).toFixed(2)
                    order.totalCount += Number(x.totalCount)
                    order.orderGoodsVos = order.orderGoodsVos.concat(x.orderGoodsVos)
                })
            } else {
                order.totalCount = order.orderGoodsVos.reduce((prev, next) => prev + next.quantity, 0)
                order.totalPrice = Number(order.amount - order.allDiscounts).toFixed(2)
            }
        })

        this.setState({
            orderList: data,
            finish: true,
            token: localStorage.getItem('token')
        })

    }

    // 去订单详情
    toHisDetail(item) {
        goPage(`/waimaiOrderDetail?item=${encodeURIComponent(JSON.stringify(item))}`)
    }

    async getWaimaiOrderList() {
        let res = await Axios.get('/order/list/my/take/out')
        console.log(res)
        res.data.map((order) => {
            order.actualPayment = Number(order.amount - order.allDiscounts).toFixed(2)
        })
        this.setState({
            waimaiOrderList: res.data,
            finish: true,
            token: localStorage.getItem('token')
        })
    }

    switchTab(index) {
        if (index === 1) {
            this.getWaimaiOrderList()
        } else {
            this.getOrderList()
        }
    }

    // 去加餐
    goCheckGoods(item) {
        goPage(`/checkGoods?scene=${item.storesVo.id},${item.tableId}&noquer=true`)
    }

    // 去付款
    goPay(item) {
        goPage(`/submitPay?orderId=${item.orderId}&amount=${item.totalPrice}`)
    }

    // 去订单详情
    toOrderDetail(item) {
        localStorage.setItem('orderingItem', JSON.stringify(item))
        goPage(`/orderDetail`)
    }

    // 扫码绑定
    async scanCode(item) {
        let res = await scanCode(item.storesId, item.id)
        console.log(res)
        this.getOrderList()
    }

    // 自主点餐
    toCheckShop() {
        goPage('/chooseShop');
    }

    // 扫码点餐
    goCheckGoodsScan() {
        goCheckGoodsByScan(this.props.target)
    }
    render() {
        let { tabArr, step } = this.state
        return (
            <div>
                {this.state.token ? <div className="page">
                    <div className="tabs">
                        {tabArr.map((item, index) => (
                            <div className={["tab", item.left == step ? "act" : ""].join(" ")} key={index} onClick={() => {
                                this.setState({
                                    step: item.left,
                                    finish: false
                                })
                                this.switchTab(index)
                            }}>{item.name}</div>
                        ))}
                        <div className="slider" style={{ transform: 'translateX(' + step + 'rem)' }}></div>
                    </div>
                    {step === stepLeft ? <div className='order-list' style={{
                        height: `calc(${document.documentElement.clientHeight - 50}px - 0.9rem)`,
                        display: this.state.orderList.length > 0 ? 'block' : 'none'
                    }}>
                        {this.state.orderList.map((item, index) => {
                            return (
                                <div className='order-item' key={index} onClick={() => { this.toOrderDetail(item) }}>
                                    <div className='flex-middle'>
                                        <div>{item.storesVo.name}</div>
                                        <div className='desk-code'>
                                            {item.tableId
                                                ? <img alt='' src={require('common/img/desk_bg2.png')}></img>
                                                : <img alt='' src={require('common/img/desk_bg1.png')}></img>}
                                            <span className={[item.tableId ? "" : "grey"].join(" ")}>桌号：{item.tableId ? item.tableName : "暂无"}</span>
                                        </div>
                                    </div>
                                    <div className='goods-list'>
                                        {item.orderGoodsVos.map((goods, lindex) => {
                                            return (
                                                <div key={lindex}>
                                                    {lindex < 3 ?
                                                        <div key={goods.id} >{goods.goodsName}</div>
                                                        : ""}
                                                </div>
                                            )
                                        })}
                                        {item.orderGoodsVos.length > 3
                                            ? <div>···</div>
                                            : ""}
                                        {step == stepLeft ? <div className='order-status'>{item.tableId ? '订单准备中' : '待绑定桌号'}</div> : ""}
                                    </div>
                                    <div className='flex-middle'>
                                        <div>共计{item.totalCount}件</div>
                                        <div className='red'>
                                            <span style={{ fontSize: '0.24rem' }}>￥</span>{item.totalPrice}</div>
                                    </div>
                                    <div className='order-footer flex-middle'>
                                        <div className='order-date'>{item.addTime}</div>
                                        <div className='flex-center-ver'>
                                            {item.tableOrder ? <div className='order-button' onClick={(e) => {
                                                e.stopPropagation()
                                                this.goPay(item)
                                            }}>去付款</div> : ""}
                                            {item.tableOrder ? <div className='order-button red' onClick={(e) => {
                                                e.stopPropagation()
                                                this.goCheckGoods(item)
                                            }}>去加餐</div> : ""}
                                            {item.tableId ? "" : <div className='order-button red' onClick={(e) => {
                                                e.stopPropagation()
                                                this.scanCode(item)
                                            }}>扫码绑定</div>}
                                            {item.state === 2 ? <div className='order-span'>已付款</div> : ""}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div> : <div className='order-list' style={{
                        height: `calc(${document.documentElement.clientHeight - 50}px - 0.9rem)`,
                        display: this.state.waimaiOrderList.length > 0 ? 'block' : 'none'
                    }}>
                            {this.state.waimaiOrderList.map((item, index) => {
                                return (
                                    <div className='order-item' key={index} onClick={() => {
                                        this.toHisDetail(item)
                                    }}>
                                        <div className='flex-middle'>
                                            <div style={{
                                                color: '#EA5520',
                                                fontSize: '0.3rem'
                                            }}>{item.storesVo.name}</div>
                                            {item.state == 3 ? <div className="right-status">已完成</div> :
                                                <div className="right-status">
                                                    {item.orderTakeOutVo.state == 1 ? <div>等待接单中</div> : ""}
                                                    {item.orderTakeOutVo.state == 2 ? <div>配餐中</div> : ""}
                                                    {item.orderTakeOutVo.state == 3 ? <div>骑手配送中</div> : ""}
                                                </div>
                                            }
                                        </div>
                                        <div className='goods-list'>
                                            {item.orderGoodsVos.map((goods, lindex) => <div key={goods.id}>{lindex < 3 ? goods.goodsName : ""}</div>)}
                                            {item.orderGoodsVos.length > 3 ? <div>···</div> : ""}
                                        </div>
                                        <div className='flex-middle'>
                                            <div>共计{item.normalQuantity}件</div>
                                            <div className='red'>
                                                <span style={{ fontSize: '0.24rem' }}>￥</span>{item.actualPayment}</div>
                                        </div>
                                        <div className='order-footer flex-middle'>
                                            <div className='order-date'>{item.addTime}</div>
                                            <div className='flex-center-ver'>
                                                {item.state == 3 ? <div className='order-button'>订单详情</div> : ""}
                                                {item.state == 2 ? <div className='order-text'>已付款</div> : ""}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                    {((this.state.orderList.length === 0 && step === stepLeft) || this.state.waimaiOrderList.length === 0 && step === stepRight) && this.state.finish ? <div className='kong' >
                        <div className='null-bg'>
                            <img alt='' src={require('common/img/null3.png')}></img>
                        </div>
                        <div className='null-button order-shop' onClick={() => {
                            this.toCheckShop()
                        }}>
                            <img alt='' src={require('common/img/orderShop.png')}></img>
                            <span>自主点餐</span>
                        </div>
                        <div className='null-button scan-code' onClick={() => {
                            this.goCheckGoodsScan()
                        }}>
                            <img alt='' src={require('common/img/scanCode.png')}></img>
                            <span>扫码点餐</span>
                        </div>
                        <div className='null-button checkshop scan-code flex-center-ver' onClick={() => {
                            goPage('/chooseLocation')
                        }}>
                            <img alt="" src={require('common/img/waimai.png')}></img>
                            <span>外卖送餐</span>
                        </div>
                    </div> : ""}
                </div> : <NoToken callback={this.getOrderList.bind(this)} />}
            </div>
        )
    }
}

export default Ordering