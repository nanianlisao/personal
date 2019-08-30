import React, { Component } from 'react'
export default class CommentInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            content: ''
        }
    }
    componentWillMount() {
        if (this.props.user) {
            this.setState({
                user: this.props.user
            })
        }
    }
    componentDidMount() {
        if (this.props.user) {
            this.refs.textarea.focus()
        } else {
            this.refs.input.focus()
        }
    }
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r && 0x3 || 0x8)
          return v.toString(16)
        })
      }
    render() {
        return (
            <div className="input-wrapper">
                <div className="header">
                    <span>用户名：</span>
                    <input ref="input" type="text" value={this.state.user}
                        maxLength="16"
                        onChange={(e) => {
                            this.setState({
                                user: e.target.value
                            })
                        }}
                        onBlur={(e) => {
                            this.props.onBlur(e.target.value)
                        }} />
                </div>
                <div className="content">
                    <span>评论内容：</span>
                    <textarea name="" id="" cols="30" rows="10" value={this.state.content} ref="textarea" onChange={(e) => {
                        this.setState({
                            content: e.target.value
                        })
                    }}></textarea>
                </div>
                <div className="submit-btn">
                    <span onClick={() => {
                        this.props.onSubmit({
                            user: this.state.user,
                            content: this.state.content,
                            createdTime: Date.now(),
                            id: this.generateGUID()
                        })
                        this.setState({
                            content: ''
                        })
                        this.refs.textarea.focus()
                    }}>发布</span>
                </div>
                {/* <span onClick={()=>{
                    console.log(this.refs.input)
                    this.refs.input.select()
                    document.execCommand("copy")
                }}>复制</span> */}
            </div>
        )
    }
}