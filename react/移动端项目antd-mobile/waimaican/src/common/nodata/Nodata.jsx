import React, { Component } from "react";
import { Button } from "antd-mobile";
import { postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant';
import 'common/nodata/Nodata.css'
export default class Nodata extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        return (
            <div className="normal">
                <img src={require('common/img/null2.png')}></img>
                <span>数据列表为空</span>
            </div>
        )
    }
}