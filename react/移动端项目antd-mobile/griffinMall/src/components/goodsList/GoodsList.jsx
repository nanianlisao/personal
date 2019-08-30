import React from 'react'
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView } from 'antd-mobile'
import Constant from 'util/Constant'
import { LevelGoodsStyles } from 'components/goods-style/GoodsStyles'
import { goPage, Axios } from 'util/util'
import Nodata from 'common/nodata/Nodata'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/goods'
class GoodsList extends React.Component {
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
                <LevelGoodsStyles
                    key={index}
                    fileId={item.imgFileId}
                    name={item.name}
                    price={item.price}
                    marks={item.tags ? item.tags.split(',') : ''}
                    salesCount={item.sales}
                    onClick={() => {
                        this.reduxData()
                        goPage(`/home/goodsDetail?id=${item.id}`)
                    }}
                />
            )
        }
        return (
            <main className="quanziList-component">
                <div className="cttList">
                    <div>
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
                                height: document.documentElement.clientHeight - 50,
                                // height: this.state.height,
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
                    {/* {this.state.dataList.length == 0 && this.state.finish ? <Nodata /> : null} */}
                </div>
            </main >
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.goods
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
)(GoodsList)