import React from 'react'
import 'components/comment/Comment.less'
import { TextareaItem, Modal } from 'antd-mobile';
import FooterShow from 'common/footerShow/FooterShow'
import { goPage, Axios } from 'util/util'
import Constant from 'util/Constant'
const alert = Modal.alert

export default class AddComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }

    shouldComponentUpdate(props, state) {
        if (state.content !== this.state.content) {
            return true
        } else {
            return false
        }
    }

    getMemberDetail() {
        if (localStorage.getItem('token')) {
            if (Constant.data.timerss && Date.now() - Constant.data.timerss <= 60 * 1000) {  // 更新数据
                return Constant.data.memberDetail
            } else {
                return Axios.get('/member/final/level').then((res) => {
                    Constant.data.timerss = Date.now()
                    Constant.data.memberDetail = res.data
                    return res.data
                })
            }
        } else {
            return {}
        }
    }


    async show() {
        if (this.props.loadUrl === '/offer/comment/list') {
            var res = await this.getMemberDetail()
            if (res.level == 1 || res.level == 2) {
                alert('提示', '您没有权限发布评论，升级会员享受更高权力', [
                    { text: '取消' },
                    {
                        text: '去升级', onPress: () => {
                            goPage('/mine/levelUp')
                        }
                    }
                ])
                return
            }
        }
        this.refs.footerShow.show()
    }
    render() {
        return (
            <main className="addCommentDetail-page">
                <FooterShow ref="footerShow" hide={()=>{
                    window.scroll(0,0)
                }}>
                    <div className="reply-box">
                        <div className="reply-btn act" onClick={() => {
                            this.props.onSubmit()
                            this.setState({
                                content: ''
                            })
                            this.refs.footerShow.hide()
                        }}>发布</div>
                        <TextareaItem
                            placeholder="请输入评论"
                            ref={el => this.autoFocusInst = el}
                            onChange={(e) => {
                                this.setState({
                                    content: e
                                })
                                this.props.onChange(e)
                            }}
                            onBlur={()=>{
                                window.scroll(0,0)
                            }}
                            value={this.state.content}
                            rows={5}
                            count={128}
                        />
                    </div>
                </FooterShow>
            </main >
        )
    }
}