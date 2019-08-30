import React from 'react'
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView, Toast, Modal } from 'antd-mobile'
import Constant from 'util/Constant'
import 'components/quanziList/QuanziList.less'
import { goPage, Axios, isHttpImg } from 'util/util'
import Nodata from 'common/nodata/Nodata'
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux'
import { initPage, initScrollTop, initData, dataClear, initAllPage } from '@/reducers/quanzi'
const alter = Modal.alert
class QuanziList extends React.Component {
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
                // dataList: [],
                page: 1,
                pageSize: 10,
                allPage: 1,
                finish: false,
                refreshing: false,
                down: false,
            }, () => {
                this.getDataList(true)
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
                // setTimeout(() => {
                // this.refs.list.scrollTo({ x: 0, y: scrollTop })
                // if (this.refs.list) {
                this.refs.list.scrollTo(0, scrollTop)
                this.props.dataClear()
                // }
                // }, 100)
            })
        } else {
            console.log('componentDidMount 发起请求数据')
            this.getDataList()
        }

    }

    async getDataList(init) {
        console.log('圈子列表发起请求')
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get(this.props.loadUrl, Object.assign({
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize
            }, this.props.json))
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
            data.map((x) => {
                if (x.fileId) {
                    x.imgs = x.fileId.split(',')
                } else {
                    x.imgs = []
                }
            })
            if (init) {
                this.state.dataList = data
            } else {
                this.state.dataList = [...this.state.dataList, ...data]
            }
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

    // 删除圈子
    async delCircle(id) {
        alter('提示', '删除圈子后不可恢复', [{
            text: '取消'
        }, {
            text: '确定', onPress: async () => {
                let res = await Axios.post(`/circle/delete/my/${id}`, {}, true)
                Toast.success('删除成功', 0.5)
                setTimeout(this.onRefresh, 500)
            }
        }])
    }

    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true,
            isLoading: true
        })
        this.refs.list.scrollTo(0, 0)
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
        let { imgUrl } = this.state
        const row = (item, tindex, index) => {
            return (
                <div className="cttItem" key={index} onClick={() => {
                    var { page, scrollTop, allPage } = this.state
                    var { initScrollTop, initData, initPage, initAllPage } = this.props
                    initScrollTop(scrollTop)
                    initData(this.state.dataList)
                    initPage(page)
                    initAllPage(allPage)
                    if (this.props.goDetailCallback) {
                        this.props.goDetailCallback()
                    }
                    goPage(`/quanzi/detail/${item.id}`)
                }}>
                    <div className="top">
                        <div className="profile imgCtn">
                            <LazyLoad
                                overflow={true}
                                placeholder={<img alt="" src={require('common/img/a.png')}></img>}
                                height="100%"
                            >
                                <img alt="" src={isHttpImg(item.avatarUrl) ? item.avatarUrl : imgUrl + item.avatarUrl} />
                            </LazyLoad>
                        </div>
                        <div className="right">
                            <div className="uInfo">
                                <div className="name">{item.memberName}</div>
                                <div className="city">{item.memberAddress}</div>
                                <div className="tag">{item.typeDesc.name}</div>
                            </div>
                            <div className="time">{item.operatorTime}</div>
                        </div>
                    </div>
                    <div className="main">
                        <div className="txt" style={{ 'WebkitBoxOrient': 'vertical' }}>{item.body}</div>
                        {item.fileId ?
                            <div>
                                {item.fileType == 1
                                    ? <div className="imgs">
                                        {item.imgs.map((x, index) => (
                                            <div className="imgCtn" key={index}>
                                                {index < 3 ?
                                                    <LazyLoad
                                                        key={index}
                                                        overflow={true}
                                                        placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                                                        height="100%"
                                                        offset={[0, 0]}
                                                    >
                                                        <img alt="" src={imgUrl + x + '?x-oss-process=image/resize,w_300'}></img>
                                                    </LazyLoad>
                                                    : ""}
                                            </div>
                                        ))}
                                        {item.imgs.length > 3 ? <div className="masks">+{item.imgs.length - 3}</div> : ""}
                                    </div>
                                    :
                                    <div className="videoCtn">
                                        <div className='mask'></div>
                                        <img alt="" src={require('common/img/play.png')} className='play-btn'></img>
                                        <LazyLoad
                                            overflow={true}
                                            placeholder={<img alt="" className='poster' src={require('common/img/0.jpg')}></img>}
                                        >
                                            <img alt="" src={imgUrl + item.coverFileId} className='poster'></img>
                                        </LazyLoad>
                                    </div>
                                }
                            </div>
                            : ""}
                    </div>
                    <div className="loc">
                        <div className="imgCtn">
                            <img alt="" src={require("common/img/loc.png")}></img>
                        </div>
                        <span>{item.address}</span>
                    </div>
                    <div className="btm">
                        <div className='item'>
                            <div className="imgCtn eye">
                                <img alt="" src={require("common/img/eye.png")}></img>
                            </div>
                            <span>{item.fictitiousBrowseCount}</span>
                        </div>
                        <div className='item'>
                            <div className="imgCtn dialog">
                                <img alt="" src={require("common/img/dialog.png")}></img>
                            </div>
                            <span>{item.commentCount}</span>
                        </div>

                        <div className='item'>
                            <div className="imgCtn good">
                                <img alt="" className='zan_img' src={item.likes ? require("common/img/good_ac.png") : require("common/img/good.png")}></img>
                            </div>
                            <span>{item.likesCount}</span>
                        </div>
                        {item.myCircle ? <div className='item item-last' onClick={(e) => {
                            e.stopPropagation()
                            this.delCircle(item.id)
                        }}>
                            <div className="imgCtn good">
                                <img alt="" className='zan_img' src={require("common/img/del.png")}></img>
                            </div>
                            <span>删除</span>
                        </div> : ""}
                    </div>
                    {/* <div className="replyCtn">
                            <div className='more_comments'>谭景立:收聚酯瓶沫13833485371</div>
                            <div className='more_comments'>张子硕:塑料机械公司路过</div>
                            <div className='more_comments'>陶贵明:粉碎机刀片厂家15555595160</div>
                            <div className='get_more_info'>更多回复</div>
                        </div> */}
                </div>
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
                </div>
            </main >
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.quanzi
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
)(QuanziList)