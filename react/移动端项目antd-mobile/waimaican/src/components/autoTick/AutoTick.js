import React from 'react'
import './AutoTick.css'
import { objDeepCopy } from 'util/util'
import CenterShow from 'components/centerShow/CenterShow'
export default class AutoTick extends React.Component {
    static defaultProps = {
        newTicket: []
    }
    constructor(props) {
        super(props)
        this.state = {
            newTicket: []
        }
    }
    componentDidMount() {
        if (this.props.newTicket) {
            this.setState({
                newTicket: this.props.newTicket
            })
        }
    }
    componentWillReceiveProps(props) {
        if (props.newTicket) {
            this.setState({
                newTicket: props.newTicket
            })
        }
    }

    show() {
        this.refs.autoTick.show()
    }

    hide() {
        this.refs.autoTick.hide()
    }


    render() {
        let { newTicket } = this.state
        return (
            <div>
                <CenterShow ref="autoTick">
                    <div className='autoTick-wrapper'>
                        {newTicket.map((item, index) => {
                            return (
                                <div className='autoTick-box' key={item.id}
                                    style={{ background: 'url(' + require('common/img/tickBg3.png') + ') center center no-repeat', backgroundSize: 'cover' }}>
                                    <div className='autoTick-left'>
                                        <div className='autoTick-name'>{item.name}</div>
                                        <div className='autoTick-info'>
                                            <div className='autoTick-info-left'>
                                                {item.activeType == 1 ? <span>￥</span> : ""}
                                                <span className='autoTick-cost'>{item.activeType == 1 ? item.reduce : item.sale + '折'}</span>
                                            </div>
                                            <div className='autoTick-info-right'>
                                                <div>优惠券</div>
                                                <div className="minCon">单笔满{item.ruleMap.minConsume ? item.ruleMap.minConsume : 0}使用</div>
                                            </div>
                                        </div>
                                        <div className='autoTick-date'>
                                            有效期：{item.ticketTermofvalidity}
                                        </div>
                                    </div>
                                    <div className='autoTick-right'>
                                        <div className='autoTick-getTick' onClick={()=>{
                                            this.hide()
                                        }}
                                            style={{ background: 'url(' + require('common/img/button_wrap.png') + ') center center no-repeat', backgroundSize: 'cover' }}
                                        >
                                            <span>去使用</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </CenterShow>
            </div>
        )
    }
}
