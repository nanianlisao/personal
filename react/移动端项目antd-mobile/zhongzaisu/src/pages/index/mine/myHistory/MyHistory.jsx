import React from 'react'
import "pages/index/mine/myHistory/MyHistory.less"
import BaojiaList from 'components/baojiaList/BaojiaList'
import QuanziList from 'components/quanziList/QuanziList'
export default class MyHistory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 0,
            step: 1.2,
            tabArr: [{
                name: "报价",
                left: 1.2
            }, {
                name: "圈子",
                left: 4.95
            }]
        }
    }
    componentWillMount() {
        var myHistoryTab = localStorage.getItem('myHistoryTab')
        if (myHistoryTab) {
            localStorage.removeItem('myHistoryTab')
            myHistoryTab = JSON.parse(myHistoryTab)
            this.setState({
                step:myHistoryTab.step,
                tabIndex:myHistoryTab.tabIndex,
            })
        }
    }
    render() {
        let { tabArr, step, tabIndex } = this.state
        return (
            <main className="myHistory-page">
                <div className="tabs">
                    {tabArr.map((item, index) => (
                        <div className="tab" key={index} onClick={() => {
                            this.setState({
                                tabIndex: index,
                                step: item.left
                            })
                        }}>{item.name}</div>
                    ))}
                    <div className="slider" style={{ transform: 'translateX(' + step + 'rem)' }}></div>
                </div>
                <div className="cttList">
                    {tabIndex
                        ? <QuanziList
                            loadUrl='/circle/browse/list' json={{}}
                            goDetailCallback={() => {
                                localStorage.setItem('myHistoryTab', JSON.stringify({
                                    step: this.state.step,
                                    tabIndex: this.state.tabIndex,
                                }))
                            }}
                        />
                        : <BaojiaList loadUrl='/offer/browse/list' offsetTop={50} json={{}} />
                    }
                </div>
            </main >
        )
    }
}