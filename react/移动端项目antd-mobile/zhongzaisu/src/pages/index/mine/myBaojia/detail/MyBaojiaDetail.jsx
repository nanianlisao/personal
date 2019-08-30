import React from 'react'
import { withRouter } from 'react-router-dom';
import "pages/index/mine/myBaojia/detail/MyBaojiaDetail.less"
import { goPage, Axios } from 'util/util'
class MyBaojiaDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }
    componentWillMount() {
        let newId = this.props.match.params.id
        this.getNewsDetail(newId)
    }

    async getNewsDetail(id) {
        let res = await Axios.get(`/offer/detail/${id}`)
        this.setState({
            detail: res.data
        })
        console.log(res)
    }

    render() {
        let { detail } = this.state
        return (
            <main className="myBaojiaDetail-page">
                <div className="status">
                    <div className="top">
                        <div className="imgCtn">
                            <img alt="" src={require("common/img/checking.png")}></img>
                        </div>
                        <div className="txt">{detail.typeDesc && detail.typeDesc.name}</div>
                    </div>
                    {detail.type == 3 && detail.examineRemark ? <div className="reason">{detail.examineRemark}</div> : ""}
                </div>
                <div className="space"></div>
                <div className="title">
                    <div className="top">【{detail.offerTypeName}】{detail.title} </div>
                    <div className='btm'>
                        <div className='time'>
                            <div className='imgCtn'>
                                <img alt="" src={require("common/img/clock.png")}></img>
                            </div>
                            <div className='txt'>{detail.updateTime}</div>
                        </div>
                        <div className='viewNum'>
                            <div className='imgCtn'>
                                <img alt="" src={require("common/img/eye.png")}></img>
                            </div>
                            <div className='txt'>{detail.fictitiousBrowseCount}</div>
                        </div>
                    </div>
                </div>
                <div className="ctt">{detail.body}</div>
                {detail.type == 3 ? <div className="edit" onClick={() => { goPage(`/baojia/release?id=${detail.id}`) }}>
                    <img alt="" src={require("common/img/pen.png")}></img>
                    <span className='txt'>编辑</span>
                </div> : ""}
            </main >
        )
    }
}

export default withRouter(MyBaojiaDetail)