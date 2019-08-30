import React from 'react'
import './ThemeDetail.less'
import { withRouter } from 'react-router-dom';
import { Drawer } from 'antd-mobile';
import { goPage, Axios, parseQueryString, postMessage } from 'util/util'
import { LevelGoodsStyles } from 'components/goods-style/GoodsStyles'
import Constant from 'util/Constant'
class ThemeDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            open: false,
            detail: {

            },
        }
    }

    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.getTopicDetail(options.id)
    }

    async getTopicDetail(id) {
        let res = await Axios.get(`viewPager/detail/topic/goods/${id}/${Constant.data.storesId}/${Constant.data.appId}`, {}, true)
        console.log(res)
        this.setState({
            detail: res.data
        })
    }

    onOpenChange(e) {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        let { detail } = this.state
        return (
            <Drawer
                className="my-drawer"
                position="bottom"
                style={{ minHeight: document.documentElement.clientHeight }}
                enableDragHandle
                sidebar={
                    <div className="slide-list">
                        {detail.goodsTemplateQueryVos && detail.goodsTemplateQueryVos.map((x, i) => (
                            <LevelGoodsStyles
                                key={i}
                                showMoreArrow={true}
                                showDots={false}
                                fileId={x.imgFileId}
                                name={x.name}
                                price={x.price}
                                salesCount={x.sales}
                                onClick={() => {
                                    goPage(`/home/goodsDetail?id=${x.id}`)
                                }}
                            />
                        ))}
                    </div>
                }
                open={this.state.open}
                onOpenChange={this.onOpenChange.bind(this)}
            >
                <main className="themeDetail-page">
                    <div className="header">
                        <div className="title">{detail.name}</div>
                        <div className='info flex-between'>
                            <div className='time'>{detail.addTime}</div>
                            <div className='flex-center'>
                                <div className='detail-item flex-center'>
                                    <img src={require("common/img/eye.png")}></img>
                                    <span>{detail.viewNumber ? detail.viewNumber : 0}</span>
                                </div>
                                <div className='detail-item flex-center' onClick={() => {
                                    postMessage('share', {
                                        img: detail.imgFileId,
                                        name: detail.name,
                                        themeId: detail.id,
                                        storesId: Constant.data.storesId
                                    })
                                }}>
                                    <img src={require("common/img/share.png")} className="small"></img>
                                    <span>分享</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='content' dangerouslySetInnerHTML={{ __html: detail.text }}></div>
                    {detail.goodsTemplateQueryVos && detail.goodsTemplateQueryVos.length > 0 ? <div className="slide-btn" onClick={() => {
                        this.onOpenChange()
                    }}>商品({detail.goodsTemplateQueryVos.length})</div> : ""}
                </main >
            </Drawer>
        )
    }
}
export default withRouter(ThemeDetail)