import React from 'react'
import './TicketDetail.css'
export default class TicketDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticket: {},
        };
    }
    componentWillMount() {
        document.title = '优惠券详情'
        var ticket = localStorage.getItem('ticket')
        this.setState({
            ticket: JSON.parse(ticket)
        })
    }

    render() {
        let ticketDetail = this.state.ticket
        return (
            <div className="page-ticketDetail">
                <div className="detail-list shadow-box">
                    <div className='detail'>劵名称：{ticketDetail.name}</div>
                    <div className='detail'>劵号：{ticketDetail.id}</div>
                    <div className='detail'>有效期：{ticketDetail.ticketTermofvalidity}</div>
                    <div className='detail rule'>使用规则：满{ticketDetail.ruleMap.minConsume ? ticketDetail.ruleMap.minConsume : 0}可用
    <span>{ticketDetail.ruleMap.goods && ticketDetail.ruleMap.goods != 'all' ? '限独享优惠商品名可用' : '全场通用'}</span>
                        {ticketDetail.ruleMap.maxPreferentialAmount ? <span> 最高优惠{ticketDetail.ruleMap.maxPreferentialAmount}</span> : ""}
                    </div>
                    <div className='detail rule'>使用说明：{ticketDetail.remark}</div>
                </div>
            </div>
        )
    }
}