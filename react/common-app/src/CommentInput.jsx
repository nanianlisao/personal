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
        const user = localStorage.getItem('user')
        if (user) {
            this.setState({ user: user })
        }
    }
    componentDidMount() {
        if (this.state.user) {
            this.refs.textarea.focus()
        }else{
            this.refs.input.focus()
        }
    }
    render() {
        return (
            <div className="input-wrapper">
                <div className="header">
                    <span>用户名：</span>
                    <input ref="input" type="text" value={this.state.user}
                        onChange={(e) => {
                            this.setState({
                                user: e.target.value
                            })
                        }}
                        onBlur={(e) => {
                            localStorage.setItem('user', e.target.value)
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
                        this.props.addComment(this.state.user, this.state.content)
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