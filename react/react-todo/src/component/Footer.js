import React,{Component} from 'react';
import '../css/Footer.css'
export default class Footer extends Component{
    constructor(props){
        super(props)
        this.state = {
            author: 'Nanian'
        }
    }
    render() {
      return (
        <div className='footer'>
          <span>Written by {this.state.author}</span>
        </div>
      )
    }
  }