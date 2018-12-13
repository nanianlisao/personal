import React, { Component } from 'react'
import { connect } from 'react-redux'
import CommentInput from '../CommentInput'
import { addComment } from '../reducers/comment'
class CommentInputContainer extends Component {
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
        // if (this.state.user) {
        //     this.refs.textarea.focus()
        // } else {
        //     this.refs.input.focus()
        // }
    }
    _saveUsername(user) {
        // 看看 render 方法的 onUserInputBlur
        // 这个方法会在用户名输入框 blur 的时候的被调用，保存用户名
        localStorage.setItem('user', user)
    }

    handleSubmitComment(comment) {
        // 评论数据的验证
        if (!comment) return
        if (!comment.user) return alert('请输入用户名')
        if (!comment.content) return alert('请输入评论内容')
        // 新增评论保存到 LocalStorage 中
        const { commentList } = this.props
        const newComments = [...commentList, comment]
        localStorage.setItem('commentList', JSON.stringify(newComments))
        // this.props.onSubmit 是 connect 传进来的
        // 会 dispatch 一个 action 去新增评论
        if (this.props.onSubmit) {
            this.props.onSubmit(comment)
        }
    }

    render() {
        return (
            <CommentInput
                user={this.state.user}
                onBlur={this._saveUsername.bind(this)}
                onSubmit={this.handleSubmitComment.bind(this)}
            />
        )
    }
}
const mapStateToProps = (state) => {
    return {
        commentList: state.commentList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (comment) => {
            dispatch(addComment(comment))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentInputContainer)