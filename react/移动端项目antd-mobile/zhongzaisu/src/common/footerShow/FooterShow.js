import React from 'react'
import 'common/footerShow/FooterShow.css'
export default class FooterShow extends React.Component {
    static defaultProps = {
        height: 600
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
        let { height } = this.props
        return (
            <div className="footer-show">
                {showMask ? <div className="foot-dialog-mask" onClick={() => {
                    this.hide()
                }}></div> : ""}
                {showTxt ? <div className={["foot-dialog", transition ? 'show' : ''].join(" ")} style={{ maxHeight: height + 'rem' }}>
                    {this.props.children}
                </div> : ""}

            </div >
        )
    }
}
