import React from 'react'
import "pages/index/mine/myRelease/MyRelease.less"
import QuanziList from 'components/quanziList/QuanziList'
export default class MyRelease extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            kindType: 2,
            step: 1.2,
            tabArr: [{
                name: "销售",
                left: 1.2,
                kind: 2
            },
            {
                name: "采购",
                left: 4.95,
                kind: 1
            }
            ]
        }
    }
    componentWillMount() {
        var myReleaseTab = localStorage.getItem('myReleaseTab')
        if (myReleaseTab) {
            localStorage.removeItem('myReleaseTab')
            myReleaseTab = JSON.parse(myReleaseTab)
            console.log(myReleaseTab)
            this.state.step = myReleaseTab.step
            this.state.kindType = myReleaseTab.kindType
        }

    }
    render() {
        let { tabArr, step } = this.state
        console.log(step)
        return (
            <main className="myRelease-page">
                <div className="tabs">
                    {tabArr.map((item, index) => (
                        <div className="tab" key={index} onClick={() => {
                            this.setState({
                                kindType: item.kind,
                                step: item.left
                            })
                        }}>{item.name}</div>
                    ))}
                    <div className="slider" style={{ transform: 'translateX(' + step + 'rem)' }}></div>
                </div>
                <div style={{ marginTop: '0.1rem' }}>
                    <QuanziList
                        loadUrl='/circle/list/mine'
                        offsetTop={50} json={{
                            type: this.state.kindType,
                        }}
                        goDetailCallback={() => {
                            if (this.state.step != 1.2) {
                                localStorage.setItem('myReleaseTab', JSON.stringify({
                                    step: this.state.step,
                                    kindType: this.state.kindType,
                                }))
                            }
                        }}
                    />
                </div>
            </main >
        )
    }
}