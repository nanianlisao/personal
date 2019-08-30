import React from 'react'
import ReactDOM from 'react-dom';
import './Ticket.less'
import { goPage, Axios, isHttpImg } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import FooterShow from 'common/footerShow/FooterShow'
import Nodata from 'common/nodata/Nodata'
import Constant from 'util/Constant'

export default class Ticket extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            imgUrl: Constant.getPicUrl(),
            dataSource,
            dataList: [],
            textRemark: "",
            page: 1,
            pageSize: 10,
            allPage: 1,
            finish: false,
            refreshing: false,
            down: false,
        }
    }


    componentWillMount() {
        console.log('componentDidMount 发起请求数据')
        this.getDataList()
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/ticket/find/all/ticket', {
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
        console.log('List render')
        const row = (item, tindex, index) => {
            return (
                <div key={index} className={["ticket-item flex-between", item.state === 1 ? "act" : ""].join(' ')} onClick={() => {
                    this.setState({
                        textRemark: item.remark
                    })
                    this.refs.ticket.show()
                }}>
                    <div className={["ticket-name", item.state === 1 ? "" : "grey"].join(' ')}>{item.name}</div>
                    <div className="left">
                        {item.activeType == 1 ? <div className="price">￥<span>{item.ruleMap.reduce}元</span></div> : <div className="price"><span>{item.ruleMap.sale}折</span></div>}
                        <div className="font-22 center">（{item.ticketTermofvalidity}）</div>
                    </div>
                    <div className="right">
                        <div className="remark">购物满{item.ruleMap.minConsume ? item.ruleMap.minConsume : 0}元可用</div>
                        <div className="name">{item.ruleMap.goods && item.ruleMap.goods != "all" ? "（部分商品可用）" : "（全场通用）"}</div>
                        {item.state === 1 ? <div className="btn" onClick={() => {
                            localStorage.setItem('selectedTab', 'home')
                            goPage('/index')
                        }}>立即使用</div> : item.state === 2 ? <div className="btn grey">已使用</div> : <div className="btn grey">已过期</div>}
                    </div>
                </div>
            )
        }
        return (
            <main className="page-ticket">
                <div className="ticket-list">
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
                <FooterShow ref="ticket" height={10}>
                    <div className="ticket-modal">
                        <div className="header flex-between">
                            <span>使用说明</span>
                            <div className="close-btn"
                                onClick={() => {
                                    this.refs.ticket.hide()
                                }}>
                                <img src={require('common/img/cancel.png')} alt="" />
                            </div>
                        </div>
                        <div className="text-mark">
                            {this.state.textRemark}
                        </div>
                    </div>
                </FooterShow>
            </main >
        )
    }
}

