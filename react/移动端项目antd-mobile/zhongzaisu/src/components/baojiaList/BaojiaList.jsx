import React from 'react'
import ReactDOM from 'react-dom'
import { PullToRefresh, ListView, Modal } from 'antd-mobile'
import 'components/baojiaList/BaojiaList.less'
import Constant from 'util/Constant'
import { goPage, Axios, postMessage, isHttpImg } from 'util/util'
import Nodata from 'common/nodata/Nodata'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/baojia'
const alert = Modal.alert
class BaojiaList extends React.Component {
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
        }
    }

    static defaultProps = {
        loadUrl: '',
        json: {

        },
        offsetTop: 150
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

    checkMember(offerId) {
        if (localStorage.getItem('token')) {
            return Axios.get(`/offer/verify/${offerId}`).then((res) => {
                return res.data
            })
        } else {
            return {}
        }
    }
    render() {
        let { imgUrl } = this.state
        const row = (item, tindex, index) => {
            return (
                <div className="listItem" key={index} onClick={async () => {
                    try {
                        await this.checkMember(item.id)
                        var { page, scrollTop, allPage } = this.state
                        var { initScrollTop, initData, initPage, initAllPage } = this.props
                        initScrollTop(scrollTop)
                        initData(this.state.dataList)
                        initPage(page)
                        initAllPage(allPage)
                        if (this.props.goDetailCallback) {
                            this.props.goDetailCallback()
                        }
                        goPage(`/baojia/detail/${item.id}`)
                    } catch (e) {
                        console.log(e)
                        alert('提示', e.res.retMsg, [
                            { text: '取消' },
                            {
                                text: '分享', onPress: () => {
                                    postMessage('share', JSON.stringify({
                                        token: localStorage.getItem('token'),
                                        offerId: item.id,
                                        type: 'baojia'
                                    }))
                                }
                            }
                        ])
                    }
                }}>
                    <div className="item-header">
                        <div className="avatar imgCtn">
                            <img src={isHttpImg(item.avatarUrl) ? item.avatarUrl : item.avatarUrl ? imgUrl + item.avatarUrl : imgUrl + "6814beb8639221a5559d2604beda77f0"} alt="" />
                        </div>
                        <div className="title" style={{ WebkitBoxOrient: 'vertical' }}>
                            <span>【{item.offerTypeName}】</span>{item.title}</div>
                    </div>
                    <div className="btm">
                        <div className='btm_left'>
                            <div className='imgCtn'>
                                <img alt="" src={require("common/img/clock.png")}></img>
                            </div>
                            <div className='txt'>{item.updateTime}</div>
                        </div>

                        <div className="btm_right">
                            <div className='imgCtn'>
                                <img alt="" src={require("common/img/eye.png")}></img>
                                <div className='txt'>{item.fictitiousBrowseCount}</div>
                            </div>
                            <div className='imgCtn'>
                                <img alt="" src={require("common/img/dialog.png")}></img>
                                <div className='txt'>{item.commentCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <main className="baojia-component">
                <div className="list">
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
    return state.baojia
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
)(BaojiaList)