import React from 'react'
import ReactDOM from 'react-dom';
import { PullToRefresh, ListView } from 'antd-mobile'
import Constant from 'util/Constant'
import { withRouter } from 'react-router-dom';

import { Axios, goBack } from 'util/util'
import Nodata from 'common/nodata/Nodata'
import './ShopList.less'

class ShopList extends React.Component {
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
                <div className="shop-item flex-between" key={index} onClick={() => {
                    Constant.data.storesVos = item
                    Constant.data.storesId = item.id
                    goBack()
                }}>
                    <div className="poster"><img src={item.photoFileId ? imgUrl + item.photoFileId : require('common/img/0.jpg')} alt="" /></div>
                    <div className="shop-info">
                        <div className="name">{item.name}</div>
                        <div className="addr">{item.city}{item.area}{item.address}</div>
                        <div className="tel">{item.tel}</div>
                    </div>
                </div>
            )
        }
        return (
            <main className="shopList-component">
                <div className="list">
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
                                </div> : <Nodata />}</div>
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
                            height: `calc(${document.documentElement.clientHeight}px - 6.2rem)`,
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


export default withRouter(ShopList)