
import React from 'react'
import ReactDOM from 'react-dom';
import './AssembleList.less'
import { goPage, Axios } from 'util/util'
import { PintuanGoodsStyles } from 'components/goods-style/GoodsStyles'
import { PullToRefresh, ListView } from 'antd-mobile'
import Nodata from 'common/nodata/Nodata'
import Constant from 'util/Constant'

export default class AssembleList extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            virtualMoney: 0,
            imgUrl: Constant.getPicUrl(),
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


    componentWillMount() {
        this.getHeaderInfo()
        this.getDataList()
    }

    // 获取顶部虚拟币数量   
    async getHeaderInfo() {
        let res = await Axios.post('/distribution/find/my')
        this.setState({
            virtualMoney: res.data
        })
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/goodsTemplate/sub/category/list', {
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize
            })
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
    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true
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
        const header = () => (
            <section className="top" >
                <img className="banner" src={require('common/img/0.jpg')} alt="" />
                <div className="poster-b">本场拼团结束还有18:30:22</div>
                <div className="poster-r flex-center">
                    <img className="banner" src={require('common/img/0.jpg')} alt="" />
                    <span>某某某刚刚发起了拼团</span>
                </div>
            </section>
        )
        const row = (item, tindex, index) => {
            return (
                <div className="goods-item border2" key={index}>
                    <PintuanGoodsStyles
                        style={{
                            flexShrink: 0,
                            border: 'none'
                        }}
                        onClick={() => {
                            goPage(`/home/goodsDetail?id=23`)
                        }}
                        price="99.00"
                        oldPrice="499.00"
                        pintuanCount="2"
                        showPintuan={true}
                        name="商品名字"
                    // fileId=""
                    />
                </div>
            )
        }
        return (
            <main className="page-assembleList">
                <div className="assembleList-list">
                    <ListView
                        ref="list"
                        key={1}
                        initialListSize={100}
                        dataSource={this.state.dataSource}
                        renderHeader={header}
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
                            height: `calc(${document.documentElement.clientHeight}px - 0.4rem)`,
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
            </main >
        )
    }
}


class Extend2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderTab: [
                { name: '待支付', img: require('common/img/order_status1.png'), newCount: 95, state: 1 },
                { name: '待自提', img: require('common/img/order_status2.png'), newCount: 0, state: 2 },
                { name: '待评价', img: require('common/img/order_status3.png'), newCount: 1, state: 3 },
                { name: '退款', img: require('common/img/order_status4.png'), newCount: 0, state: 4 },
            ]
        }
    }

    render() {
        let { orderTab } = this.state
        return (
            <main className="page-extend">
                <section className="top" >
                    <div className="top-info flex-middle" style={{
                        backgroundImage: `url(${require('common/img/extend_bg.png')})`,
                    }}>
                        <img src={require('common/img/gold.png')} alt="" />
                        <span>我虚拟币：999</span>
                    </div>
                </section>
                <section className="extend-wrap">
                    <div className="title border2">推广记录</div>
                    <div className="extend-list">
                        {[1, 1, 1].map((x, i) => (
                            <div className="extend-item border2" key={i}>
                                <div className="extend-header flex-center">
                                    <div className="avatar">
                                        <img src={require('common/img/0.jpg')} alt="" />
                                    </div>
                                    <div className="extend-info flex-between border2">
                                        <div>
                                            <div className="user-name">用户昵称</div>
                                            <div className="add-time">2019-03-28 15:33:02</div>
                                        </div>
                                        <div className="income">+99虚拟币</div>
                                    </div>
                                </div>
                                <div className="extend-goods">
                                    {[1, 1].map((x, i) => (
                                        <div className="goods-item flex-between" key={i}>
                                            <div className="poster">
                                                <img src={require('common/img/0.jpg')} alt="" />
                                            </div>
                                            <div className="name text-overflow-2" style={{ WebkitBoxOrient: 'vertical' }}>GRIFFIN定制VIP帆布包GRIFFIN定制GRIFFIN定制VIP帆布包GRIFFIN定制GRIFFIN定制VIP帆布包GRIFFIN定制</div>
                                        </div>
                                    ))}
                                    <div className="show-more flex-middle">
                                        <span>查看更多</span>
                                        <img src={require('common/img/arrowRG.png')} alt="" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        )
    }
}