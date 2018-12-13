import React, { Component } from 'react'
import Comment from './Comment'
export default class CommentList extends Component{
   
    static defaultProps = {
        commentList: [] 
    }
    render(){
        return(
            <div className="comment-list">
                {this.props.commentList.map((comment,index)=>{
                    return <Comment comment={comment} index={index} key={comment.id} delComment={this.props.delComment.bind(this)} />
                })}
            </div>
        )
    }
}