import React from 'react'
import { InputItem, SearchBar, Carousel,Modal } from 'antd-mobile'
import 'pages/index/quanzi/Quanzi.less'
import QuanziList from 'components/quanziList/QuanziList'
import { goPage, Axios, postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant'
const alert = Modal.alert
export default class Quanzi extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            banner: {},
            refresh: false,
            newsCount: 0,
            sortType: "",
            kindType: "",
            longitude: "",
            latitude: "",
            staticData: {},
            tab: [{ name: '最新发布', id: 1 }, { name: '热门发布', id: 2 }, { name: '距离最近', id: 3 }],
            kindTab: [{
                name: "采购",
                img: require('common/img/cart.png'),
                kind: 1
            }, {
                name: "销售",
                img: require('common/img/bookPlus.png'),
                kind: 2
            }]
        }
    }
    componentWillMount() {
        console.log('圈子')
        var quanziTab = localStorage.getItem('quanziTab')
        if (quanziTab) {
            localStorage.removeItem('quanziTab')
            quanziTab = JSON.parse(quanziTab)
            this.state.sortType = quanziTab.sort
            this.state.kindType = quanziTab.type
            this.state.longitude = quanziTab.lon
            this.state.latitude = quanziTab.lat

        }
        this.getStaticData()
        this.getBannerList()
        if (localStorage.getItem('token')) {
            this.getNewQuanziCount() // 获取我圈子收到的新消息
        }
    }

    async getNewQuanziCount() {
        let res = await Axios.get('/circle/comment/mine/receive/count')
        this.setState({
            newsCount: res.data
        })
    }

    async getStaticData() {
        let res = await Axios.get('/circle/statistics', {
            appId: Constant.data.app_id
        })
        this.setState({
            staticData: res.data,
        })
    }

    async getBannerList() {
        let res = await Axios.get(`/banner/list/applet/${Constant.data.app_id}`)
        this.setState({
            banner: res.data,
            refresh: true
        })

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

    render() {
        let { sortType, kindType, kindTab, staticData, imgUrl, banner } = this.state
        const header = () => {
            return (
                <div>
                    <div className="swiperCtn">
                        {/* <Carousel
                            className='top-swiper'
                            infinite
                            autoplay={true}
                            dotStyle={{ background: '#fff', width: '0.2rem', height: '0.2rem' }}
                            dotActiveStyle={{ background: '#fc612a', width: '0.2rem', height: '0.2rem' }}
                        >
                            {[1].map((val, i) => (
                                <img
                                    src={imgUrl + banner.imgFileId}
                                    alt="2222"
                                    className="slider_image"
                                    key={i}
                                />
                            ))}
                        </Carousel> */}
                        <img
                            src={imgUrl + banner.imgFileId}
                            alt=""
                            className="slider_image"
                        />
                        <div onClick={() => { goPage('/quanzi/search') }}>
                            <SearchBar
                                className="search-bar"
                                placeholder="搜索" maxLength={15}
                                showCancelButton={false}
                                disabled={true}
                                clearTextOnFocus={false}
                            />
                        </div>
                    </div>
                    <div className="tabs">
                        {this.state.tab.map((item, index) => {
                            return (
                                <div key={index} onClick={() => {
                                    if (index == 2) {
                                        postMessage('getLocation', 'location')
                                        onMessage('location', (data) => {
                                            this.setState({
                                                sortType: item.id,
                                                latitude: data.latitude,
                                                longitude: data.longitude
                                            })
                                        })
                                    } else {
                                        this.setState({
                                            sortType: item.id,
                                            longitude: "",
                                            latitude: ""
                                        })
                                    }

                                }} className={["tab", item.id === sortType ? 'ac' : ''].join(" ")} >{item.name}</div>
                            )
                        })}
                    </div>
                    <div className="mid">
                        <div className="top">
                            {kindTab.map((item, index) => {
                                return (
                                    <div className="item" key={index} onClick={() => {
                                        this.setState({
                                            kindType: item.kind
                                        })
                                    }}>
                                        <div className="imgCtn">
                                            <img src={item.img} mode='aspectFill'></img>
                                        </div>
                                        <div className="txt">{item.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="btm-wrap">
                            <div className="btm">
                                <div className='btmView'>
                                    <div className="item">浏览：{staticData.fictitiousBrowseCount}</div>
                                    <div className="item">评论：{staticData.commentCount}</div>
                                </div>
                                <div className='btmView'>
                                    <div className="item">发帖：{staticData.circleCount}</div>
                                    <div className="item">分享：{staticData.shareCount}</div>
                                </div>
                            </div>
                            {this.state.newsCount ? <div className="newCount" onClick={() => {
                                goPage('/mine/myReceived?type=1')
                            }}>
                                <img src={require('common/img/bell.png')} alt="" />
                                <span>您有{this.state.newsCount}条新消息</span>
                            </div> : ""}
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <main className="quanzi-page">
                <div>
                    <QuanziList
                        header={header}
                        loadUrl='/circle/list'
                        json={{
                            sort: this.state.sortType,
                            type: this.state.kindType,
                            lon: this.state.longitude,
                            lat: this.state.latitude,
                            appId: Constant.data.app_id
                        }}
                        refresh={this.state.refresh}
                        goDetailCallback={() => {
                            localStorage.setItem('quanziTab', JSON.stringify({
                                sort: this.state.sortType,
                                type: this.state.kindType,
                                lon: this.state.longitude,
                                lat: this.state.latitude
                            }))
                        }}

                    /></div>
                <div className="releaseBtn" onClick={async () => {
                    var res = await this.getMemberDetail()
                    if (res.level == 1) {
                        alert('提示', '您没有权限发布圈子，升级会员享受更高权力', [
                            { text: '取消' },
                            {
                                text: '去升级', onPress: () => {
                                    goPage('/mine/levelUp')
                                }
                            }
                        ])
                    } else {
                        goPage('/quanzi/chooseType')
                    }
                }}>发布</div>
            </main >
        )
    }
}