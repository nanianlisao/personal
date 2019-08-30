import React from 'react'
import { Axios, goPage, getScrollTop } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import { connect } from 'react-redux'
import NoToken from 'components/noToken/NoToken'
import Constant from 'util/Constant'
import { initPage, initScrollTop, initTicket, dataClear, initAllPage } from '@/reducers/myTicket'
import { dataClear as dataHisClear } from '@/reducers/hisTicket'
import './MyTicket.css'
class MyTicket extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            pageSize: 8,
            dataSource,
            ticketList: [],
            page: 1,
            allPage: 1,
            finish: false,
            refreshing: false,
            down: false, // 上拉加载更多
            token: localStorage.getItem('token')
        };
    }
    componentWillReceiveProps(props) {
    }
    componentDidMount() {
        document.title = '优惠券'
        var { page, allPage, scrollTop, ticket } = this.props
        if (ticket.length > 0) {    // 用户页面回退
            this.state.page = page
            this.state.allPage = allPage
            this.state.scrollTop = scrollTop
            // setTimeout(() => {
            // this.refs.list.scrollTo({ x: 0, y: scrollTop })
            if (this.refs.list) {
                this.refs.list.scrollTo(0, scrollTop)
            }
            // }, 100)
            this.setState({
                ticketList: ticket,
                dataSource: this.state.dataSource.cloneWithRows(ticket),
            })
        } else {
            this.getTicketList()
        }
        this.props.dataHisClear()
    }
    async getTicketList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/ticket/findticket', {
                startIndex: (this.state.page - 1) * pageSize,
                pageSize: pageSize
            })
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
            this.state.ticketList = [...this.state.ticketList, ...data]
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.ticketList),
                refreshing: false,
                finish: true,
                allPage,
                isLoading: false,
                token: localStorage.getItem('token')
            })
        } catch (e) {
            // console.log(e)
        }
    }
    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true
        })
        this.state.ticketList = []
        this.state.page = 1
        this.getTicketList()
        // simulate initial Ajax
    }

    // 触底加载更多
    onEndReached = (event) => {
        // console.log('onEndReached')
        if (this.state.isLoading || this.state.allPage === this.state.page) {
            return;
        }
        this.state.page++
        this.getTicketList()
    }

    render() {
        let { ticketList, finish, refreshing } = this.state
        const row = (item, sindex, index) => {
            return (
                <div key={item.id}>
                    <div className="tickets"
                        key={item.id}
                        style={{ background: 'url(' + require('common/img/tickBg3.png') + ') center center no-repeat', backgroundSize: 'cover' }}
                        onClick={() => {
                            localStorage.setItem('ticket', JSON.stringify(item))
                            var { page, scrollTop, allPage } = this.state
                            var { initScrollTop, initTicket, initPage, initAllPage } = this.props
                            initScrollTop(scrollTop)
                            initTicket(this.state.ticketList)
                            initPage(page)
                            initAllPage(allPage)
                            goPage(`/ticket/ticketDetail`)
                        }}
                    >
                        <div className='ticket-detail'>
                            <div className='ticket-left'>
                                <div className="title">{item.name}</div>
                                <div className="detail">
                                    {item.activeType == 1 ? <div className="price"><span>￥</span>{item.reduce}</div> : ""}
                                    {item.activeType == 2 ? <div className="price">{item.sale}折</div> : ""}
                                    <div className="use-detail">
                                        <div className="coin-sign">满{item.ruleMap.minConsume ? item.ruleMap.minConsume : 0}元可用</div>
                                        <div className="use-wide">{item.ruleMap.goods && item.ruleMap.goods != 'all' ? '限独享优惠商品名可用' : '全场通用'}</div>
                                    </div>
                                </div>
                                <div className="date">有效期：{item.ticketTermofvalidity}</div>
                            </div>
                            <div className='ticket-right'>
                                <div className="get-btn" onClick={(e) => {
                                    e.stopPropagation()
                                    // this.props.dataClear()
                                    // return
                                    localStorage.setItem('selectedTab', 'home')
                                    goPage('/index')
                                }} style={{ background: 'url(' + require('common/img/button_wrap.png') + ') center center no-repeat', backgroundSize: 'cover' }}>
                                    <span>立即使用</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(index % 2 === 1 || this.state.dataSource.length == 1) && Constant.data.app_id == 3 ? <div className="ad-bg"><img src={require('common/img/ad.png')} alt=""></img></div> : ""}
                </div>
            )
        }
        return (
            <div style={{ height: '100%' }}>
                {this.state.token ? <div className="page-ticket">
                    <div className='tickets-box' >
                        {this.state.ticketList.length > 0 ? <ListView
                            ref="list"
                            key={1}
                            dataSource={this.state.dataSource}
                            // renderHeader={() => <span>Pull to refresh</span>}
                            renderFooter={() => (<div style={{ textAlign: 'center' }}>
                                {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                            </div>)}
                            renderRow={row}
                            // renderSeparator={separator}
                            useBodyScroll={true}
                            onScroll={() => {
                                var scrollTop = getScrollTop()
                                this.state.scrollTop = scrollTop
                            }}
                            scrollEventThrottle={50}
                            // style={{
                            //     height: document.documentElement.clientHeight
                            // }}
                            pullToRefresh={<PullToRefresh
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={20}
                        />
                            : ""}
                        {this.state.ticketList.length == 0 && finish ? <div className="normal">
                            <img src={require('common/img/null2.png')}></img>
                            <span>暂无优惠券</span>
                        </div> : ""}
                    </div>
                    <div className="history-ticket" onClick={() => {
                        goPage('/ticket/hisTicket')
                    }}>查看历史优惠券</div>
                </div> : <NoToken callback={this.getTicketList.bind(this)} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.myTicket
}

const mapDispatchToProps = (dispatch) => {
    return {
        initPage: (page) => {
            dispatch(initPage(page))
        },
        initAllPage: (allPage) => {
            dispatch(initAllPage(allPage))
        },
        initTicket: (ticket) => {
            dispatch(initTicket(ticket))
        },
        initScrollTop: (scrollTop) => {
            dispatch(initScrollTop(scrollTop))
        },
        dataClear: () => {
            dispatch(dataClear())
        },
        dataHisClear: () => {
            dispatch(dataHisClear())
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyTicket)