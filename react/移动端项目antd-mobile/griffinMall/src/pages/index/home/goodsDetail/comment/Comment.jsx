import React from 'react'
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import './Comment.less'
import { postMessage, Axios, parseQueryString } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import Nodata from 'common/nodata/Nodata'

import Constant from 'util/Constant'

class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: '',
            tab: [{ name: '全部', type: '' }, { name: '好评', type: 1 }, { name: '中评', type: 2 }, { name: '差评', type: 3 }]
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.setState({
            goodsTemplateId: options.id
        })
    }
    render() {
        let { tab, type } = this.state
        return (
            <main className="comment-page">
                <div className="top-tab flex-center">
                    {tab.map((x, i) => (
                        <div className={["tab-item", type === x.type ? 'act' : ''].join(' ')} key={i} onClick={() => {
                            this.setState({
                                type: x.type
                            })
                        }}>
                            <span>{x.name}</span>
                        </div>
                    ))}
                </div>
                <CommentList
                    loadUrl='/goods/comment/list/app'
                    json={{
                        goodsTemplateId: this.state.goodsTemplateId,
                        type: type
                    }}
                />
            </main >
        )
    }
}

class CommentList extends React.Component {
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
                isShowMore: false,
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
        console.log('componentDidMount 发起请求数据')
        this.getDataList()
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
            data.map((x) => {
                if (x.imgFileId) {
                    x.imgs = x.imgFileId.split(',')
                } else {
                    x.imgs = []
                }
                x.imgslice = x.imgs.slice(0, 3)
                x.isShowMore = false
            })
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

    async trogglePraise(index) {
        let { dataList } = this.state
        let current = dataList[index]
        let res = await Axios.post(`/goods/comment/likes/${current.id}`)
        current.likes = current.like ? current.likes - 1 : current.likes + 1
        current.like = !current.like
        this.setState({
            dataList
        })

    }
    render() {
        console.log(this.state.dataList)
        let { imgUrl } = this.state
        const row = (item, tindex, index) => {
            return (
                <div className="comment-item">
                    <div className="comment-header flex-center">
                        <img src={item.avatarUrl} alt="" />
                        <span>{item.nickName}</span>
                    </div>
                    <div className="comment-body">{item.body?item.body:'此用户没有填写评价'}</div>
                    <div className="comment-img">
                        {item.imgslice.map((x, i) => {
                            return (
                                <img src={imgUrl + x} alt="" key={i} onClick={() => {
                                    var urls = item.imgs.map(x => imgUrl + x)
                                    postMessage('previewImage', { urls: urls, index: i })
                                }} />
                            )
                        })}
                        {item.imgs.length > 3 && (!item.isShowMore) ? <div className="mask flex-middle" onClick={() => {
                            item.imgslice = item.imgs
                            item.isShowMore = true
                            this.setState({
                                dataList:this.state.dataList,
                            })
                        }}>
                            <span>{item.imgs.length - 3}+</span>
                            <span>查看更多</span>
                        </div> : ""}
                    </div>
                    <div className="comment-footer flex-between">
                        <div className="date">{item.addTime}</div>
                        <div className={["praise flex-middle", item.like ? 'like' : ''].join(' ')} onClick={this.trogglePraise.bind(this, index)}>
                            <img src={item.like ? require('common/img/praise_ac.png') : require('common/img/praise.png')} alt="" />
                            <span>{item.likes}</span>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <main className="comment-component">
                <div className="comment-list">
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
                            height: `calc(${document.documentElement.clientHeight}px - 1.1rem)`,
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
            </main>
        )
    }
}

export default withRouter(Comment)
