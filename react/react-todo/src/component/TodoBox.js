import React,{Component} from 'react';
import Header from './Header';
import Footer from './Footer';
import TodoList from './TodoList';
import '../css/TodoBox.css';
export default class TodoBox extends Component{
    render(){
        return(
            <div className="todo-box">
              <Header />
              <TodoList />
              <Footer />
            </div>
        )
    }
}