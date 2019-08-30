import React, { Component } from 'react'
import { connect } from 'react-redux'
import CommentList from '../CommentList'
import { initComments, deleteComment } from '../reducers/comment'

class CommentListContainer extends Component {
    componentWillMount() {
        this._loadData()
    }

    handleDeleteComment(index) {
        const { commentList } = this.props
        // props 是不能变的，所以这里新建一个删除了特定下标的评论列表
        const newComments = [
            ...commentList.slice(0, index),
            ...commentList.slice(index + 1)
        ]
        // 保存最新的评论列表到 LocalStorage
        localStorage.setItem('CommentList', JSON.stringify(newComments))
        if (this.props.onDeleteComment) {
            // this.props.onDeleteComment 是 connect 传进来的
            // 会 dispatch 一个 action 去删除评论
            this.props.onDeleteComment(index)
        }
    }

    _loadData() {
        let commentList = localStorage.getItem('commentList')
        commentList = commentList ? JSON.parse(commentList) : []
        // this.props.initComments 是 connect 传进来的
        // 可以帮我们把数据初始化到 state 里面去
        this.props.initComments(commentList)
    }
    render() {
        return (
            <CommentList commentList={this.props.commentList} delComment={this.handleDeleteComment.bind(this)} />
        )
    }
}

// 评论列表从 state.comments 中获取
const mapStateToProps = (state) => {
    return {
        commentList: state.commentList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // 提供给 CommentListContainer
        // 当从 LocalStorage 加载评论列表以后就会通过这个方法
        // 把评论列表初始化到 state 当中
        initComments: (commentList) => {
            dispatch(initComments(commentList))
        },
        // 删除评论
        onDeleteComment: (commentIndex) => {
            dispatch(deleteComment(commentIndex))
        }
    }
}

// 将 CommentListContainer connect 到 store
// 会把 comments、initComments、onDeleteComment 传给 CommentListContainer
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentListContainer)