import React, { Component } from 'react';
import '../css/Tabs.css'
export default class Tabs extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      status: [
        {
          key: 'all',
          name: '全部'
        }, {
          key: 'active',
          name: '未完成'
        }, {
          key: 'completed',
          name: '已完成'
        }
      ]
    }
  }
  changeStatus(key){
    this.props.changeStatus(key)
  }
  clearTodoList(){
    this.props.clearTodoList()
  }
  render() {
    let statusArr = this.state.status.map(x => {
      return <span className={['state', this.props.keys === x.key ? 'actived' : ''].join(" ")} key={x.key} onClick={this.changeStatus.bind(this,x.key)}>{x.name}</span>
    })
    return (
      <div className="helper">
        <span className="left">{this.props.unFinishCount}项未完成</span>
        <span className="tabs">
          {statusArr}
        </span>
        <span className="clear" onClick={this.clearTodoList.bind(this)}>删除已完成任务</span>
      </div>
    )
  }
}