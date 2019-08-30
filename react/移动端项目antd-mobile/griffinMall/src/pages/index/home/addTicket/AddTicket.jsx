import React from 'react'
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView, Toast } from 'antd-mobile'
import FooterShow from 'common/footerShow/FooterShow'
import Constant from 'util/Constant'
import './AddTicket.less'
import { Axios } from 'util/util'
import Nodata from 'common/nodata/Nodata'

export default class AddTicket extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            imgUrl: Constant.getPicUrl(),
            dataSource,
            dataList: [],
            textRemark:"",
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
        json: {},
        header: ""
    }


    componentWillReceiveProps(props) {
        if (JSON.stringify(props.json) !== JSON.stringify(this.props.json)) {
            this.refs.list.scrollTo(0, 0)
            this.setState({
                // dataList: [],
                page: 1,
                pageSize: 10,
                allPage: 1,
                finish: false,
                refreshing: false,
                down: false,
            }, () => {
                this.getDataList()
            })
        }
    }

    componentDidMount() {
        this.getDataList()
    }

    async getDataList() {
        try {
            let res = await Axios.post('/active/find/can/receive')
            let allPage = 1
            let data = res.data
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

    // 领取优惠券
    async addTicket(id) {
        let res = await Axios.post(`/active/receive/ticket/${id}`, {}, true)
        Toast.success('领取成功')
        setTimeout(this.onRefresh, 500)
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
                <div key={index} className={["ticket-item flex-between", item.canReceive ? "act" : ""].join(' ')} onClick={() => {
                    this.setState({
                        textRemark: item.remark
                    })
                    this.refs.ticket.show()
                }}>
                    {/* {item.canReceive ? <img src={require('common/img/ticket_l.png')} className="img" alt="" /> : ""} */}
                    <div className={["ticket-name", item.canReceive ? "" : "grey"].join(' ')}>{item.name}</div>
                    <div className="left">
                        {item.type == 1 ? <div className="price">￥<span>{item.ruleMap.reduce}元</span></div> : <div className="price"><span>{item.ruleMap.sale}折</span></div>}
                        <div className="font-22">（所有门店可用）</div>
                    </div>
                    <div className="right">
                        <div className="remark">购物满{item.ruleMap.minConsume ? item.ruleMap.minConsume : 0}可用</div>
                        <div className="name">优惠券</div>
                        {item.canReceive ? <div className="btn" onClick={(e) => {
                            e.stopPropagation()
                            this.addTicket(item.activeId)
                        }}>立刻领取</div> : <div className="btn grey">不可领取</div>}
                    </div>
                </div>
            )
        }
        return (
            <main className="page-addTicket">
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
                                </div> : <Nodata />}</div>

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