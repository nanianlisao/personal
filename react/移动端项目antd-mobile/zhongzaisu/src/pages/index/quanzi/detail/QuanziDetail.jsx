import React from 'react'
import 'pages/index/quanzi/detail/QuanziDetail.less'
import { withRouter } from 'react-router-dom';
import CommentList from 'components/comment/CommentList'
import { goPage, Axios, postMessage,isHttpImg } from 'util/util'
import Constant from 'util/Constant'
import { Modal } from 'antd-mobile';
const alert = Modal.alert
class QuanziDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            detail: {},
        }
    }
    componentDidMount() {
        let newId = this.props.match.params.id
        this.getNewsDetail(newId)
    }


    async getNewsDetail(id) {
        let res = await Axios.get(`/circle/detail/${id}`)
        console.log(res)
        if (res.data.fileId) {
            res.data.imgs = res.data.fileId.split(',')
        } else {
            res.data.imgs = []
        }
        this.setState({
            detail: res.data
        })
    }

    async getCommentCount() {
        let res = await Axios.get(`/circle/comment/count/${this.props.match.params.id}`)
        let { detail } = this.state
        detail.commentCount = res.data
        this.setState({
            detail
        })
    }

    // 切换点赞状态
    async triggleLikes() {
        let { detail, animation } = this.state
        console.log(detail)
        let url = `/circle/likes/like/${detail.id}`
        if (detail.likes) {
            url = `/circle/likes/cancel/${detail.id}`
        }
        var res = await Axios.post(url)
        detail.likes = !detail.likes
        this.setState({
            detail
        })
        if (detail.likes) {
            this.setState({
                animation: true
            })
            setTimeout(() => {
                this.setState({
                    animation: false
                })
            }, 500)
        }

        var res2 = await Axios.post(`/circle/likes/like/num/${detail.id}`)
        detail.likesCount = res2.data
        this.setState({
            detail
        })
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

    render() {
        let { imgUrl, detail } = this.state

        return (
            <main className="quanziDetail-page">
                <div className="comment-component">
                    <CommentList
                        header={<div className="main">
                            <div className="top">
                                <div className="profile">
                                    <img src={isHttpImg(detail.avatarUrl) ? detail.avatarUrl : imgUrl + detail.avatarUrl} ></img>
                                </div>
                                <div className="right">
                                    <div className="uInfo">
                                        <div className="name">{detail.memberName}</div>
                                        <div className="time">{detail.operatorTime}</div>
                                        <div className="tag">{detail.typeDesc && detail.typeDesc.name}</div>
                                    </div>
                                    <div className="address">{detail.memberAddress}</div>
                                </div>
                            </div>
                            <div className="txt">{detail.body} </div>
                            {detail.fileId ? <div>
                                {detail.fileType == 1 ?
                                    <div className="imgs">
                                        {detail.imgs && detail.imgs.map((item, index) => (
                                            <div className="imgCtn" key={index} onClick={() => {
                                                var urls = detail.imgs.map(x => imgUrl + x)
                                                postMessage('previewImage', {urls:urls,index:index})
                                            }}>
                                                <img src={imgUrl + item + '?x-oss-process=image/resize,w_600'} ></img>
                                            </div>
                                        ))}
                                    </div> : <div className="videoCtn">
                                        {detail.fileId ? <video id="media" controls poster={imgUrl + detail.coverFileId} >
                                            <source src={imgUrl + detail.fileId} />
                                        </video> : ""}
                                    </div>}
                            </div> : ""}
                        </div>}
                        showSaveButton={false}
                        ref="comment"
                        offsetTop={50}
                        loadUrl='/circle/comment/list'
                        json={{
                            id: this.props.match.params.id,
                            "circleId": this.props.match.params.id
                        }}
                        saveUrl='/circle/comment/save'
                        saveJson={{
                            "circleId": this.props.match.params.id,
                            repliedUserId: detail.userId
                        }}
                        replyUrl='/circle/reply/save'
                        replyJson={{
                            "circleId": this.props.match.params.id,
                        }}
                        onSubmit={this.getCommentCount.bind(this)}

                    />
                </div>
                <div className="page-footer">
                    <div className="left">
                        <div className="left-item" onClick={() => {
                            postMessage('share', JSON.stringify({
                                token: localStorage.getItem('token'),
                                type: 'quanzi',
                                circleId: this.props.match.params.id
                            }))
                        }}>
                            <img src={require("common/img/share.png")} alt="" />
                            <span>{detail.shareCount}</span>
                        </div>
                        <div className="left-item" onClick={() => {
                            this.refs.comment.saveComment()
                        }}>
                            <img src={require("common/img/dialog.png")} alt="" />
                            <span>{detail.commentCount}</span>
                        </div>
                        <div className="left-item" onClick={() => {
                            this.triggleLikes()
                        }}>
                            <img className={this.state.animation ? "animation" : ""} src={detail.likes ? require("common/img/good_ac.png") : require("common/img/good.png")} alt="" />
                            <span>{detail.likesCount}</span>
                        </div>
                    </div>
                    <div className="right" onClick={async () => {
                        if (detail.memberTel) {
                            postMessage('callphone', detail.memberTel)
                        } else {
                            var res = await this.getMemberDetail()
                            if (res.level == 1 || res.level == 2) {
                                alert('提示', '您没有权限拨打电话，升级会员享受更高权力', [
                                    { text: '取消' },
                                    {
                                        text: '去升级', onPress: () => {
                                            goPage('/mine/levelUp')
                                        }
                                    }
                                ])
                            }
                        }
                    }}>联系他</div>
                </div>
            </main >
        )
    }
}

export default withRouter(QuanziDetail)