import React, { Component } from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'

class CommentApp extends Component {
  constructor() {
    super()
    this.state = {
      commentList: []
    }
  }
  componentWillMount() {
    const commentList = localStorage.getItem('commentList')
    if (commentList) {
      this.setState({
        commentList: JSON.parse(commentList)
      })
    }
  }
  generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r && 0x3 || 0x8)
      return v.toString(16)
    })
  }
  addComment(user, content) {
    if (!user) return alert('请输入用户名')
    if (!content) return alert('请输入评论内容')
    let { commentList } = this.state
    commentList.push({
      id: this.generateGUID(),
      user,
      content,
      createdTime: Date.now()
    })
    this.setState({
      commentList
    })
    this._saveCommentList(commentList)
  }
  delComment(index) {
    let { commentList } = this.state
    commentList.splice(index, 1)
    this.setState({ commentList })
    this._saveCommentList(commentList)
  }
  _saveCommentList(commentList) {
    localStorage.setItem('commentList', JSON.stringify(commentList))
  }
  render() {
    return (
      <div className="wrapper">
        <CommentInput addComment={this.addComment.bind(this)} />
        <CommentList commentList={this.state.commentList} delComment={this.delComment.bind(this)} />
      </div>
    )
  }
}

export default CommentApp