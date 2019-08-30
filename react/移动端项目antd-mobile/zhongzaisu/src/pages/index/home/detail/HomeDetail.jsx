import React from 'react'
import { withRouter } from 'react-router-dom';
import 'pages/index/home/detail/HomeDetail.less'
import { goPage, Axios } from 'util/util'
import Constant from 'util/Constant'
class HomeDetail extends React.Component {
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
        let res = await Axios.post(`/information/detail/${id}`)
        console.log(res)
        this.setState({
            detail: res.data
        })
    }

    render() {
        let { detail, imgUrl } = this.state
        return (
            <main className="homeDetail-page">
                <div>
                    {detail.type == 1
                        ? <div>
                            <div className="title">{detail.title}</div>
                            <div className='btm'>
                                <div className='time'>
                                    <div className='imgCtn'>
                                        <img src={require("common/img/clock.png")}></img>
                                    </div>
                                    <div className='txt'>{detail.addTime}</div>
                                </div>
                                <div className='viewNum'>
                                    <div className='imgCtn'>
                                        <img src={require("common/img/eye.png")}></img>
                                    </div>
                                    <div className='txt'>{detail.addReadTimes}</div>
                                </div>
                            </div>
                        </div>
                        : <div className="videoPart">
                            <div className="videoCtn">
                                {detail.videoFileId ? <video id="media" controls poster={imgUrl + detail.imgFileId} >
                                    <source src={imgUrl + detail.videoFileId} />
                                </video> : ""}
                            </div>
                            <div className="title">{detail.title}</div>
                            <div className='btm'>
                                <div className='time'>
                                    <div className='imgCtn'>
                                        <img src={require("common/img/clock.png")}></img>
                                    </div>
                                    <div className='txt'>{detail.addTime}</div>
                                </div>
                                <div className='viewNum'>
                                    <div className='imgCtn'>
                                        <img src={require("common/img/eye.png")}></img>
                                    </div>
                                    <div className='txt'>{detail.addReadTimes}</div>
                                </div>
                            </div>
                        </div>}

                    <div className='wxparse-wrap' dangerouslySetInnerHTML={{ __html: detail.body }}></div>
                </div>
            </main >
        )
    }
}

export default withRouter(HomeDetail)