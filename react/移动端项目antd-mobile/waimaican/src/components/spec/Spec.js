import React from 'react'
import './Spec.css'
import { objDeepCopy } from 'util/util'
import CenterShow from 'components/centerShow/CenterShow'
export default class Spec extends React.Component {
    static defaultProps = {
        currentItem: null
    }
    constructor(props) {
        super(props)
        this.state = {
            currentItem: null
        }
    }
    componentDidMount() {
        if (this.props.currentItem) {
            this.setState({
                currentItem: this.props.currentItem
            })
        }
    }
    componentWillReceiveProps(props) {
        if (props.currentItem) {
            this.setState({
                currentItem: props.currentItem
            })
        }
    }

    show() {
        this.refs.spec.show()
    }
    hide() {
        this.refs.spec.hide()
    }

    // 切换规格
    checkSpecs(item, index, bindex) {
        this.props.checkSpecs(item, index, bindex)
    }

    async addCart() {
        let checked = this.state.currentItem.checked
        if (checked.inventory == 0) {
            return
        }
        await this.props.addCart(checked.id)
        this.hide()
    }


    cartShow() {
        if (this.props.cartShow) {
            this.props.cartShow()
        }
    }

    render() {
        let { currentItem } = this.state
        return (
            <div>
                <CenterShow ref="spec" hide={this.cartShow.bind(this)}>
                    {currentItem ? <div className='spec-box'>
                        <div className="title">{currentItem.name}</div>
                        <div className="specs">
                            {currentItem.specificationGoodsQueryVoList && currentItem.specificationGoodsQueryVoList.map((bItem, bIndex) => {
                                return (
                                    <div className="item" key={bItem.name}>
                                        <div className="item-name">{bItem.name}</div>
                                        <div className="item-spac-box">
                                            {bItem.goodsSpecificationVoList.map((item, index) => {
                                                return (
                                                    <div className={["spec", item.choose ? 'choose' : '', item.grey ? 'grey' : ''].join(" ")}
                                                        key={item.specificationValueId}
                                                        onClick={() => {
                                                            this.checkSpecs(item, index, bIndex)
                                                        }}>{item.specificationValueName}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="bottom">
                            <div className="price">￥{currentItem.checked.price}</div>
                            <div className={["add-btn", currentItem.checked.inventory <= 0 ? 'grey' : ''].join(" ")}
                                onClick={() => {
                                    this.addCart()
                                }}>
                                {currentItem.checked.inventory <= 0 ? '库存不足' : '加入购物车'}</div>
                        </div>
                    </div> : ""}
                </CenterShow>
            </div>
        )
    }
}
