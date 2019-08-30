import React from 'react'
import { withRouter } from 'react-router-dom';
import 'pages/index/baojia/detail/BaojiaDetail.less'
import CommentList from 'components/comment/CommentList'
import { Axios } from 'util/util'
import Constant from 'util/Constant'
import { Modal } from 'antd-mobile';
const alert = Modal.alert
class BaojiaDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            detail: {},
        }
    }

    componentWillMount() {
        let newId = this.props.match.params.id
        this.getNewsDetail(newId)
    }

    async getNewsDetail(id) {
        try {
            let res = await Axios.get(`/offer/detail/${id}`)
            this.setState({
                detail: res.data
            })
        } catch (e) {
            alert('提示', e.res.retMsg, [
                { text: '确定' },
            ])
        }
    }
    render() {
        let { detail } = this.state
        return (
            <main className="baojiaDetail-page">
                <div className="comment-component">
                    <CommentList
                        header={<div>
                            <div className='con'>
                                <div className="title">
                                    【{detail.offerTypeName}】{detail.title}</div>
                                <div className="btm">
                                    <div className='btm_left'>
                                        <img alt="" src={require("common/img/clock.png")}></img>
                                        <div className='txt'>{detail.updateTime}</div>
                                    </div>
                                    <div className="btm_right">
                                        <div className='imgCtn eye'>
                                            <img alt="" src={require("common/img/eye.png")}></img>
                                            <div className='txt'>{detail.fictitiousBrowseCount}</div>
                                        </div>
                                        <div className='imgCtn'>
                                            <img alt="" src={require("common/img/dialog.png")}></img>
                                            <div className='txt'>{detail.commentCount}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ctt">{detail.body}</div>
                        </div>}

                        loadUrl='/offer/comment/list'
                        json={{
                            id: this.props.match.params.id,
                            "offerId": this.props.match.params.id
                        }}
                        saveUrl='/offer/comment/save'
                        saveJson={{
                            "offerId": this.props.match.params.id,
                            repliedUserId: detail.userId,
                        }}

                        replyUrl='/offer/reply/save'
                        replyJson={{
                            "offerId": this.props.match.params.id,
                        }}

                    />
                </div>

            </main >
        )
    }
}

export default withRouter(BaojiaDetail)