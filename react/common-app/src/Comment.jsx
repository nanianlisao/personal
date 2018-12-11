import React, { Component } from 'react'
export default class Comment extends Component {
    constructor() {
        super()
        this.state = { timeString: '' }
    }
    componentWillMount() {
        this._updateTimeString()
        this._timer = setInterval(
            this._updateTimeString.bind(this),
            10000
        )
    }
    componentWillUnmount() {
        clearInterval(this._timer)
    }
    _updateTimeString() {
        let { comment } = this.props
        let duration = (Date.now() - comment.createdTime) / 1000
        this.setState({
            timeString: duration > 60
                ? `${Math.round(duration / 60)}分钟前`
                : `${Math.round(Math.max(duration, 1))}秒前`
        })
    }
    _getProcessedContent(content) {
        return content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/`([\S\s]+?)`/g, '<code>$1</code>')
    }
    render() {
        return (
            <div className="comment">
                <div className="name">{this.props.comment.user}:</div>
                <div className="info" dangerouslySetInnerHTML={{
                    __html: this._getProcessedContent(this.props.comment.content)
                }}></div>
                <span className="createTime">{this.state.timeString}</span>
                <span className="del" onClick={() => {
                    this.props.delComment(this.props.index)
                }}>删除</span>
            </div>
        )
    }
}