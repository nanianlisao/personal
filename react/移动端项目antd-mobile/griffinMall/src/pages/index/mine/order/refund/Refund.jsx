import React from 'react'
import { withRouter } from 'react-router-dom';
import { OrderGoodsStyles } from 'components/goods-style/GoodsStyles'
import './Refund.less'
import { InputItem, TextareaItem, Toast, Modal } from 'antd-mobile';
import { goPage, goBack, Axios, parseQueryString } from 'util/util'
const alert = Modal.alert
class Refund extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: 1,
            reason: '',
            quantity: '',
            refundPrice: 0,
        }
    }

    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        let item = JSON.parse(decodeURIComponent(options.item))
        this.setState({
            item
        })
        console.log(item)
    }

    // 申请退款
    async submit() {
        let { item, quantity, reason } = this.state
        let res = await Axios.post(`/order/submit/refund`, {
            orderGoodsRefundRequest: [{
                orderGoodsId: item.id,
                orderId: item.orderId,
                quantity: quantity,
                reason: reason,
            }]
        }, true)
        alert('提示', '申请退款成功', [{
            text: '确定', onPress: () => {
                goBack()
            }
        }])
    }

    render() {
        let { item, reason, quantity, refundPrice } = this.state
        if (quantity) {
            refundPrice = Number(item.price * quantity - item.discounts / item.quantity).toFixed(2)
        }
        return (
            <main className="page-refund">
                <div className="refund-box">
                    <section className="goods-detail border2">
                        <OrderGoodsStyles
                            onClick={() => {
                                goPage(`/home/goodsDetail?id=${item.goodsTemplateId}`)
                            }}
                            fileId={item.imgFileId}
                            name={item.goodsName}
                            price={item.price}
                            quantity={item.quantity}
                            spec={<div>{item.orderGoodsSpecificationVos && item.orderGoodsSpecificationVos.map((y, z) => (
                                <span className="mr-10" key={z}>{y.specificationName}:{y.specificationValueName}</span>
                            ))}</div>}
                        />
                    </section>

                    <section className="refund-body">
                        <div className="reason">
                            <div className="title">退款理由：</div>
                            <TextareaItem className="input-val textarea"
                                autoHeight
                                rows={5}
                                value={reason}
                                onChange={(e) => {
                                    this.setState({
                                        reason: e
                                    })
                                }}
                            />
                        </div>
                        <div className="count flex-between">
                            <div className="title">退款数量：</div>
                            <InputItem
                                className="input-val input"
                                value={quantity}
                                type="number"
                                onChange={(e) => {
                                    if (e <= item.quantity) {
                                        this.setState({
                                            quantity: e
                                        })
                                    }
                                }}></InputItem>
                        </div>
                        <div className="count price flex-center">
                            <div className="title">退款金额：</div>
                            <div className="val">¥{refundPrice}元(实际金额以到账金额为准)</div>
                        </div>
                    </section>

                    <section className="footer-wrap">
                        <div className="footer flex-between">
                            <div className="footer-btn" onClick={() => {
                                this.submit()
                            }}>提交申请</div>
                        </div>
                    </section>
                </div>

            </main >
        )
    }
}
export default withRouter(Refund)