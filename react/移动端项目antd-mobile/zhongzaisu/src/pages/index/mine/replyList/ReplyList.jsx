import React from 'react'
import { goPage, Axios } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import Nodata from 'common/nodata/Nodata'
import Constant from 'util/Constant'
import "pages/index/mine/replyList/ReplyList.less"
export default class ReplyList extends React.Component {
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
        this.getDataList()
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/message/list/apply', {
                categoryId: this.state.categoryId,
                startIndex: (this.state.page - 1) * pageSize,
                pageSize: pageSize
            })
            // let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data
            console.log(data)
            this.state.dataList = [...this.state.dataList, ...data]
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.dataList),
                refreshing: false,
                finish: true,
                // allPage,
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
                <div key={index} className="reply-item">
                    <div className="header"><span className="dots"></span> <span>{item.title}</span></div>
                    <div className="date">{item.addTime}</div>
                </div>
            )
        }
        return (
            <main className="replyList-page">
                <div>
                    <ListView
                        ref="list"
                        key={1}
                        initialListSize={15}
                        dataSource={this.state.dataSource}
                        renderFooter={() => {
                            return (
                                <div>  {this.state.dataList.length > 0 ? <div style={{ textAlign: 'center' }}>
                                    {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                                </div> : <Nodata />}</div>

                            )
                        }}
                        renderRow={row}
                        // useBodyScroll={true}
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


