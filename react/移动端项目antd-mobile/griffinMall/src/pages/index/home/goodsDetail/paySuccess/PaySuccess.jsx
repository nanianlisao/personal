import React from 'react'
import { withRouter } from 'react-router-dom';
import { LevelGoodsStyles } from 'components/goods-style/GoodsStyles'
import './PaySuccess.less'
import { goPage, Axios,parseQueryString } from 'util/util'
import Constant from 'util/Constant'

class PaySuccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            orderId:''
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.setState({
            orderId: options.orderId
        })
        this.getGoodsList()
    }

    async getGoodsList() {

        let res = await Axios.get('/goods/recommend/app/list', {
            startIndex: 0,
            pageSize: 100,
            storesId: Constant.data.storesId
        })
        this.setState({
            dataList: res.data.items
        })
    }

    render() {
        let { dataList } = this.state
        return (
            <main className="page-paySuccess">
                <section className="header-top">
                    <div className="status">支付成功！</div>
                    <div className="btn-wrap flex-between">
                        <div className="btn go-home" onClick={() => {
                            localStorage.setItem('selectedTab', 'home')
                            goPage('/index')
                        }}>返回首页</div>
                        <div className="btn" onClick={()=>{
                            goPage(`/mine/orderDetail/${this.state.orderId}`)
                        }}>查看订单</div>
                    </div>
                </section>
                {dataList.length > 0 ? <section className="random-goods">
                    <div className="title">今日推荐</div>
                    <div className="goods-list">
                        {dataList.map((x, i) => (
                            <LevelGoodsStyles
                                onClick={() => {
                                    goPage(`/home/goodsDetail?id=${x.goodsTemplateId}`)
                                }}
                                key={i}
                                showDots={false}
                                fileId={x.imgFileId}
                                name={x.goodsTemplateName}
                                price={x.price}
                                salesCount={x.sales}
                            />
                        ))}
                    </div>
                </section> : ""}

            </main>
        )
    }
}

export default withRouter(PaySuccess)