import React, { Component } from 'react';
import '../css/Item.css';
export default class Item extends Component {
  constructor(props) {
    super(props);
  }
  troggleComplete(){
    this.props.toggleComplete(this.props.item.id)
  }
  deleteTodo(){
    this.props.deleteTodo(this.props.item.id)
  }
  render() {
    return (
      <div className={["todo-item",this.props.item.completed?"completed":""].join(' ')} >
        <input type="checkbox" className="toggle" onChange={this.troggleComplete.bind(this)} id={this.props.item.id} />
        <label htmlFor={this.props.item.id}>{this.props.item.content}</label>
        <button className="destory" onClick={this.deleteTodo.bind(this)}></button>
      </div>
    )
  }
}