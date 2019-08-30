
import React from 'react'
import ReactDOM from 'react-dom';
import './Extend.less'
import { goPage, Axios, isHttpImg } from 'util/util'
import { PullToRefresh, ListView } from 'antd-mobile'
import Nodata from 'common/nodata/Nodata'
import Constant from 'util/Constant'

export default class Extend extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            virtualMoney: 0,
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


    componentWillMount() {
        console.log('componentDidMount 发起请求数据')
        this.getHeaderInfo()
        this.getDataList()
    }

    // 获取顶部虚拟币数量   
    async getHeaderInfo() {
        let res = await Axios.post('/distribution/find/my')
        console.log(res)
        this.setState({
            virtualMoney: res.data
        })
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get('/distribution/list/distribution/detail/my', {
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize
            })
            let allPage = Math.ceil(res.data.totalCount / pageSize)
            let data = res.data.items
            console.log(data)
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
    render() {
        let { imgUrl } = this.state
        const row = (item, tindex, index) => {
            return (
                <div className="extend-item border2" key={index}>
                    <div className="extend-header flex-center">
                        <div className="avatar">
                            <img src={item.avatarUrl?item.avatarUrl:require('common/img/0.jpg')} alt="" />
                        </div>
                        <div className="extend-info flex-between border2">
                            <div>
                                <div className="user-name">{item.beSharedUserName}</div>
                                <div className="add-time">{item.addTime}</div>
                            </div>
                            <div className="income">+{item.virtualMoney}虚拟币</div>
                        </div>
                    </div>
                    <div className="extend-goods">

                        <div className="goods-item flex-between">
                            <div className="poster">
                                <img src={imgUrl + item.goodsTemplateImgFileId} alt="" />
                            </div>
                            <div className="name text-overflow-2" style={{ WebkitBoxOrient: 'vertical' }}>{item.goodsTemplateName}</div>
                        </div>
                        {/* <div className="show-more flex-middle">
                            <span>查看更多</span>
                            <img src={require('common/img/arrowRG.png')} alt="" />
                        </div> */}
                    </div>
                </div>
            )
        }
        return (
            <main className="page-extend">
                <div className="extend-list">
                    <ListView
                        ref="list"
                        key={1}
                        initialListSize={100}
                        dataSource={this.state.dataSource}
                        renderHeader={() => (
                            <div>
                                <section className="top" >
                                    <div className="top-info flex-middle" style={{
                                        backgroundImage: `url(${require('common/img/extend_bg.png')})`,
                                    }}>
                                        <img src={require('common/img/gold.png')} alt="" />
                                        <span>我的虚拟币：{this.state.virtualMoney}</span>
                                    </div>
                                </section>
                                <div className="extend-wrap"><div className="title border2">推广记录</div></div>
                            </div>
                        )}
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
                            height: `calc(${document.documentElement.clientHeight}px - 0.4rem)`,
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
            </main >
        )
    }
}
