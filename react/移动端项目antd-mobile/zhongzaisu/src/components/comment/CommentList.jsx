import React from 'react'
import 'components/comment/Comment.less'
import AddComment from 'components/comment/AddComment'
import { Axios, isHttpImg } from 'util/util'
import Constant from 'util/Constant'
import { PullToRefresh, ListView, Toast } from 'antd-mobile'
import Nodata from 'common/nodata/Nodata'

export default class CommentList extends React.Component {
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
        saveJson: {},
        replyJson: {},
        showSaveButton: true,
        offsetTop: 0,
        header: ""
    }
    componentWillReceiveProps(props) {
        return
        if (JSON.stringify(props.json) !== JSON.stringify(this.props.json)) {
            this.setState({
                dataList: [],
                page: 1,
                pageSize: 10,
                allPage: 1,
                finish: false,
                refreshing: false,
                down: false,
            }, () => {
                this.getDataList(true)
            })
        }
    }

    onChange(e) {
        this.setState({
            body: e
        })
    }

    saveComment() {
        this.state.type = "save"
        this.refs.addComment.show()
    }

    async onSubmit() {
        if (!this.state.body) {
            Toast.fail('请输入评论内容')
            return
        }
        if (this.state.type == 'save') {
            console.log('发布')
            await Axios.post(this.props.saveUrl, {
                ...this.props.saveJson, ...{
                    body: this.state.body,
                    circleId: this.props.json.id,
                }
            })
            Toast.success('发布评论成功')
        } else if (this.state.type == 'reply') {
            console.log('回复')
            await Axios.post(this.props.replyUrl, {
                ...this.props.replyJson, ...{
                    body: this.state.body,
                    repliedBody: this.state.repliedBody,
                    offerCommentId: this.state.offerCommentId,
                    repliedUserId: this.state.repliedUserId,
                    circleCommentId: this.state.circleCommentId,
                }
            })
            Toast.success('回复评论成功')
        }
        if (this.props.onSubmit) {
            this.props.onSubmit()
        }
        this.onRefresh()
        this.state.body = ''
    }


    componentDidMount() {
        this.getDataList()
    }

    async getDataList(init) {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get(this.props.loadUrl, Object.assign({
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize
            }, this.props.json))

            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
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
                <section className="comment-item" key={index}>
                    <div className="comment-header">
                        <img src={isHttpImg(item.avatarUrl) ? item.avatarUrl : imgUrl + item.avatarUrl} alt="" />
                        <span className="nick-name">{item.memberName}</span>
                    </div>
                    <div className="comment-content">
                        <p className="comment-info">{item.body}</p>
                        <div className="comment-footer">
                            <div>{item.addTime}</div>
                            <div className="reply" onClick={() => {
                                this.state.repliedUserId = item.userId
                                this.state.offerCommentId = item.id
                                this.state.circleCommentId = item.id
                                this.state.repliedBody = item.body
                                this.state.type = 'reply'
                                this.refs.addComment.show()
                            }}>
                                <img src={require('./reply.png')} alt="" />
                                <span>回复</span>
                            </div>
                        </div>
                        {item.offerReplyVos && item.offerReplyVos.length > 0 ? <div className="reply-list">
                            {item.offerReplyVos.map((x, i) => (
                                <div className="reply-item" key={i} onClick={() => {
                                    this.state.repliedUserId = x.userId
                                    this.state.offerCommentId = item.id
                                    this.state.circleCommentId = item.id
                                    this.state.repliedBody = x.body
                                    this.state.type = 'reply'
                                    this.refs.addComment.show()
                                }}>
                                    <span className="nickName">{x.memberName}</span>回复<span className="nickName" style={{ marginLeft: '0.1rem' }}>{x.repliedMemberName}：</span>{x.body}
                                </div>
                            ))}
                        </div> : ""}
                        {item.circleReplyVoList && item.circleReplyVoList.length > 0 ? <div className="reply-list">
                            {item.circleReplyVoList.map((x, i) => (
                                <div className="reply-item" key={i} onClick={() => {
                                    this.state.repliedUserId = x.userId
                                    this.state.offerCommentId = item.id
                                    this.state.circleCommentId = item.id
                                    this.state.repliedBody = x.body
                                    this.state.type = 'reply'
                                    this.refs.addComment.show()
                                }}>
                                    <span className="nickName">{x.memberName}</span>回复<span className="nickName" style={{ marginLeft: '0.1rem' }}>{x.repliedMemberName}：</span>{x.body}
                                </div>
                            ))}
                        </div> : ""}

                    </div>
                </section>
            )
        }
        return (
            <main className="commentListDetail-page">
                <div className="comment-list">
                    <div>
                        <ListView
                            ref="list"
                            key={1}
                            dataSource={this.state.dataSource}
                            renderFooter={() => {
                                return (
                                    <div>  {this.state.dataList.length > 0 ? <div style={{ textAlign: 'center' }}>
                                        {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                                    </div> : <Nodata />}</div>

                                )
                            }}
                            renderRow={row}
                            renderHeader={() => {
                                return (
                                    <div>
                                        {this.props.header}
                                        <header className="comment-top">
                                            <span>全部评论（{this.state.totalCount}）</span>
                                            {this.props.showSaveButton ? <span
                                                className="add-comment"
                                                onClick={() => {
                                                    this.saveComment()
                                                }}>评论<img src={require('common/img/write.png')}></img></span> : ""}
                                        </header>
                                    </div>
                                )
                            }}
                            // useBodyScroll={true}
                            // onScroll={() => {
                            //     var scrollTop = getScrollTop()
                            //     this.state.scrollTop = scrollTop
                            // }}
                            // scrollEventThrottle={10}
                            style={{
                                height: document.documentElement.clientHeight - this.props.offsetTop,
                            }}
                            pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={50}
                        />
                        {/* {this.state.dataList.length == 0 && this.state.finish ? <Nodata /> : null} */}
                    </div>

                </div>
                <AddComment
                    ref="addComment"
                    loadUrl={this.props.loadUrl}
                    onChange={this.onChange.bind(this)}
                    onSubmit={this.onSubmit.bind(this)}
                />
            </main >
        )
    }
}