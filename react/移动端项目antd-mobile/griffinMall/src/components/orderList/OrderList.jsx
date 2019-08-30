import React from 'react'
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView, Toast, Modal } from 'antd-mobile'
import Constant from 'util/Constant'
import { OrderGoodsStyles } from 'components/goods-style/GoodsStyles'
import { goPage, Axios, postMessage } from 'util/util'
import { ShoppingPayAgain } from 'util/pay'
import Nodata from 'common/nodata/Nodata'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/order'
import './OrderList.less'
class OrderList extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            imgUrl: Constant.getPicUrl(),
            showModal: false,
            dataSource,
            dataList: [],
            page: 1,
            pageSize: 10,
            allPage: 1,
            finish: false,
            refreshing: false,
            down: false,
        }
    }

    static defaultProps = {
        loadUrl: '',
        offsetTop: 200,
        json: {

        },
        header: ""
    }


    componentWillReceiveProps(props) {
        if (JSON.stringify(props.json) !== JSON.stringify(this.props.json)) {
            this.refs.list.scrollTo(0, 0)
            this.setState({
                dataList: [],
                page: 1,
                pageSize: 10,
                allPage: 1,
                finish: false,
                refreshing: false,
                down: false,
            }, () => {
                this.getDataList()
            })
        } else if (props.refresh != this.props.refresh) {
            this.setState({
                imgUrl: Constant.getPicUrl()
            })
        }
    }

    componentDidMount() {
        var { page, allPage, scrollTop, data } = this.props
        if (data.length > 0) {    // 用户页面回退
            this.state.page = page
            this.state.allPage = allPage
            this.state.scrollTop = scrollTop
            this.setState({
                dataList: data,
                dataSource: this.state.dataSource.cloneWithRows(data),
            }, () => {
                this.refs.list.scrollTo(0, scrollTop)
                this.props.dataClear()
            })
        } else {
            console.log('componentDidMount 发起请求数据')
            this.getDataList()
        }
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get(this.props.loadUrl, Object.assign({
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize
            }, this.props.json))
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
            console.log(data)
            this.state.dataList = [...this.state.dataList, ...data]
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.dataList),
                refreshing: false,
                finish: true,
                allPage,
                isLoading: false,
                token: localStorage.getItem('token')
            })
        } catch (e) {
            console.log(e)
        }
    }

    // 取消订单
    async cancelOrder(id) {
        let res = await Axios.post(`/order/${id}/cancel`, {}, true)
        console.log(res)
        Toast.success('订单已取消')
        this.onRefresh()
    }

    // 再次付款
    async payAgain(id) {
        let res = await ShoppingPayAgain(id)
        console.log(res)
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

    reduxData() {
        var { page, scrollTop, allPage } = this.state
        var { initScrollTop, initData, initPage, initAllPage } = this.props
        if (this.props.goDetailCallback) {
            this.props.goDetailCallback()
        }
        initScrollTop(scrollTop)
        initData(this.state.dataList)
        initPage(page)
        initAllPage(allPage)
    }

    // 查看取货码
    async showModal(id) {
        let res = await Axios.get(`/order/pick/goods/qr/code/${id}`)
        console.log(res)
        this.setState({
            oneQrcode: res.data.oneQrcode,
            twoQrcode: res.data.twoQrcode,
            code: id,
            showModal: true,
        })
    }

    // 重新购买
    async buyAgain(id) {
        let res = await Axios.get(`/order/double/shopping/${id}`, {}, true)
        Toast.success('加入购物车成功')
        setTimeout(() => {
            localStorage.setItem('selectedTab', 'cart')
            goPage('/index')
        }, 500)
    }

    async sureOrder(id) {
        let res = await Axios.post(`/order/${id}/receive`, {}, true)
        Toast.success('订单已确认收货')
        this.onRefresh()
    }


    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true,
            finish: false
        })
        this.state.dataList = []
        this.state.page = 1
        this.getDataList()
        // simulate initial Ajax
    }

    // 触底加载更多
    onEndReached = (event) => {
        // console.log('onEndReached')
        if (this.state.isLoading || this.state.allPage === this.state.page) {
            return;
        }
        this.state.page++
        this.getDataList()
    }

    render() {
        let { imgUrl } = this.state
        const row = (item, tindex, index) => {
            let statusArr = [{ state: 1, name: '待付款' }, { state: 2, name: '待收货' }, { state: 3, name: '待评价' }, { state: 4, name: '已评价' }, { state: -1, name: '交易关闭' }]
            let statusDes = statusArr.find(x => x.state == item.state)
            return (
                <div className="order-item" key={index} onClick={() => {
                    this.reduxData()
                    goPage(`/mine/orderDetail/${item.id}`)
                }}>
                    <div className="order-header flex-between">
                        <span>订单编号：{item.id}</span>
                        <span className="order-status">{statusDes.name}</span>

                    </div>
                    <div className="order-list">
                        {item.orderGoodsVos && item.orderGoodsVos.map((x, i) => (
                            <OrderGoodsStyles
                                key={i}
                                fileId={x.imgFileId}
                                name={x.goodsName}
                                price={x.price}
                                quantity={x.quantity}
                                spec={<div>{x.orderGoodsSpecificationVos && x.orderGoodsSpecificationVos.map((y, z) => (
                                    <span className="mr-10" key={z}>{y.specificationName}:{y.specificationValueName}</span>
                                ))}</div>}
                            />
                        ))}
                    </div>
                    <div className="order-footer flex-center border2">
                        <div className="total-num">共<span>{item.normalQuantity}</span>件商品</div>
                        <div>合计：{Number(item.amount - item.allDiscounts).toFixed(2)}</div>
                    </div>
                    <div className="order-btn flex-center">
                        {/* 配送到家', takeOutType:3 ,  '到店自提', type: 2  */}
                        {item.state == 1 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.cancelOrder(item.id)
                        }}>取消订单</div> : ""}
                        {item.state == 1 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.payAgain(item.id)
                        }}>立即付款</div> : ""}

                        {item.state == 2 || item.state == 4 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.callServiceTel()
                        }}>联系客服</div> : ""}
                        {item.state == 2 && item.takeOutType == 3 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.sureOrder(item.id)
                        }}>确认收货</div> : ""}

                        {item.state == 3 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            localStorage.setItem('orderDetail', JSON.stringify(item))
                            goPage('/mine/order/evaluate')
                        }}>立即评价</div> : ""}
                        {item.state == -1 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.buyAgain(item.id)
                        }}>重新购买</div> : ""}

                        {item.state == 2 && item.takeOutType == 2 ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.showModal(item.id)
                        }}>查看取货码</div> : ""}
                    </div>
                </div>
            )
        }
        return (
            <main className="orderList-component">
                <div className="list">
                    <ListView
                        ref="list"
                        key={1}
                        initialListSize={100}
                        dataSource={this.state.dataSource}
                        renderHeader={this.props.header}
                        renderFooter={() => {
                            return (
                                <div>  {this.state.dataList.length > 0 ? <div style={{ textAlign: 'center' }}>
                                    {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                                </div> : this.state.finish ? <Nodata /> : ""}</div>
                            )
                        }}
                        renderRow={row}
                        // useBodyScroll={true}
                        onScroll={() => {
                            var scrollTop = ReactDOM.findDOMNode(this.refs.list).scrollTop
                            this.state.scrollTop = scrollTop
                        }}
                        scrollEventThrottle={50}
                        style={{
                            height: `calc(${document.documentElement.clientHeight}px - 0.8rem)`,
                            maxWidth: '100%'
                        }}
                        pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={50}
                    />
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
            </main >
        )
    }
}

const mapStateToProps = (state) => {
    return state.order
}

const mapDispatchToProps = (dispatch) => {
    return {
        initPage: (page) => {
            dispatch(initPage(page))
        },
        initAllPage: (allPage) => {
            dispatch(initAllPage(allPage))
        },
        initData: (data) => {
            dispatch(initData(data))
        },
        initScrollTop: (scrollTop) => {
            dispatch(initScrollTop(scrollTop))
        },
        dataClear: () => {
            dispatch(dataClear())
        }

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderList)