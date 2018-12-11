import React, { Component } from 'react'
import Comment from './Comment'
export default class CommentList extends Component{
    constructor(){
        super()
        this.state = {
            commentList:[1,3,23,213,2]
        }
    }
    static defaultProps = {
        commentList: [] 
    }
    render(){
        return(
            <div className="comment-list">
                {this.props.commentList.map((comment,index)=>{
                    return <Comment comment={comment} index={index} key={comment.id} delComment={this.props.delComment} />
                })}
            </div>
        )
    }
}