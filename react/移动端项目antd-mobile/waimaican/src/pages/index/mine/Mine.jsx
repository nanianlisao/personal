import React from 'react'
import './Mine.css'
import { goPage } from 'util/util'
import Constant from 'util/Constant';
// import store from '@/reducers/index'


class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {
                nickName: '昵称',
                avatarUrl: require('common/img/default.jpg')
            }
        };
    }

    componentWillMount() {
        setTimeout(() => {
            let userInfo = Constant.data.userInfo
            if (userInfo) {
                userInfo = JSON.parse(userInfo)
                this.setState({
                    userInfo: userInfo
                })
            }
        }, 500)
        // store.dispatch({ type: 'INIT_SCROLLTOP', scrollTop: 50 })
        document.title = '我的'
    }

    render() {
        return (
            <div className="page-mine">
                <div className="top" style={{ background: 'url(' + require('common/img/mine_bg.png') + ') center center no-repeat', backgroundSize: 'cover' }}>
                    <div className="user">
                        <img alt="" src={this.state.userInfo.avatarUrl} mode="aspectFill"></img>
                        <span>{this.state.userInfo.nickName}</span>
                    </div>
                </div>

                <div className="btns">
                    <div className="btn" onClick={() => {
                        goPage('/myWaimaiOrder')
                    }}>
                        <img alt="" src={require('common/img/waimaiOrder.png')} mode="aspectFit"></img>
                        <span>外卖订单</span>
                        
                    </div>
                    <div className="btn" onClick={() => {
                        goPage('/myOrder')
                    }}>
                        <img alt="" src={require('common/img/myOrder.png')} mode="aspectFit"></img>
                        <span>点餐订单</span>
                    </div>
                    <div className="btn" onClick={() => {
                        goPage('/myTicket')
                    }}>
                        <img alt="" src={require('common/img/tickets.png')} mode="aspectFit"></img>
                        <span>优惠券</span>
                        {/* <div className="count">99</div> */}
                    </div>
                    
                </div>

                <div className="notice flex-middle" onClick={() => {
                    goPage('/notice')
                }}>
                    <div className='flex-center-ver' >
                        <img alt="" src={require("common/img/notice.png")} mode="aspectFit" className='left'></img>
                        <span>平台须知</span>
                    </div>
                    <div className='right-img-box'>
                        <img alt="" src={require('common/img/arrow_right_grey.png')}></img>
                    </div>
                </div>
                {/* <div className="notice flex-middle" onClick={() => {
                    goPage('/notice')
                }}>
                    <div className='flex-center-ver' >
                        <img alt="" src={require("common/img/xiaoxi.png")} mode="aspectFit" className='left'></img>
                        <span>消息通知</span>
                    </div>
                    <div className='right-img-box'>
                        <img alt="" src={require('common/img/arrow_right_grey.png')}></img>
                    </div>
                </div> */}
                <div className="notice flex-middle" onClick={() => {
                    goPage('/chooseLocation')
                }}>
                    <div className='flex-center-ver' >
                        <img alt="" src={require("common/img/dizhi.png")} mode="aspectFit" className='left'></img>
                        <span>我的地址</span>
                    </div>
                    <div className='right-img-box'>
                        <img alt="" src={require('common/img/arrow_right_grey.png')}></img>
                    </div>
                </div>
            </div>
        )
    }
}
export default Mine