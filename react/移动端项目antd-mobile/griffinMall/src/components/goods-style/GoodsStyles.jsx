import React from 'react'
import './GoodsStyles.less'
import Constant from 'util/Constant'
import LazyLoad from 'react-lazyload';
// 首页商品样式
export class HomeGoodsStyles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
        }
    }

    static defaultProps = {
        onClick: () => { },
        fileId: '6814beb8639221a5559d2604beda77f0',
        name: '',
        price: 0,
        salesCount: 0,
        style: {}
    }

    render() {
        let { imgUrl } = this.state
        let { onClick, fileId, name, price, salesCount, style } = this.props
        return (
            <div className="box-home-goods shadow-box" style={{ ...style }} onClick={() => {
                typeof onClick === 'function' && onClick()
            }}>
                <div className="poster">

                    <LazyLoad
                        overflow={true}
                        placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                        height="100%"
                    >
                        <img src={imgUrl + fileId} alt="" />
                    </LazyLoad>
                </div>
                <div className="goods-content">
                    <div className="name text-overflow-2" style={{ WebkitBoxOrient: 'vertical' }}>{name}</div>
                    <div className="footer flex-between">
                        <div className="footer-info"><span className="font-22">￥</span><span className="price">{price}</span><span className="font-22 sales-count">{salesCount}人购买</span></div>
                        <div className="postfix"><img src={require('common/img/postfix.png')} alt="" /></div>
                    </div>
                </div>
            </div>
        )
    }
}

// 外部商品样式
export class LevelGoodsStyles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
        }
    }

    static defaultProps = {
        onClick: () => { },
        fileId: 'daeee7e8d367b5a737904cacc3fd293a',
        name: '',
        price: 0,
        salesCount: 0,
        style: {},
        small: false,
        marks: [], // 标签
        showDots: true,
        showMoreArrow: false
    }

    render() {
        let { imgUrl } = this.state
        let { onClick, fileId, name, price, salesCount, style, showMoreArrow, showDots, marks, small } = this.props
        return (
            <div className={["box-level-goods flex-center", small ? 'box-small-level-goods' : ''].join(' ')} style={{ ...style }} onClick={() => {
                typeof onClick === 'function' && onClick()
            }}>
                <div className="poster">

                    <LazyLoad
                        overflow={true}
                        offset={400}
                        placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                        height="100%"
                    >
                        <img src={imgUrl + fileId} alt="" />
                    </LazyLoad>
                </div>
                <div className="goods-content">
                    <div className="name text-overflow-2" style={{ WebkitBoxOrient: 'vertical' }}>{name}</div>
                    {marks.length > 0 ? <div className="marks-list flex-center">
                        {marks.map((x, i) => (
                            <div className="marks-item" key={i}>{x}</div>
                        ))}
                    </div> : null}
                    <div className="footer flex-between">
                        <div className="footer-info flex-center"><span className="price">￥{price}</span><div className="sales-count flex-center"><img src={require('common/img/cart_poster.png')} alt="" /><span>已售{salesCount}</span></div></div>
                        {showDots ? <div className="postfix"><img src={require('common/img/postfix.png')} alt="" /></div> : null}
                    </div>
                </div>
                {showMoreArrow ? <div className="more-arrow-r more">
                    <img src={require('common/img/arrowBG.png')} alt="" />
                </div> : null}
            </div>
        )
    }
}

// 提交订单时的样式 和购物车样式
export class CartGoodsStyles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
        }
    }

    static defaultProps = {
        onClick: () => { },
        fileId: '',
        name: '',
        price: 0,
        quantity: 1,
        border: true,
        handleChangeNum: () => { },
        changeNum: false,  // 是否可更改数量
        salesCount: 0,
        style: {},
        spec: null, // 规格 传入VNode
        disable: false,  // 是否失效
        reason: '该商品已下架或库存不足，请联系卖家。', //失效原因 disable为ture时有效
        small: false,  // 尺寸
        className: '',
    }

    render() {
        let { imgUrl } = this.state
        let { onClick, fileId, name, price, style, quantity, changeNum, border, className, small, reason, disable, spec } = this.props
        let totalPrice = (price * quantity).toFixed(2)
        return (
            <div className={[className, "box-level-cart-goods flex-center", small ? 'small' : '', border ? 'border2' : ''].join(' ')} style={{ ...style }} onClick={() => {
                typeof onClick === 'function' && onClick()
            }}>
                <div className="poster">

                    <LazyLoad
                        overflow={true}
                        placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                        height="100%"
                    >
                        <img src={imgUrl + fileId} alt="" />
                    </LazyLoad>
                </div>
                <div className="goods-content">
                    <div className={["name text-overflow-2", disable ? 'disable' : ''].join(' ')} style={{ WebkitBoxOrient: 'vertical' }}>{name}</div>
                    {disable ? <div className="reason">{reason}</div> : <div>
                        <div className="spec-box">{spec}</div>
                        <div className="goods-footer flex-between">
                            <div>￥{totalPrice}</div>
                            {changeNum ? <div className="change-num flex-middle">
                                <img src={require('common/img/reduce_btn.png')} alt="" onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.handleChangeNum('reduce')
                                }} />
                                <span>{quantity}</span>
                                <img src={require('common/img/plus_btn.png')} alt="" onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.handleChangeNum('add')
                                }} />
                            </div> : <div>x{quantity}</div>}
                        </div>
                    </div>}
                </div>

            </div>
        )
    }
}


