import React, { Component } from 'react';
import '../css/TodoList.css'
import Item from './Item';
import Tabs from './Tabs';
export default class TodoList extends Component {
    constructor() {
        super()
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.writeTodo = this.writeTodo.bind(this)
        this.toggleComplete = this.toggleComplete.bind(this)
        this.deleteTodo = this.deleteTodo.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
        this.clearTodoList = this.clearTodoList.bind(this)
        this.state = {
            todoText: '',
            todoList: [{
                id: 1,
                content: '走啊啊',
                completed: false
            }],
            keys:'all'
        }
    }
    handleKeyUp(event) {
        if (event.key === 'Enter' && this.state.todoText.trim()) {
            let { todoList } = this.state
            todoList.unshift({
                id: this.generateGUID(),
                content: this.state.todoText.trim(),
                completed: false
            })
            this.setState({
                todoList,
                todoText: ''
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
    writeTodo(e) {
        this.setState({
            todoText: e.target.value
        })
    }
    deleteTodo(id) {
        let { todoList } = this.state
        let currentIndex = todoList.findIndex((x) => x.id === id)
        todoList.splice(currentIndex,1)
        this.setState({ todoList })
    }
    toggleComplete(id) {
        let { todoList } = this.state
        let currentIndex = todoList.findIndex((x) => x.id === id)
        todoList[currentIndex].completed = !todoList[currentIndex].completed
        this.setState({ todoList })
    }
    clearTodoList(){
        this.setState({
            todoList:this.state.todoList.filter(todo => !todo.completed)
        })
    }
    changeStatus(key){
        this.setState({
            keys:key
        })
    }
    filterTodo(arr){
        let {keys} = this.state
        if(keys==='all'){
            return arr
        }else{
            const completed = keys === 'completed'
            return arr.filter(item => item.completed === completed)
        }
    }
    render() {
        let displayList = this.filterTodo(this.state.todoList)
        let todoList = displayList.map(item => (
            <Item key={item.id}
                item={item}
                deleteTodo={this.deleteTodo}
                toggleComplete={this.toggleComplete} />
        ))
        let unFinishCount = this.state.todoList.filter(x=>!x.completed).length
        return (
            <section className="real-app">
                <input type="text" className="add-input" value={this.state.todoText} placeholder="接下来要去做什么？" onKeyUp={this.handleKeyUp} onChange={this.writeTodo} />
                {todoList}
                <Tabs keys={this.state.keys} unFinishCount={unFinishCount} changeStatus={this.changeStatus} clearTodoList={this.clearTodoList}></Tabs>
            </section>)
    }
}
