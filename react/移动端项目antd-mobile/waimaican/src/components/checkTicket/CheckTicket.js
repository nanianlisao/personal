import React from 'react'
import 'pages/index/mine/myTicket/MyTicket.css'
import FooterShow from 'components/footerShow/FooterShow'
export default class CartList extends React.Component {
    static defaultProps = {
        ticketList: [],
        title: '门店优惠专享'
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    show() {
        console.log('show')
        if (this.props.setFootIndex) {
            this.props.setFootIndex()
        }
        this.refs.list.show()
    }
    hide() {
        console.log('hide')
        this.refs.list.hide()
    }

    toUse(item) {
        this.props.toUse(item)
    }


    render() {
        let { ticketList, title } = this.props
        return (
            <FooterShow ref="list">
                <div>
                    <div className='checkTicket-title'>
                        <div>{title}</div>
                        <div className='cancle' onClick={() => {
                            this.hide()
                        }}>
                            <img src={require("common/img/cancle.png")}></img>
                        </div>
                    </div>
                    <div className='tickets-box'>
                        {ticketList.map((item, index) => {
                            return (
                                <div className="tickets" key={index} style={{ background: 'url(' + require('common/img/tickBg3.png') + ') center center no-repeat', backgroundSize: 'cover' }}>
                                    <div className='ticket-detail'>
                                        <div className='ticket-left'>
                                            <div className="title">{item.activeName}</div>
                                            <div className="detail">
                                                {item.activeType == 1 ? <div className="price">
                                                    <span>￥</span>{item.ticketQueryDetailVo.reduce}</div> : ""}
                                                {item.activeType == 2 ? <div className="price">{item.ticketQueryDetailVo.sale}折</div> : ""}
                                                <div className="use-detail">
                                                    <div className="coin-sign">满{item.ticketQueryDetailVo.ruleMap.minConsume ? item.ticketQueryDetailVo.ruleMap.minConsume : 0}元可用</div>
                                                    <div className="use-wide">{item.ticketQueryDetailVo.ruleMap.goods && item.ticketQueryDetailVo.ruleMap.goods != 'all' ? '限独享优惠商品名可用' : '全场通用'}</div>
                                                </div>
                                            </div>
                                            <div className="date">有效期：{item.ticketQueryDetailVo.ticketTermofvalidity}</div>
                                        </div>
                                        <div className='ticket-right'>
                                            <div className="get-btn" onClick={() => {
                                                this.toUse(item)
                                            }} style={{ background: 'url(' + require('common/img/button_wrap.png') + ') center center no-repeat', backgroundSize: 'cover' }}>
                                                <span>立即使用</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </FooterShow>
        )
    }
}
