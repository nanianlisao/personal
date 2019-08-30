import React from 'react'
import './Cart.less'
import { CartGoodsStyles } from 'components/goods-style/GoodsStyles'
import { goPage, Axios } from 'util/util'
import Constant from 'util/Constant'
import Nodata from 'common/nodata/Nodata'
import { Toast } from 'antd-mobile';
export default class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            downShoppingCartGoods: [],
            upShoppingCartGoods: [],
            checkedAll: false, // 全选
            checkedAllPrice: 0, // 当前选中的总价格
        }
    }

    componentWillMount() {
        this.getCartList()
    }

    // 获取购物车数据
    async getCartList() {
        let res = await Axios.get(`/shoppingcart/find/user/${Constant.data.storesId}`)
        console.log(res)
        this.setState({
            upShoppingCartGoods: res.data.upShoppingCartGoods,
            downShoppingCartGoods: res.data.downShoppingCartGoods,
        }, this.computerAllPrice)
    }

    // 更改购物车数量
    handleChangeNum = async (index, id, type) => {
        let { upShoppingCartGoods } = this.state
        if (type === 'add') {
            let res = await Axios.post('/shoppingcart/save', {
                goodsId: id,
                quantity: 1,
                storesId: Constant.data.storesId
            })
            upShoppingCartGoods[index].quantity++;
            this.setState({
                upShoppingCartGoods
            }, this.computerAllPrice)
        } else if (type === 'reduce') {
            if (upShoppingCartGoods[index].quantity === 1) {
                Toast.info('受不了了，宝贝不能再减少了哦')
                return
            }
            let res = await Axios.post('/shoppingcart/delete', {
                shoppingCartBoRequests: [{
                    goodsId: id,
                    quantity: 1,
                    storesId: Constant.data.storesId
                }]
            })
            upShoppingCartGoods[index].quantity--;
            this.setState({
                upShoppingCartGoods
            }, this.computerAllPrice)
        }
    }

    // 选中全选
    handleCheckAll = () => {
        let { checkedAll, upShoppingCartGoods } = this.state
        upShoppingCartGoods = upShoppingCartGoods.map((x) => {
            x.checked = !checkedAll
            return x
        })
        this.setState({
            checkedAll: !checkedAll,
            upShoppingCartGoods: upShoppingCartGoods
        }, this.computerAllPrice)

    }

    // 多个删除
    async multiDel() {
        let { upShoppingCartGoods } = this.state
        let checkedArr = upShoppingCartGoods.filter(x => x.checked)
        if (checkedArr.length === 0) {
            Toast.fail('请先选中商品哦')
            return
        }
        let shoppingCartBoRequests = checkedArr.map(x => ({
            goodsId: x.goodsId,
            quantity: x.quantity,
            storesId: Constant.data.storesId
        }))

        let res = await Axios.post('/shoppingcart/delete', {
            shoppingCartBoRequests: shoppingCartBoRequests
        }, true)
        this.refs.content.scrollTop = 0
        this.getCartList()
    }

    // 清空失效商品
    delDownShopping = async () => {
        let res = await Axios.post(`/shoppingcart/deleteAll/${Constant.data.storesId}`)
        this.setState({
            downShoppingCartGoods: []
        })
    }

    // 去结算
    confirmOrder = () => {
        let { upShoppingCartGoods, checkedAllPrice } = this.state
        let checkedArr = upShoppingCartGoods.filter(x => x.checked)
        if (checkedArr.length === 0) {
            Toast.fail('请先选中商品哦')
            return
        }
        goPage(`/home/goodsDetail/confirmOrder?order=${encodeURIComponent(JSON.stringify(checkedArr))}&totalPrice=${checkedAllPrice}`)
    }

    // 计算总价格
    computerAllPrice() {
        let { upShoppingCartGoods } = this.state
        let checkedArr = upShoppingCartGoods.filter(x => x.checked)
        let checkedAllPrice = checkedArr.reduce((prev, next) => {
            return prev + next.price * next.quantity
        }, 0)
        this.setState({
            checkedAllPrice: checkedAllPrice.toFixed(2)
        })
    }



    render() {
        let { upShoppingCartGoods, downShoppingCartGoods, checkedAll, checkedAllPrice } = this.state
        return (
            <main className="page-cart" style={{
                height: document.documentElement.clientHeight - 50,
            }}>
                <section className="content" ref="content">
                    <div className="useable-goodsList">
                        {upShoppingCartGoods.map((x, i) => (
                            <div className="flex-between" key={i}>
                                <div className="check-tab" onClick={() => {
                                    upShoppingCartGoods[i].checked = !upShoppingCartGoods[i].checked
                                    this.setState({
                                        upShoppingCartGoods,
                                        checkedAll: upShoppingCartGoods.every(x => x.checked)
                                    }, this.computerAllPrice)
                                }}><img src={x.checked ? require('common/img/check_ac.png') : require('common/img/check.png')} alt="" /></div>
                                <CartGoodsStyles
                                    onClick={()=>{
                                        goPage(`/home/goodsDetail?id=${x.goodsDetailVo.goodsTemplateId}`)
                                    }}
                                    className="good-right"
                                    changeNum={true}
                                    small={true}
                                    border={false}
                                    handleChangeNum={this.handleChangeNum.bind(this, i, x.goodsId)}
                                    spec={<div>{x.goodsDetailVo.goodsSpecificationDetailVoList && x.goodsDetailVo.goodsSpecificationDetailVoList.map((y, z) => (
                                        <span className="mr-10" key={z}>{y.specificationName}:{y.specificationValueName}</span>
                                    ))}</div>}
                                    fileId={x.goodsDetailVo.imgFileId}
                                    name={x.goodsDetailVo.goodsTemplateName}
                                    price={x.price}
                                    quantity={x.quantity}
                                />
                            </div>
                        ))}
                    </div>
                    {upShoppingCartGoods.length == 0 ? <Nodata text="您还没有添加购物车" /> : ""}
                    {downShoppingCartGoods.length > 0 ? <div className="disable-goodsList" >
                        <div className="title flex-between" onClick={this.delDownShopping}>
                            <span>失效商品{downShoppingCartGoods.length}件</span>
                            <span className="del-disable">清空失效商品</span>
                        </div>
                        {downShoppingCartGoods.map((x, i) => (
                            <div className="flex-between" key={i}>
                                <div className="check-state">失效</div>
                                <CartGoodsStyles
                                    className="good-right"
                                    disable={true}
                                    small={true}
                                    border={false}
                                    fileId={x.goodsDetailVo.imgFileId}
                                    name={x.goodsDetailVo.goodsTemplateName}
                                />
                            </div>
                        ))}
                    </div> : ""}
                </section>
                {upShoppingCartGoods.length > 0 ? <section className="cart-footer flex-between">
                    <div className="flex-center">
                        <div className="flex-center check-all" onClick={this.handleCheckAll}>
                            <img src={checkedAll ? require('common/img/check_ac.png') : require('common/img/check.png')} alt="" />
                            <span>全选</span>
                        </div>
                        <div className="del-all" onClick={() => {
                            this.multiDel()
                        }}>删除</div>
                    </div>
                    <div className="total-price">合计<span>￥{checkedAllPrice}</span></div>
                    <div className="footer-btn hover-btn" onClick={this.confirmOrder}>去结算</div>
                </section> : ""}
            </main>
        )
    }
}