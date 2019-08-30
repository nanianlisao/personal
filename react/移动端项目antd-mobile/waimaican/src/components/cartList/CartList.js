import React from 'react'
import './CartList.css'
import FooterShow from 'components/footerShow/FooterShow'
export default class CartList extends React.Component {
    static defaultProps = {
        data: []
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    show() {
        console.log('show')
        if (this.props.setFootIndex) {
            this.props.setFootIndex()
        }
        this.refs.list.show()
    }
    hide() {
        console.log('hide')
        this.refs.list.hide()
    }

    cartShow() {
        if (this.props.cartShow) {
            this.props.cartShow()
        }
    }
    addCart(state, goodsId) {
        if (state == 2) {
            return
        }
        this.props.addCart(goodsId)
    }

    reduceCart(goodsId) {
        this.props.reduceCart(goodsId)
    }
    render() {
        return (
            <FooterShow ref="list" hide={this.cartShow.bind(this)}>
                <div className="footer-cart">
                    <div className="buy-goods-box">
                        <div className="top">
                            <div className="title">
                                <div>已选商品</div>
                            </div>
                            <div className="delete" onClick={() => {
                                this.props.clearCart()
                            }}>
                                <img src={require("common/img/delete.png")} mode="aspectFit"></img>
                            </div>
                        </div>
                        <div className="goods-box">
                            {this.props.data.map((item, index) => {
                                return (
                                    <div key={item.goodsId} className={["goods", item.state == 2 ? 'outTime' : ''].join(" ")}>
                                        <div className="left">
                                            <div className="name text-overflow-1">{item.goodsDetailVo.goodsTemplateName}</div>
                                            <div className="g-spec-box">
                                                {item.goodsDetailVo && item.goodsDetailVo.goodsSpecificationDetailVoList.map((litem) =>
                                                    (<span key={litem.specificationValueId}>{litem.specificationValueName}</span>)
                                                )}
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="price">￥{item.totalPrice}</div>
                                            <div className="num-btn-box">
                                                <img src={require("common/img/reduce.png")} onClick={() => {
                                                    this.reduceCart(item.goodsId)
                                                }}></img>
                                                <span className="num">{item.quantity}</span>
                                                <img src={require(`common/img/${item.state == 2 ? 'plus2.png' : 'plus.png'}`)}
                                                    onClick={() => {
                                                        this.addCart(item.state, item.goodsId)
                                                    }}></img>
                                            </div>
                                        </div>
                                        {item.state == 2 ? <div className="outTime">已失效</div> : ""}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </FooterShow>
        )
    }
}
