import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom';
import { goPage, Axios, parseQueryString } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import Constant from 'util/Constant'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/homeList'
class HomeList extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            imgUrl: Constant.getPicUrl(),
            dataSource,
            dataList: [],
            pageSize: 10,
            page: 1,
            allPage: 1,
            finish: false,
            refreshing: false,
            down: false,
        }
    }
    componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.state.categoryId = options.id
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
            this.getDataList()
        }
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/information/list', {
                categoryId: this.state.categoryId,
                startIndex: (this.state.page - 1) * pageSize,
                pageSize: pageSize
            })
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
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

    goDetail(id) {
        var { page, scrollTop, allPage,dataList } = this.state
        var { initScrollTop, initData, initPage, initAllPage } = this.props
        initScrollTop(scrollTop)
        initData(dataList)
        initPage(page)
        initAllPage(allPage)
        goPage(`/home/detail/${id}`)
    }


    render() {
        let { imgUrl } = this.state
        const row = (item, tindex, index) => {
            return (
                <div key={index}>
                    {item.type == 1 ?
                        <div className='listItem' onClick={() => {
                            this.goDetail(item.id)
                        }}>
                            <div className='left'>
                                <div className='top' style={{ 'WebkitBoxOrient': 'vertical' }}>{item.title}</div>
                                <div className='btm'>
                                    <div className='time'>
                                        <div className='imgCtn'>
                                            <img src={require("common/img/clock.png")}></img>
                                        </div>
                                        <div className='txt'>{item.addTime}</div>
                                    </div>
                                    <div className='viewNum'>
                                        <div className='imgCtn'>
                                            <img src={require("common/img/eye.png")}></img>
                                        </div>
                                        <div className='txt'>{item.addReadTimes}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='right imgCtn'>
                                <img src={imgUrl + item.imgFileId} ></img>
                            </div>
                        </div>
                        : <div className="videoPart" onClick={() => {
                            this.goDetail(item.id)
                        }}>
                            <div className="title">{item.title}</div>
                            <div className="videoCtn">
                                <div className='mask'></div>
                                <img src={require('common/img/play.png')} className='play-btn'></img>
                                <img src={imgUrl + item.imgFileId} className='poster'></img>
                            </div>
                            <div className='btm'>
                                <div className='time'>
                                    <div className='imgCtn'>
                                        <img src={require("common/img/clock.png")}></img>
                                    </div>
                                    <div className='txt'>{item.addTime}</div>
                                </div>
                                <div className='viewNum'>
                                    <div className='imgCtn'>
                                        <img src={require("common/img/eye.png")}></img>
                                    </div>
                                    <div className='txt'>{item.addReadTimes}</div>
                                </div>
                            </div>
                        </div>}
                </div>
            )
        }
        return (
            <main className="home-page">
                <div className='newsList' style={{ padding: '0 0.3rem' }}>
                    <ListView
                        ref="list"
                        key={1}
                        initialListSize={100}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ textAlign: 'center' }}>
                            {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                        </div>)}
                        renderRow={row}
                        // useBodyScroll={true}
                        onScroll={() => {
                            var scrollTop = ReactDOM.findDOMNode(this.refs.list).scrollTop
                            this.state.scrollTop = scrollTop
                        }}
                        scrollEventThrottle={50}
                        style={{
                            height: document.documentElement.clientHeight
                        }}
                        pullToRefresh={<PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={20}
                    />
                </div>
            </main >
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.homeList
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
)(withRouter(HomeList))