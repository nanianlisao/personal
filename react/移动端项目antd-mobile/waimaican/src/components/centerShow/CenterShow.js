import React from 'react'
import './CenterShow.css'
export default class CenterShow extends React.Component {
    static defaultProps = {
        height: 8,
        radius: 0.1,
        width: 6
    }
    constructor(props) {
        super(props)
        this.state = {
            showMask: false,
            showTxt: false,
            transition: false
        }
    }
    show() {
        this.setState({
            showMask: true,
            showTxt: true
        })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.setState({
                transition: true
            })
        }, 200)
    }
    hide() {
        this.setState({
            transition: false
        })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.setState({
                showMask: false,
                showTxt: false
            })
        }, 200)
        if (this.props.hide) {
            this.props.hide()
        }
    }
    render() {
        let { showMask, showTxt, transition } = this.state
        let { height, radius,width } = this.props
        return (
            <div>
                {showMask ? <div className="center-show center-dialog-wrapper">
                    {showMask ? <div className="center-dialog-mask" onClick={() => {
                        this.hide()
                    }}></div> : ""}
                    {showTxt ? <div className={["center-dialog", transition ? 'show' : ''].join(" ")} style={{ maxHeight: height + 'rem', borderRadius: radius + 'rem',width:width + 'rem' }}>
                        {this.props.children}
                    </div> : ""}
                </div > : ""}
            </div>
        )
    }
}
