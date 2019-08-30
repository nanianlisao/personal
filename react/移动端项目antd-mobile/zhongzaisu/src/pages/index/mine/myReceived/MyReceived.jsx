import React from 'react'
import { withRouter } from 'react-router-dom';
import "pages/index/mine/myReceived/MyReceived.less"
import ComReceived from 'components/received/ComReceived'
import { parseQueryString } from 'util/util'
class MyReceived extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            step: 1.2,
            loadUrl: null,
            tabArr: []
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var type = options.type
        if (type == 1) {
            Object.assign(this.state, {
                type: type,
                loadUrl: '/circle/comment/mine/receive/all',
                tabArr: [{
                    name: "圈子评论",
                    left: 1.2,
                    loadUrl: '/circle/comment/mine/receive/all',
                }, {
                    name: "评论回复",
                    left: 4.95,
                    loadUrl: '/circle/reply/mine/receive/all',
                }]
            })
        } else if (type == 2) {
            Object.assign(this.state, {
                type: type,
                loadUrl: '/offer/comment/list/mine/received',
                tabArr: [{
                    name: "报价评论",
                    left: 1.2,
                    loadUrl: '/offer/comment/list/mine/received',
                }, {
                    name: "评论回复",
                    left: 4.95,
                    loadUrl: '/offer/reply/list/mine/received',
                }]
            })
        }
        var myReceivedTab = localStorage.getItem('myReceivedTab')
        if (myReceivedTab) {
            localStorage.removeItem('myReceivedTab')
            myReceivedTab = JSON.parse(myReceivedTab)
            this.state.step = myReceivedTab.step
            this.state.loadUrl = myReceivedTab.loadUrl
        }
    }
    render() {
        console.log('render')
        let { tabArr, step, loadUrl } = this.state
        return (
            <main className="myReceived-page">
                <div className="tabs">
                    {tabArr.map((item, index) => (
                        <div className={["tab", item.loadUrl == loadUrl ? "act" : ""].join(" ")} key={index} onClick={() => {
                            this.setState({
                                loadUrl: item.loadUrl,
                                step: item.left
                            })
                        }}>{item.name}</div>
                    ))}
                    <div className="slider" style={{ transform: 'translateX(' + step + 'rem)' }}></div>
                </div>
                <div style={{ marginTop: '0.1rem' }}>
                    <ComReceived
                        loadUrl={this.state.loadUrl} offsetTop={50} type={this.state.type}
                        goDetailCallback={() => {
                            if (this.state.step != 1.2) {
                                localStorage.setItem('myReceivedTab', JSON.stringify({
                                    step: this.state.step,
                                    loadUrl: this.state.loadUrl,
                                }))
                            }
                        }}
                    />
                </div>
            </main >
        )
    }
}

export default withRouter(MyReceived)