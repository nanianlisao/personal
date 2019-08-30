import React from 'react'
import ReactDOM from 'react-dom'
import { goPage, Axios, isHttpImg } from 'util/util'
import "./ComReceived.less"
import Constant from 'util/Constant'
import { PullToRefresh, ListView } from 'antd-mobile'
import Nodata from 'common/nodata/Nodata'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/comReceived'
class ComReceived extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            body: "",
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

    static defaultProps = {
        loadUrl: '',
        json: {

        },
        type: "",  // 1圈子2报价  用来区分是报价还是圈子,跳转详情时,区分路径
        showSaveButton: true,
        offsetTop: 60,
    }
    componentWillReceiveProps(props) {
        if (props.loadUrl !== this.props.loadUrl) {
            this.refs.list.scrollTo(0, 0)
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
                <div className="list-item" key={index} onClick={() => {
                    var { page, scrollTop, allPage } = this.state
                    var { initScrollTop, initData, initPage, initAllPage } = this.props
                    initScrollTop(scrollTop)
                    initData(this.state.dataList)
                    initPage(page)
                    initAllPage(allPage)
                    if (this.props.goDetailCallback) {
                        this.props.goDetailCallback()
                    }
                    let url = this.props.type == 1 ? `/quanzi/detail/${item.circleId}` : `/baojia/detail/${item.offerId}`
                    goPage(url)
                }}>
                    <div className="avator">
                        <img src={isHttpImg(item.avatarUrl) ? item.avatarUrl : imgUrl + item.avatarUrl} alt="" />
                    </div>
                    <div className="my-info">
                        <div className="name">{item.memberName}</div>
                        <p className="comment">{item.body}</p>
                        <div className="date">{item.addTime}</div>
                    </div>
                    <div className="info-title">
                        {/* <Badge dot className>
                            <span style={{ width: '26px', height: '26px', background: '#ddd', display: 'inline-block' }} />
                        </Badge> */}
                        <p style={{ 'WebkitBoxOrient': 'vertical' }}>{item.repliedBody}</p></div>
                </div>
            )
        }
        return (
            <main className="comReceived-component">
                <div className="cttList">
                    <div style={{ display: this.state.dataList.length > 0 ? 'block' : 'none' }}>

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
                                height: document.documentElement.clientHeight - this.props.offsetTop
                            }}
                            pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={50}
                        />
                    </div>
                    {this.state.dataList.length == 0 && this.state.finish ? <Nodata /> : null}
                </div>
            </main >
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.comReceived
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
)(ComReceived)