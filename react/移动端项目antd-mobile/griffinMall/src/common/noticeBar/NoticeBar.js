import React, { Component } from "react";
import { Button } from "antd-mobile";
import { postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant';
import 'common/noticeBar/NoticeBar.less'
export default class NoticeBar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    static defaultProps = {
        text: '',
        icon: <img src={require('common/img/bell2.png')} />,
        fps: 50
    }
    componentDidMount() {
        this.load()
    }

    componentWillReceiveProps(props) {
        this.load()
    }

    load() {
        var that = this
        var wrapper = document.querySelector('.wrapper');
        var inner = wrapper.getElementsByTagName('div')[0];
        var p = document.querySelector('.content')
        var p_w = p.offsetWidth;
        var wrapper_w = wrapper.offsetWidth;
        if (!this.props.text || wrapper_w > p_w) { return false; }
        inner.innerHTML += inner.innerHTML;
        setTimeout(fun1, 1000);
        function fun1() {
            if (p_w > wrapper.scrollLeft) {
                wrapper.scrollLeft++;
                setTimeout(fun1, that.props.fps);
            }
            else {
                setTimeout(fun2, 1000);
            }
        }
        function fun2() {
            wrapper.scrollLeft = 0;
            fun1();
        }
    }




    render() {
        return (
            <div className="noticeBar">
                {this.props.icon ? <div className="icon"> {this.props.icon}</div> : ""}
                <div className={["wrapper", this.props.icon ? "hasIcon" : ""].join(" ")}>
                    <div className="inner">
                        <p className="content">{this.props.text}</p>
                    </div>
                </div>
            </div>

        )
    }
}