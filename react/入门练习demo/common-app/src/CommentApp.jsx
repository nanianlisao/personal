import React, { Component } from 'react'
import CommentInput from './containers/CommentInput'
import CommentList from './containers/CommentList'

class CommentApp extends Component {
  constructor() {
    super()
    this.state = {
      commentList: []
    }
  }
 
  render() {
    return (
      <div className="wrapper">
        <CommentInput  />
        <CommentList />
      </div>
    )
  }
}

export default CommentApp