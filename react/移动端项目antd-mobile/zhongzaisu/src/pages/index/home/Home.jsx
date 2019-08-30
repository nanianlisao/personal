import React from 'react'
import 'pages/index/home/Home.less'
import ReactDOM from 'react-dom'
import { goPage, Axios } from 'util/util'
import NoticeBar from 'common/noticeBar/NoticeBar'
import { PullToRefresh } from 'antd-mobile'
import LazyLoad from 'react-lazyload';
import Constant from 'util/Constant'
import { connect } from 'react-redux'
import { initScrollTop, initData, dataClear } from '@/reducers/home'
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            NoticeArr: [],
            offerList: [],
            infoList: [],
        }
    }

    componentDidMount() {
        console.log('首页')
        var { scrollTop, data } = this.props
        if (data.length === 3) {    // 用户页面回退
            this.setState({
                NoticeArr: data[0],
                offerList: data[1],
                infoList: data[2],
            }, () => {
                ReactDOM.findDOMNode(this.refs.list).scrollTop = scrollTop
                this.props.dataClear()
            })
        } else {
            this.init()
        }
    }


    init() {
        this.getNoticeList()
        this.getOfferList()
        this.getInfoList()
    }

    async getNoticeList() {
        let res = await Axios.get(`app/inform/message/${Constant.data.app_id}`)
        this.setState({
            NoticeArr: res.data
        })
    }

    async getOfferList() {
        var res = await Axios.get('/offer/today/list/applet', {
            appId: Constant.data.app_id
        })
        this.setState({
            offerList: res.data.items
        })
    }

    async getInfoList() {
        var res = await Axios.get(`/information/applet/list/${Constant.data.app_id}`)
        // res.data = res.data.slice(0,1)
        this.setState({
            infoList: res.data
        })
    }

    reduxData() {
        let { NoticeArr, offerList, infoList } = this.state
        var { initScrollTop, initData } = this.props
        let scrollTop = ReactDOM.findDOMNode(this.refs.list).scrollTop
        initScrollTop(scrollTop)
        initData([NoticeArr, offerList, infoList])
    }

    render() {
        let { NoticeArr, offerList, infoList, imgUrl } = this.state
        return (
            <PullToRefresh
                damping={60}
                ref="list"
                className="aaaa"
                style={{
                    height: '100%',
                    overflow: 'auto',
                }}
                direction='down'
                refreshing={this.state.refreshing}
                onRefresh={async () => {
                    this.setState({ refreshing: true });
                    await this.init()
                    setTimeout(() => {
                        this.setState({ refreshing: false });
                    }, 500);
                }}
            >
                <main className="home-page">
                    <div>
                    <div className="top">
                        <NoticeBar text={
                            <span>
                                {NoticeArr.map((item, index) => (
                                    <span key={index} style={{ marginRight: '0.2rem' }}>{index + 1}. {item.content}</span>
                                ))}
                            </span>
                        }  >

                        </NoticeBar>
                    </div>
                    <div className='sectionTitle todayInfo'>今日报价</div>
                    <div className='board'>
                        {offerList.map((item, index) => (
                            <div className='boardItem left' key={index}>
                                <div className='name'>{item.name}</div>
                                <div className='num'>{item.content}</div>
                                <div className='time'>更新于{item.addTime}</div>
                            </div>
                        ))}
                    </div>
                    {infoList.map((bItem, bIndex) => (
                        <div className='infoList' key={bIndex}>
                            <div className='sectionTitle nowInfo'>
                                <span>{bItem.name}</span>
                                <span onClick={() => {
                                    this.reduxData()
                                    goPage(`/home/list?id=${bItem.id}`)
                                }}>更多</span>
                            </div>
                            {bItem.informationVoPageBean.items.map((item, index) => (
                                <div key={index} onClick={() => {
                                    this.reduxData()
                                    goPage(`/home/detail/${item.id}`)
                                }}>
                                    {item.type == 1
                                        ? <div className='listItem' >
                                            <div className='left'>
                                                <div className='top' style={{ 'WebkitBoxOrient': 'vertical' }}>{item.title}</div>
                                                <div className='btm'>
                                                    <div className='time'>
                                                        <div className='imgCtn'>
                                                            <img src={require("common/img/clock.png")}></img>
                                                        </div>
                                                        <div className='txt'>{item.addTime}</div>
                                                    </div>
                                                    <div className='viewNum'>
                                                        <div className='imgCtn'>
                                                            <img src={require("common/img/eye.png")}></img>
                                                        </div>
                                                        <div className='txt'>{item.addReadTimes}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='right imgCtn'>
                                                <LazyLoad
                                                    overflow={true}
                                                    // scroll={true}
                                                    placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                                                    height="100%"
                                                >
                                                    <img src={imgUrl + item.imgFileId + '?x-oss-process=image/resize,w_300'}></img>
                                                </LazyLoad>
                                            </div>
                                        </div>
                                        : <div className="videoPart">
                                            <div className="title">{item.title}</div>
                                            <div className="videoCtn">
                                                <div className='mask'></div>
                                                <img src={require('common/img/play.png')} className='play-btn'></img>
                                                <img src={imgUrl + item.imgFileId + '?x-oss-process=image/resize,w_300'} className='poster'></img>
                                            </div>
                                            <div className='btm'>
                                                <div className='time'>
                                                    <div className='imgCtn'>
                                                        <img src={require("common/img/clock.png")}></img>
                                                    </div>
                                                    <div className='txt'>{item.addTime}</div>
                                                </div>
                                                <div className='viewNum'>
                                                    <div className='imgCtn'>
                                                        <img src={require("common/img/eye.png")}></img>
                                                    </div>
                                                    <div className='txt'>{item.addReadTimes}</div>
                                                </div>
                                            </div>
                                        </div>}
                                </div>
                            ))}

                        </div>
                    ))}
                    </div>
                </main >
            </PullToRefresh>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return state.home
}

const mapDispatchToProps = (dispatch) => {
    return {
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
)(Home)

