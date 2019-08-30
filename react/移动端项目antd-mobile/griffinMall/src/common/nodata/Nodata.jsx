import React, { Component } from "react";
import 'common/nodata/Nodata.css'
export default class Nodata extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    static defaultProps = {
        text: '数据列表为空'
    }


    render() {
        return (
            <div className="normal">
                <img src={require('common/img/null2.png')}></img>
                <span>{this.props.text}</span>
            </div>
        )
    }
}