import React from 'react'
import { withRouter } from 'react-router-dom';
import OrderList from 'components/orderList/OrderList'
import { parseQueryString } from 'util/util'

import './Order.less'
class Order extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: '',
            tabIndex: 0,
            tab: [{ name: '全部订单', state: '' }, { name: '待支付', state: 1 }, { name: '待配送', state: 2 }, { name: '待评价', state: 3 }]
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var myOrderTab = localStorage.getItem('myOrderTab')
        if (myOrderTab) {
            localStorage.removeItem('myOrderTab')
            myOrderTab = JSON.parse(myOrderTab)
            this.setState({
                state: myOrderTab.state,
                tabIndex: this.state.tab.findIndex((x) => x.state == myOrderTab.state)
            })
        } else if (options.state) {
            this.setState({
                state: options.state,
                tabIndex: this.state.tab.findIndex((x) => x.state == options.state)
            })
        }
    }

    render() {
        let { tab, state, tabIndex } = this.state
        let translateX = (7.5 / 4 - 1.58) / 2 + tabIndex * (7.5 / 4)
        return (
            <main className="order-page">
                <div className="top-tab flex-center">
                    {tab.map((x, i) => (
                        <div
                            key={i}
                            className={["tab-item", tabIndex === i ? 'act' : ''].join(' ')}
                            onClick={() => {
                                this.setState({
                                    tabIndex: i,
                                    state: x.state
                                })
                            }}>{x.name}</div>
                    ))}
                    <div className='slider' style={{ transform: 'translateX(' + translateX + 'rem)' }}></div>
                </div>
                <OrderList
                    loadUrl='/order/list/shopping/my'
                    json={{
                        states: this.state.state
                    }}
                    goDetailCallback={() => {
                        localStorage.setItem('myOrderTab', JSON.stringify({
                            state: this.state.state,
                        }))
                    }}
                />
            </main >
        )
    }
}

export default withRouter(Order)