// 订单列表 和详情回显时
export class OrderGoodsStyles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
        }
    }

    static defaultProps = {
        onClick: () => { },
        reply: () => { },
        fileId: 'daeee7e8d367b5a737904cacc3fd293a',
        name: '爱神的箭啥考虑到深蓝的啥考虑到啥考虑到就萨克的了解三了肯德基三的老师看见打开',
        price: 0,
        redMark: '', // 退款或退款中
        quantity: 0,
        style: {},
        spec: null, // 规格
        showReply: false,  //是否展示申请退款按钮
    }

    render() {
        let { imgUrl } = this.state
        let { onClick, fileId, name, price, style, showReply, quantity, spec, redMark } = this.props
        return (
            <div className="box-level-order-goods flex-center" style={{ ...style }} onClick={() => {
                typeof onClick === 'function' && onClick()
            }}>
                <div className="poster">

                    <LazyLoad
                        overflow={true}
                        placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                        height="100%"
                    >
                        <img src={imgUrl + fileId} alt="" />
                    </LazyLoad>
                </div>
                <div className="goods-content">
                    <div className="flex-between">
                        <div className="name text-overflow-2" style={{ WebkitBoxOrient: 'vertical' }}>{name}</div>
                        <div className="goods-right">
                            <div className="price">￥{price}</div>
                            <div>{redMark ? <span className="red-mark">{redMark}</span> : ""} x{quantity}</div>
                        </div>
                    </div>
                    <div className="goods-footer">
                        <div className="spec-box">{spec}</div>
                        {showReply ? <div className="reply" onClick={(e) => {
                            e.stopPropagation()
                            this.props.reply()
                        }}>申请退款</div> : null}
                    </div>

                </div>

            </div>
        )
    }
}


// 拼团列表回显
export class PintuanGoodsStyles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
        }
    }

    static defaultProps = {
        onClick: () => { },
        fileId: 'daeee7e8d367b5a737904cacc3fd293a',
        name: '爱神的箭啥考虑到深蓝的啥考虑到啥考虑到就萨克的了解三了肯德基三的老师看见打开',
        price: 0,
        oldPrice: "499.00",     // 单人买价格
        pintuanCount: "2",    // 几人成团
        showPintuan: false,  //是否展示我要开团按钮
        style: {},
    }

    render() {
        let { imgUrl } = this.state
        let { onClick, fileId, name, price, style, pintuanCount, showPintuan, oldPrice } = this.props
        return (
            <div className="box-pintuan-goods flex-center" style={{ ...style }} onClick={() => {
                typeof onClick === 'function' && onClick()
            }}>
                <div className="poster">

                    <LazyLoad
                        overflow={true}
                        placeholder={<img alt="" src={require('common/img/0.jpg')}></img>}
                        height="100%"
                    >
                        <img src={imgUrl + fileId} alt="" />
                    </LazyLoad>
                </div>
                <div className="goods-content">
                    <div className="name text-overflow-2" style={{ WebkitBoxOrient: 'vertical' }}>{name}</div>
                    <div className="footer flex-between">
                        <div className="left">
                            <div className="left-top"><span className="remark">{pintuanCount}人拼</span><span className="price">￥{price}</span></div>
                            <div className="left-b"><span className="remark">单买价</span><span className="price">￥{oldPrice}</span></div>
                        </div>
                        {showPintuan ? <div className="pintuan-btn">我要开团</div> : ""}
                    </div>
                </div>
            </div>
        )
    }
}

