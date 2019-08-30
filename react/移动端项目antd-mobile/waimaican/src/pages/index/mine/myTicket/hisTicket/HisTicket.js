import React from 'react'
import { Axios, goPage, getScrollTop } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import NoToken from 'components/noToken/NoToken'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initTicket, dataClear, initAllPage } from '@/reducers/hisTicket'
import '../MyTicket.css'
class HisTicket extends React.Component {
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
            finish: false,
            refreshing: false,
            down: false, // 上拉加载更多
            allFinish: false, // 数据加载完毕
            token: localStorage.getItem('token')
        };
    }
    componentDidMount() {
        document.title = '历史优惠券'
        var { page, allPage, scrollTop, ticket } = this.props
        if (ticket.length > 0) {    // 用户页面回退
            this.state.page = page
            this.state.allPage = allPage
            this.state.scrollTop = scrollTop
            setTimeout(() => {
                if (this.refs.list) {
                    // console.log(scrollTop)
                    this.refs.list.scrollTo(0, scrollTop)
                }
            }, 100)
            this.setState({
                ticketList: ticket,
                dataSource: this.state.dataSource.cloneWithRows(ticket),
            })
        } else {
            this.getTicketList()
        }
    }

    // 加载数据列表
    async getTicketList() {
        // console.log('查询数据')
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/ticket/findhistoryticket', {
                startIndex: (this.state.page - 1) * pageSize,
                pageSize: pageSize
            })
            let allPage = Math.ceil(res.data.totalCount / pageSize)

            let data = res.data.items
            this.state.ticketList = [...this.state.ticketList, ...data]
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.ticketList),
                refreshing: false,
                isLoading: false,
                finish: true,
                allPage,
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
        if (this.state.isLoading || this.state.allPage === this.state.page) {
            return;
        }
        this.state.page++
        // console.log(this.state.page)
        this.getTicketList()
    }

    render() {
        let { ticketList, finish, refreshing } = this.state
        // console.log(ticketList)    // 15条

        const row = (item, index) => {
            return (
                <div className="tickets"
                    key={item.id}
                    style={{ background: 'url(' + require('common/img/tickBg4.png') + ') center center no-repeat', backgroundSize: 'cover' }}
                    onClick={() => {
                        localStorage.setItem('ticket', JSON.stringify(item))
                        var { page, scrollTop, allPage } = this.state
                        var { initScrollTop, initTicket, initPage, initAllPage } = this.props
                        // console.log(ticketList)   // 8条

                        // console.log(this.state.ticketList)  // 15条

                        initTicket(this.state.ticketList)
                        initScrollTop(scrollTop)
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
                            <div className="get-btn" catchtap='toUse' style={{ background: `url(${require('common/img/button_wrap.png')}') center center no-repeat`, backgroundSize: 'cover' }}>
                                <img className="used-img" src={require(`common/img/${item.state == 2 ? "used.png" : "time_out.png"}`)}></img>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div style={{ height: '100%' }}>
                {this.state.token ? <div className="page-ticket hisTicket">
                    {this.state.ticketList.length > 0 ? <div className='tickets-box'>
                        <ListView
                            ref="list"
                            initialListSize={100}
                            key={1}
                            dataSource={this.state.dataSource}
                            // renderHeader={() => <span>Pull to refresh</span>}
                            renderFooter={() => (<div style={{ textAlign: 'center' }}>
                                {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                            </div>)}
                            renderRow={row}
                            onScroll={() => {
                                var scrollTop = getScrollTop()
                                this.state.scrollTop = scrollTop
                            }}
                            // renderSeparator={separator}
                            useBodyScroll={true}
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
                    </div> : null}
                    {this.state.ticketList.length == 0 && finish ? <div className="normal">
                        <img src={require('common/img/null2.png')}></img>
                        <span>无历史优惠券</span>
                    </div> : ""}
                </div>
                    : <NoToken callback={this.getTicketList.bind(this)} />}
            </div>

        )
    }
}


const mapStateToProps = (state) => {
    // console.log(state.hisTicket)
    return state.hisTicket
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
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HisTicket)