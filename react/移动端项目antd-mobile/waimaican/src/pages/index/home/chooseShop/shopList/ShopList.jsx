import React from 'react'
import { PullToRefresh, ListView, Modal } from 'antd-mobile'
import Constant from 'util/Constant'
import Nodata from 'common/nodata/Nodata'
import './ShopList.less'
import { goPage, Axios, postMessage, isHttpImg } from 'util/util'
const alert = Modal.alert
export default class HuangyeList extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            imgUrl: Constant.getPicUrl(),
            dataSource,
            dataList: [],
            page: 1,
            pageSize: 10,
            allPage: 1,
            finish: false,
            refreshing: false,
            down: false,
            cShopIndex: '',
        }
    }

    static defaultProps = {
        loadUrl: '',
        json: {

        },
        showHeader: false,
        offsetTop: 0,
        orderType: ''
    }


    componentWillReceiveProps(props) {

        // if (JSON.stringify(props.json) !== JSON.stringify(this.props.json)) {
        //     this.refs.list.scrollTo(0, 0)
        //     this.setState({
        //         dataList: [],
        //         page: 1,
        //         pageSize: 10,
        //         allPage: 1,
        //         finish: false,
        //         refreshing: false,
        //         down: false,
        //     }, this.getDataList)
        // }
    }

    componentDidMount() {
        // this.getDataList()
    }


    refreshData() {
        this.setState({
            dataList: [],
            page: 1,
            pageSize: 10,
            allPage: 1,
            finish: false,
            refreshing: false,
            down: false,
        }, this.getDataList)
    }

    // 去选择商品
    toCheckGoods(status, id) {
        if (status == 1) {
            goPage(`/checkGoods/CheckGoods?id=${id}&orderType=${this.props.orderType}`)
        }
    }

    // 跳门店详情
    toShopDetail(index) {
        let currentShop = this.state.dataList[index]
        goPage(`/chooseShop/shopDetail?shopItem=${encodeURIComponent(JSON.stringify(currentShop))}&orderType=${this.props.orderType}`)
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get(this.props.loadUrl, Object.assign({
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize,
                appId: Constant.data.app_id
            }, this.props.json))
            console.log(res)
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
            this.state.dataList = [...this.state.dataList, ...data]
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.dataList),
                refreshing: false,
                finish: true,
                allPage,
                totalCount: res.data.totalCount,
                isLoading: false,
                token: localStorage.getItem('token')
            })
            if(this.props.refreshCallBack){
                this.props.refreshCallBack()
            }
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
        const row = (item, tindex, index) => {
            return (
                <div className="shop shadow-box" key={item.id} onClick={() => {
                    this.setState({
                        cShopIndex: index
                    })
                }}>
                    <div className="top-content">
                        <div className="left">
                            <img alt="" className="loca2" src={require('common/img/loca2.png')} mode="aspectFit"></img>
                            <div className="name text-overflow-1">{item.name}</div>
                        </div>
                        <div className='working-flag'>
                            {item.businessDesc && item.businessDesc.id == 1 ? <img alt="" src={require('common/img/tickBg_ac.png')}></img> : ""}
                            {item.businessDesc && item.businessDesc.id == 2 ? <img alt="" src={require('common/img/tickBg.png')}></img> : ""}
                            <span>{item.businessDesc && item.businessDesc.id == 1 ? "营业中" : "歇业中"}</span>
                        </div>
                    </div>
                    <div className="addr">
                        <span className="address text-overflow-1">{item.address}</span>
                    </div>

                    {index == this.state.cShopIndex ? <div className="getOrder">
                        <div className="title">
                            <div className='title-time'>{this.props.addressId ? item.distanceT : ''}</div>
                            {index == this.state.cShopIndex ?
                                <div className="right-detail" onClick={this.toShopDetail.bind(this, index)}>
                                    <span>门店详情</span>
                                    <img alt="" src={require("common/img/arrow_right_grey.png")} mode="aspectFit"></img>
                                </div> : ""}
                        </div>
                    </div> : ""}
                    {index == this.state.cShopIndex ? <div className={["confirmOrder", item.businessDesc.id == 1 ? '' : 'grey'].join(" ")} onClick={() => {
                        this.toCheckGoods(item.businessDesc.id, item.id)
                    }}>选择商品</div> : ""}
                </div>
            )
        }
        return (
            <main className="shopList-component">
                <div className="list">
                    {this.props.showHeader ? <div className="all-shopCount">附近有{this.state.totalCount}家门店可为您送餐</div> : ""}
                    <div className="box">
                        <div>
                            <ListView
                                ref="list"
                                key={1}
                                dataSource={this.state.dataSource}
                                renderFooter={() => {
                                    return (
                                        <div>  {this.state.dataList.length > 0 ? <div style={{ textAlign: 'center' }}>
                                            {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                                        </div> : <Nodata />}</div>
                                    )
                                }}
                                renderRow={row}
                                // useBodyScroll={true}
                                // onScroll={() => {
                                //     var scrollTop = getScrollTop()
                                //     this.state.scrollTop = scrollTop
                                // }}
                                scrollEventThrottle={10}
                                style={{
                                    height: `calc(${document.documentElement.clientHeight}px - ${this.props.offsetTop}rem)`
                                }}
                                pullToRefresh={<PullToRefresh
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                                onEndReached={this.onEndReached}
                                onEndReachedThreshold={50}
                            />
                        </div>
                    </div>
                </div>
            </main >
        )
    }
}