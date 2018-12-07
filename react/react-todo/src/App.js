import React, { Component } from 'react';
import './App.css';
import TodoBox from './component/TodoBox';

class App extends Component {
  render() {
    return (
      <div>
        <div className="mask"></div>
        <TodoBox />
      </div>
    );
  }
}

export default App;
