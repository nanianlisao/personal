import React from 'react'
import { Axios, goPage, goCheckGoodsByScan } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import NoToken from 'components/noToken/NoToken'
export default class MyOrder extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            orderList: [],
            pageSize: 10,
            page: 1,
            refreshing: false,
            down: false, // 上拉加载更多
            allFinish: false, // 数据加载完毕
            token: localStorage.getItem('token'),
        };
    }
    componentDidMount() {
        document.title = '点餐订单'
        this.loadOrders()
    }

    shouldComponentUpdate(last, next) {
        return last.dataSource != next.dataSource
    }

    // 加载订单列表
    async loadOrders() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('order/pay/list/my', {
                states: '2', // 已取消和已完成的订单
                startIndex: (this.state.page - 1) * pageSize,
                pageSize: pageSize
            })
            console.log(res)
            let data = res.data.items
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            data.map(order => {
                order.storesVo = order.orderQueryVos[0].storesVo
                order.addTime = order.orderQueryVos[0].addTime
                order.totalPrice = order.orderQueryVos.reduce((prev, next) => prev + next.amount, 0)
                order.totalPrice = Number(order.totalPrice).toFixed(2)
                order.totalCount = 0;
                order.orderId = order.orderQueryVos.map(x => x.id)
                order.orderGoodsVos = []
                order.orderQueryVos.map(x => {
                    x.totalCount = x.orderGoodsVos.reduce((prev, next) => prev + next.quantity, 0)
                    x.totalPrice = Number(x.amount - x.allDiscounts).toFixed(2)
                    order.totalCount += Number(x.totalCount)
                    order.orderGoodsVos = order.orderGoodsVos.concat(x.orderGoodsVos)
                })
            })
            this.setState({
                orderList: [...this.state.orderList, ...data],
                dataSource: this.state.dataSource.cloneWithRows([...this.state.orderList, ...data]),
                refreshing: false,
                isLoading: false,
                finish: true,
                allPage: allPage,
                token: localStorage.getItem('token')
            })
        } catch (e) {
            console.log(e)
        }
    }

    // 去订单详情
    toHisDetail(item) {
        localStorage.setItem('hisOrderItem', JSON.stringify(item))
        goPage(`/hisDetail`)
    }

    // 自主点餐
    toCheckShop() {
        goPage('/chooseShop');
    }

    // 扫码点餐
    goCheckGoodsScan() {
        goCheckGoodsByScan(this)
    }

    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true
        })
        this.state.orderList = []
        this.state.page = 1
        this.loadOrders()
        // simulate initial Ajax
    }

    // 触底加载更多
    onEndReached = (event) => {
        console.log('onEndReached')
        if (this.state.isLoading || this.state.allPage === this.state.page) {
            return;
        }
        this.state.page++
        this.loadOrders()
    }

    render() {
        const row = (item, index) => {
            return (
                <div className='order-item' key={index} onClick={() => {
                    this.toHisDetail(item)
                }}>
                    <div className='flex-middle'>
                        <div>{item.storesVo.name}</div>
                        <div className='desk-code'>
                            <img src={require(`common/img/${item.orderQueryVos[0].tableId ? "desk_bg2.png" : "desk_bg1.png"}`)}></img>
                            <span className='{item.orderQueryVos[0].tableId?"":"grey"}'>桌号：{item.orderQueryVos[0].tableId ? item.orderQueryVos[0].tableName : "暂无"}</span>
                        </div>
                    </div>
                    <div className='goods-list'>
                        {item.orderGoodsVos.map((goods, lindex) => <div key={goods.id}>{lindex < 3 ? goods.goodsName : ""}</div>)}
                        {item.orderGoodsVos.length > 3 ? <div>···</div> : ""}
                        <div className='order-status'>{item.orderQueryVos[0].state == 2 ? '订单准备中' : '订单已完成'}</div>
                    </div>
                    <div className='flex-middle'>
                        <div>共计{item.totalCount}件</div>
                        <div className='red'>
                            <span style={{ fontSize: '0.24rem' }}>￥</span>{item.actualPayment}</div>
                    </div>
                    <div className='order-footer flex-middle'>
                        <div className='order-date'>{item.addTime}</div>
                        <div className='flex-center-ver'>
                            {item.orderQueryVos[0].state == 3 ? <div className='order-button'>订单详情</div> : ""}
                            {item.orderQueryVos[0].state == 2 ? <div className='order-text'>已付款</div> : ""}
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                {this.state.token ? <div>
                    {this.state.orderList.length > 0 ? <div className='order-list'>
                        <ListView
                            key={1}
                            dataSource={this.state.dataSource}
                            // renderHeader={() => <span>Pull to refresh</span>}
                            renderFooter={() => (<div style={{ textAlign: 'center' }}>
                                {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                            </div>)}
                            renderRow={row}
                            // renderSeparator={separator}
                            useBodyScroll={true}
                            // style={{
                            //     height: document.documentElement.clientHeight
                            // }}
                            pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={20}
                        />
                    </div> : ""}
                    {this.state.orderList.length == 0 && this.state.finish ? <div className='kong' >
                        <div className='null-bg'>
                            <img alt='' src={require('common/img/null3.png')}></img>
                        </div>
                        <div className='null-button order-shop' onClick={() => {
                            this.toCheckShop()
                        }}>
                            <img alt='' src={require('common/img/orderShop.png')}></img>
                            <span>自主点餐</span>
                        </div>
                        <div className='null-button order-shop' onClick={() => {
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
                </div> : <NoToken callback={this.loadOrders.bind(this)} />}
            </div>
        )
    }
}