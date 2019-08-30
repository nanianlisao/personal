import React from 'react'
import { withRouter } from 'react-router-dom';
import { PullToRefresh, ListView, Modal } from 'antd-mobile'
import 'components/huangyeList/HuangyeList.less'
import Constant from 'util/Constant'
import LazyLoad from 'react-lazyload';
import Nodata from 'common/nodata/Nodata'
import { goPage, Axios, postMessage, isHttpImg } from 'util/util'
const alert = Modal.alert
class HuangyeList extends React.Component {
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

        }
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
        console.log('黄页列表')
        this.getDataList()
    }

    getMemberDetail() {
        if (localStorage.getItem('token')) {
            if (Constant.data.timerss && Date.now() - Constant.data.timerss <= 60 * 1000) {  // 更新数据
                return Constant.data.memberDetail
            } else {
                return Axios.get('/member/final/level').then((res) => {
                    Constant.data.timerss = Date.now()
                    Constant.data.memberDetail = res.data
                    return res.data
                })
            }
        } else {
            return {}
        }
    }

    async getDataList() {
        let pageSize = this.state.pageSize
        try {
            let res = await Axios.get(this.props.loadUrl, Object.assign({
                startIndex: (this.state.page - 1) * this.state.pageSize,
                pageSize: this.state.pageSize,
                appId: Constant.data.app_id
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
                <div className="listItem load" key={index}>
                    <div className="profile imgCtn">
                        <LazyLoad
                            overflow={true}
                            placeholder={<img alt="" src={require('common/img/a.png')}></img>}
                            height="100%"
                        >
                            <img src={isHttpImg(item.avatarUrl) ? item.avatarUrl : imgUrl + item.avatarUrl}></img>
                        </LazyLoad>
                    </div>
                    <div className="mid">
                        <div className="top">
                            <div className="name">{item.name}</div>
                            <div className="city">{item.city}{item.area}{item.address}</div>
                        </div>
                        <div className="product">
                            {/* <div className="item">
                                <div className="title">产品：</div>
                                <div className="ctt">清洗瓶片</div>
                            </div> */}

                            {item.moto ? <div className="item">
                                <div className="title">月产：</div>
                                <div className="ctt">{item.moto}</div>
                            </div> : ""}
                            <div className="item">
                                <div className="title">行业： </div>
                                <div className="ctt">{item.memberIndustryVo.name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="call" onClick={async () => {
                        if (item.tel) {
                            postMessage('callphone', item.tel)
                        } else {
                            var res = await this.getMemberDetail()
                            if (res.level == 1 || res.level == 2) {
                                alert('提示', '您没有权限拨打电话，升级会员享受更高权力', [
                                    { text: '取消' },
                                    {
                                        text: '去升级', onPress: () => {
                                            goPage('/mine/levelUp')
                                        }
                                    }
                                ])
                            } else if (JSON.stringify(res) == '{}') {
                                alert('提示', '您还未登录，是否前往登录', [
                                    { text: '暂不' },
                                    {
                                        text: '去登录', onPress: () => {
                                            this.props.history.push('/login')
                                        }
                                    }
                                ])
                            }
                        }
                    }}>
                        <div className="imgCtn">
                            <img src={require("common/img/call.png")}></img>
                        </div>
                        <div className="txt"> 联系Ta</div>
                    </div>
                </div>
            )
        }
        return (
            <main className="huangye-component">
                <div className="list">
                    <div className="box">
                        <div style={{ display: this.state.dataList.length > 0 ? 'block' : 'none' }}>
                            <ListView
                                ref="list"
                                key={1}
                                dataSource={this.state.dataSource}
                                renderFooter={() => (<div style={{ textAlign: 'center' }}>
                                    {this.state.allPage === this.state.page ? '数据加载完了' : '加载中'}
                                </div>)}
                                renderRow={row}
                                // useBodyScroll={true}
                                // onScroll={() => {
                                //     var scrollTop = getScrollTop()
                                //     this.state.scrollTop = scrollTop
                                // }}
                                scrollEventThrottle={10}
                                style={{
                                    height: document.documentElement.clientHeight - 125
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
                </div>
            </main >
        )
    }
}
export default withRouter(HuangyeList)