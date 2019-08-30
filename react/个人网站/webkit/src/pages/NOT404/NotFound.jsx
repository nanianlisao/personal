import React from 'react'
import './NotFound.less';
import { goPage } from 'util/util';
export default class NotFound extends React.Component {
    render() {
        return (
            <div className="body">
                <div className="head404"></div>
                <div className="txtbg404">
                    <div className="txtbox">
                        <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
                        <p className="paddingbox">请点击以下链接继续浏览网页</p>
                        <p style={{ cursor: 'pointer' }} onClick={() => {
                            this.props.history.goBack();
                        }}>》返回上一页面</p>
                        <p style={{ cursor: 'pointer' }} onClick={() => {
                            goPage('/')
                        }}>》返回网站首页</p>
                    </div>
                </div>
            </div>
        )
    }
}