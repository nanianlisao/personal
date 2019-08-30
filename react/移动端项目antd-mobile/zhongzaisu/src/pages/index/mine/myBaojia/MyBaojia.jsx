import React from 'react'
import ReactDOM from 'react-dom'
import "pages/index/mine/myBaojia/MyBaojia.less"
import { goPage, Axios } from 'util/util'
import Nodata from 'common/nodata/Nodata'
import Constant from 'util/Constant'
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/myBaojia'
import { SwipeAction, PullToRefresh, ListView, Modal, Toast } from 'antd-mobile';
const alert = Modal.alert
class MyBaojia extends React.Component {
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
            let res = await Axios.get('/offer/list/mine', {
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize
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

    async delete(offerId) {
        try {
            let res = await Axios.post(`/offer/delete/${offerId}`)
            console.log(res)
            Toast.success('删除成功')
            this.onRefresh()
        } catch (e) {
            alert(e.res.retMsg)
        }
    }

    render() {
        const row = (item, tindex, index) => {
            return (
                <div className="listItem" key={index}>
                    <SwipeAction
                        key={index}
                        autoClose
                        right={[
                            {
                                text: '取消',
                                onPress: () => console.log('cancel'),
                                style: { backgroundColor: '#ccc', color: 'white' },
                            },
                            {
                                text: '删除',
                                onPress: () => { this.delete(item.id) },
                                style: { backgroundColor: '#24C789', color: 'white' },
                            },
                        ]}
                        className="listItem">
                        <div className="ctt" onClick={() => {
                            var { page, scrollTop, allPage, dataList } = this.state
                            var { initScrollTop, initData, initPage, initAllPage } = this.props
                            initScrollTop(scrollTop)
                            initData(dataList)
                            initPage(page)
                            initAllPage(allPage)
                            goPage(`/mine/myBaojia/detail/${item.id}`)
                        }}>
                            <div className="title" style={{ 'WebkitBoxOrient': 'vertical' }}>【{item.offerTypeName}】{item.title}</div>
                            <div className="btm">
                                <div className="time">
                                    <div className="imgCtn">
                                        <img alt="" src={require("common/img/clock.png")}></img>
                                    </div>
                                    <div className="txt">{item.updateTime}</div>
                                </div>
                                <div className="status" style={{ color: item.type == 1 ? '#666' : item.type == 3 ? '#BF0404' : "#24C789" }}>{item.typeDesc.name}</div>
                            </div>
                        </div>
                    </SwipeAction>
                </div>
            )
        }
        return (
            <main className="myBaojia-page">
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
                            onScroll={() => {
                                var scrollTop = ReactDOM.findDOMNode(this.refs.list).scrollTop
                                this.state.scrollTop = scrollTop
                            }}
                            scrollEventThrottle={10}
                            style={{
                                height: document.documentElement.clientHeight
                            }}
                            pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={50}
                        />
                    </div>
                    {this.state.dataList.length === 0 && this.state.finish ? <Nodata /> : null}
                </div>
            </main >
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.myBaojia
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
)(MyBaojia)