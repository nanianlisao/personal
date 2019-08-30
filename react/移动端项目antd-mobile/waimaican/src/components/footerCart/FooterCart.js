import React from 'react'
import './FooterCart.css'
export default class FooterCart extends React.Component {
    static defaultProps = {
        totalCount: 0,
        zIndex: 100,
        totalPrice: 0,
        startExpense: 0,
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    toSubmitOrder() {
        let { totalPrice, startExpense, totalCount } = this.props
        if (totalPrice >= startExpense && totalCount > 0) {
            this.props.toSubmitOrder()
        }
    }


    render() {
        let { totalCount, zIndex, totalPrice, deliveryExpense, allPackingExpense, startExpense, orderType } = this.props
        return (
            <div className="footer-cart" >
                <div className={["pay-options", totalPrice >= startExpense && totalCount > 0 ? '' : 'greyC'].join(" ")} style={{ zIndex: zIndex }}>
                    <div className="pay-left" onClick={() => {
                        if (this.props.handleFooterCart) {
                            this.props.handleFooterCart()
                        }
                    }}>
                        <div className="shopCar">
                            <div className="bg">
                                <img src={require("common/img/shopCar2.png")} mode="aspectFit"></img>
                            </div>
                            {totalCount ? <div className="num">{totalCount}</div> : ""}
                        </div>
                        {totalCount > 0
                            ? <div className="footer-infos">
                                <div className="price" >
                                    <span>￥</span>{totalPrice}</div>
                                {orderType ? <div className={["more-info", totalPrice >= startExpense && totalCount > 0 ? "active" : ""].join(" ")}>
                                    <span>配送费：{deliveryExpense}元</span>
                                    <span>包装费：{allPackingExpense}元</span>
                                </div> : ""}
                            </div>
                            : <div className="price">
                                <span>未选商品</span>
                            </div>}
                    </div>
                    <div className="confirm-btn" onClick={() => {
                        this.toSubmitOrder()
                    }}>{totalPrice >= startExpense && totalCount > 0 ? "去结算" : startExpense + "起送"}</div>
                </div>
            </div >
        )
    }
}
