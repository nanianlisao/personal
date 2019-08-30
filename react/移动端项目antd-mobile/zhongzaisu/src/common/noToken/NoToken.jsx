import React, { Component } from "react";
import { Button } from "antd-mobile";
import { postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant';
import 'common/noToken/NoToken.css'
export default class NoToken extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: localStorage.getItem('token')
        }
    }

    getToken() {
        postMessage('token', 'token')
        onMessage('token', async (mesData) => {
            if (mesData.token) {
                localStorage.setItem('token', mesData.token)
                Constant.user_id.phone = mesData.phone
            } else {
                localStorage.setItem('token', mesData)
            }
            if(this.props.callback){
                this.props.callback()
            }
        })
    }

    render() {
        return (
            <div className="com-noToken">
                <img className="img" src={require('common/img/scope.png')} alt="" />
                <span className="span">您还没有授权,请重新授权</span>
                <Button
                    type="primary"
                    size="small"
                    inline={true}
                    onClick={() => {
                        this.getToken()
                    }}
                >重新授权</Button>
            </div>
        )
    }
}