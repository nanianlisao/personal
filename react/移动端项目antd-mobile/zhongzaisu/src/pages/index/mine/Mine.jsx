import React from 'react'
import { InputItem, SearchBar, Carousel, Picker } from 'antd-mobile'
import 'pages/index/mine/Mine.less'
import Constant from 'util/Constant'
import { goPage, Axios, postMessage, isHttpImg } from 'util/util'
export default class Mine extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            detail: {},
            shop: {},
            linkArr: [{
                name: "我发布的",
                img: require("common/img/gift.png"),
                linkTo: "/mine/myRelease"
            },
            {
                name: "我收到的",
                img: require("common/img/service.png"),
                linkTo: "/mine/myReceived?type=1",
                count: 0
            }, {
                name: "我的报价",
                img: require("common/img/person.png"),
                linkTo: "/mine/myBaojia"
            }, {
                name: "报价回复",
                img: require("common/img/bookMoney.png"),
                linkTo: "/mine/myReceived?type=2",
                count: 0
            }]
        }
    }

    componentDidMount() {
        console.log('我的')
        this.getServierPhone()
        if (localStorage.getItem('token')) {
            this.loadPage()
        }
    }

    async getServierPhone() {
        let res = await Axios.get(`/appService/find/applet/${Constant.data.app_id}`)
        console.log(res)
        this.setState({
            shop: res.data
        })
    }



    loadPage() {
        this.getMemberDetail()
        this.getNewQuanziCount() // 获取我圈子收到的新消息
        this.getNewBaojiaCount() // 获取我报价收到的新消息
    }



    async getNewQuanziCount() {
        let res = await Axios.get('/circle/comment/mine/receive/count')
        this.state.linkArr[1].count = res.data
        this.setState({
            linkArr: this.state.linkArr
        })
    }

    async getNewBaojiaCount() {
        let res = await Axios.get('/offer/comment/count/mine/unread')
        this.state.linkArr[3].count = res.data
        this.setState({
            linkArr: this.state.linkArr
        })
    }


    async getMemberDetail() {
        let res = await Axios.get('/member/detail')
        res.data.memberIndustryName = res.data.memberIndustryVo.name
        res.data.memberLevelName = res.data.memberLevelVo.name
        this.setState({
            detail: res.data,
        })
        console.log(res)
    }

    render() {
        let { linkArr, detail, imgUrl, shop } = this.state
        return (
            <main className="mine-page">
                {detail.id ? <div className="top">
                    <div className="top-box">
                        <div className="profile" >
                            <img src={isHttpImg(detail.avatarUrl) ? detail.avatarUrl : imgUrl + detail.avatarUrl}></img>
                        </div>
                        <div className="mid">
                            <div className="name"> {detail.name}</div>
                            <div className="level">
                                <img src={require("common/img/v.png")}></img>
                                <div className="txt">{detail.memberLevelName}</div>
                            </div>
                            <div className="date">
                                <img src={require('common/img/clock2.png')} alt="" />
                                <span>到期时间:   {detail.auditState == 1 ? '审核中' : detail.expirationTime}</span>
                            </div>
                        </div>
                        <div className="right" onClick={() => {
                            goPage('/mine/levelUp')
                        }}>升级会员</div>
                    </div>
                </div> : <div className="top" onClick={() => {
                    goPage('/login')
                }}>
                        <div className="register">登录/注册</div>
                        <div className="remark">登录后即可享受更多权益</div>
                    </div>}

                <div className="content">
                    <section className="item section" onClick={() => {
                        goPage('/mine/myInfo')
                    }}>
                        <span>我的资料</span>
                        <img src={require('common/img/rArrow.png')} alt="" />
                    </section>
                    <section className="section myInfo">
                        <div className="header">我的信息</div>
                        <div className="info-list">
                            {linkArr.map((item, index) => (
                                <div className="info-item" key={index} onClick={() => {
                                    goPage(item.linkTo)
                                }}>
                                    <img src={item.img} alt="" />
                                    <span>{item.name}</span>
                                    {item.count ? <span className="news">{item.count}</span> : null}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="item section" onClick={() => {
                        postMessage('callphone', shop.serviceTel)
                    }}>
                        <span>联系客服</span>
                        {shop.beginTime ? <span className="remark">服务时间：{shop.beginTime}-{shop.endTime}</span> : ""}
                    </section>
                    <section className="item section" onClick={() => {
                        goPage('/mine/myHistory')
                    }}>
                        <span>浏览记录</span>
                        <img src={require('common/img/rArrow.png')} alt="" />
                    </section>

                    <section className="item section" onClick={() => {
                        if (detail.id) {
                            postMessage('share', JSON.stringify({
                                token: localStorage.getItem('token'),
                                type: 'member',
                            }))
                        }
                    }}>
                        <span>我要分享</span>
                        <span className="remark">{detail.id ? "我要分享" : "敬请期待"}</span>
                    </section>
                    {detail.id ? <section className="item section" onClick={() => {
                        goPage('/mine/replyList')
                    }}>
                        <span>申请记录</span>
                        <img src={require('common/img/rArrow.png')} alt="" />
                    </section> : ""}
                    {detail.id ? <section className="item section toLogin" onClick={() => {
                        goPage('/login')
                    }}>
                        <span>退出登录</span>
                    </section> : ""}
                </div>

            </main >
        )
    }
}