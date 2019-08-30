import React from 'react'
import { Modal, SearchBar, Toast } from 'antd-mobile';
import { Axios, goPage, objDeepCopy, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
import FooterCart from 'components/footerCart/FooterCart' // 底部固定栏
import CartList from 'components/cartList/CartList' // 购物车底部弹窗
import Spec from 'components/spec/Spec' // 规格弹窗
import LazyLoad from 'react-lazyload'
import '../CheckGoods.css'
import './SearchGoods.css'
const alert = Modal.alert;
export default class SearchGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            tableId: '',
            storesId: '', // 店铺id
            shoppingCartId: '', // 购物车id
            storesDetail: { divPagerVoList: [] }, // 店铺详情
            totalPrice: 0,
            totalCount: 0,
            startExpense: 0, // 起送价
            allPackingExpense: 0, // 打包费
            deliveryExpense: 0, // 配送费
            zIndex: 88,
            cartShow: false,
            searchList: [],
            currentItem: null, //选取规格时的对象
        }
    }
    componentWillMount() {
        document.title = '搜索'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)

        var { shoppingCartId, storesId, tableName, tableId, orderType } = options
        let storesDetail = localStorage.getItem('storesDetail')
        this.setState({
            shoppingCartId,
            storesId,
            storesDetail: JSON.parse(storesDetail),
            tableName,
            tableId,
            orderType
        }, () => {
            this.getShoppingcart()
            this.createWebSocket() // 创建websocket
        })
    }
    componentDidMount() {
        this.refs.searchBar.focus()
    }
    componentWillUnmount() {
        this.ws.close()
    }
    // 查看购物车数据
    async getShoppingcart() {
        let res = await Axios.get('/shoppingcart/query', {
            storesId: this.state.storesId,
            tableId: this.state.tableId,
            takeOutType: this.state.orderType ? 3 : 2,   //2:到店 3:外卖
            userTakeOutAddressId: this.state.orderType ? Constant.data.userAddress.id : ''
        })
        let shoppingCartGoodsVoList = res.data.shoppingCartGoodsVoList
        this.setState({
            shoppingCartId: res.data.shoppingCartId,
            startExpense: res.data.startExpense ? res.data.startExpense : 0, // 起送价
            allPackingExpense: res.data.allPackingExpense ? res.data.allPackingExpense : 0,
            deliveryExpense: res.data.deliveryExpense ? res.data.deliveryExpense : 0,
        })
        this._watchCount(shoppingCartGoodsVoList) // 购物车数据和商品数据数量比对
    }

    createWebSocket() {
        let url = `${Constant.getWsWork()}/webSocket/shoppingcart/${Constant.getToken()}/${this.state.storesId}/${this.state.tableId ? this.state.tableId : '000'}`
        this.ws = new WebSocket(url);
        this.ws.onopen = function (e) {
            console.log("open");
        }

        this.socketTimer = setInterval(() => {
            this.ws.send('socket')
        }, 50000)

        this.ws.onclose = (e) => {
            clearInterval(this.socketTimer)
            console.log("close");
        }

        this.ws.onmessage = (res) => {
            let data = JSON.parse(res.data)
            this.setState({
                allPackingExpense: data.allPackingExpense ? data.allPackingExpense : 0,
                deliveryExpense: data.deliveryExpense ? data.deliveryExpense : 0,
            })
            this._watchCount(data.shoppingCartGoodsVoList)
        }
    }

    searchGoods() {
        this.search()
    }

    async search(name = this.state.name) {
        let res = await Axios.get('/goodsTemplate/listWithoutState', {
            name: name,
            storesId: this.state.storesId,
            startIndex: 0,
            pageSize: 200
        })
        let data = res.data.items
        this.setState({
            searchList: data,
            finished: true,
            showLoading: false
        }, () => {
            this._watchCount(this.state.shoppingCartGoodsVoList)
        })
    }

    // 显示隐藏购物车
    handleFooterCart() {
        // 显示购物车列表
        if (this.state.totalCount) {
            if (this.state.cartShow) {
                this.refs.cartList.hide()
                this.state.cartShow = false
            } else {
                this.refs.cartList.show()
                this.setState({
                    cartShow: true
                })
            }
        }
    }

    cartShow() {
        this.state.cartShow = false
    }

    setFootIndex() {
        this.setState({
            zIndex: 100
        })
    }

    // 选择商品（点击加号）
    async checkSpec(item) {
        console.log(item)
        if (item.inventory <= 0) {
            return
        }
        if (!item.specificationGoodsQueryVoList) { //单规格商品 直接加入购物车
            try {
                let res = await Axios.post('/shoppingcart/add', {
                    goodsId: item.goodsVoList[0].id,
                    shoppingCartId: this.state.shoppingCartId,
                    tableId: this.state.tableId,
                    storesId: this.state.storesId,
                    takeOutType: this.state.orderType ? 3 : 2,   //2:到店 3:外卖
                    userTakeOutAddressId: this.state.orderType ? Constant.data.userAddress.id : ''
                })
            } catch (e) {
                if (e.res.retCode == '4098' || e.res.retCode == '12291') {
                    Toast.fail(e.res.retMsg)
                    return
                }
            }
        } else {
            let checkArr = item.goodsVoList.filter(x => x.acquiescent == 1)
            let noInven = item.goodsVoList.filter(x => x.inventory == 0)
            item.checked = checkArr[0]
            item.noInven = noInven
            this._watch(item)
            this.setState({
                currentItem: item
            })
            this.refs.spec.show()
        }
    }

    // 提示用户在购物车中删减商品(点击减号)
    showCancleText() {
        alert('提示', '商品请在购物车中删减', [
            { text: '知道了', style: { color: '#ea5520' } },
        ])
    }

    // 切换单个规格
    checkSpecs(item, index, bindex) {
        if (item.choose || item.grey) return;
        let currentItem = this.state.currentItem
        currentItem.specificationGoodsQueryVoList[bindex].goodsSpecificationVoList.map((x, i) => {
            x.choose = i === index
        })
        let checkedItem = objDeepCopy(currentItem.checked)
        currentItem.goodsVoList.map(goods => {
            let isThisGoods = true;
            goods.goodsSpecificationDetailVoList.map((spec, index) => {
                if (checkedItem.goodsSpecificationDetailVoList[index].specificationId == item.specificationId) {
                    checkedItem.goodsSpecificationDetailVoList[index].specificationValueId = item.specificationValueId
                }
                if (!(spec.specificationId == checkedItem.goodsSpecificationDetailVoList[index].specificationId && spec.specificationValueId == checkedItem.goodsSpecificationDetailVoList[index].specificationValueId)) {
                    isThisGoods = false;
                }
            })
            if (isThisGoods) {
                item = goods;
            }
        })
        currentItem.checked = item
        this.setState({
            currentItem
        })
    }


    // 加入购物车
    async addCart(goodsId) {
        try {
            let res = await Axios.post('/shoppingcart/add', {
                goodsId: goodsId,
                shoppingCartId: this.state.shoppingCartId,
                tableId: this.state.tableId,
                storesId: this.state.storesId,
                takeOutType: this.state.orderType ? 3 : 2,   //2:到店 3:外卖
                userTakeOutAddressId: this.state.orderType ? Constant.data.userAddress.id : ''
            })
        } catch (e) {
            console.log(e)
            if (e.res.retCode == '4098' || e.res.retCode == '12291') {
                Toast.fail(e.res.retMsg)
                return
            }
        }
    }

    // 购物车减少
    async reduceCart(goodsId) {
        let res = await Axios.post('/shoppingcart/del', {
            goodsId: goodsId,
            shoppingCartId: this.state.shoppingCartId,
            tableId: this.state.tableId,
            storesId: this.state.storesId,
            takeOutType: this.state.orderType ? 3 : 2,   //2:到店 3:外卖
            userTakeOutAddressId: this.state.orderType ? Constant.data.userAddress.id : ''
        })
    }

    // 清空购物车
    async clearCart() {
        let res = await Axios.post('/shoppingcart/delAll', {
            shoppingCartId: this.state.shoppingCartId,
            tableId: this.state.tableId,
            storesId: this.state.storesId,
            takeOutType: this.state.orderType ? 3 : 2,   //2:到店 3:外卖
            userTakeOutAddressId: this.state.orderType ? Constant.data.userAddress.id : ''
        })
    }

    _watch(item) {
        item.specificationGoodsQueryVoList.map(x => {
            x.goodsSpecificationVoList.map(y => {
                y.choose = false
                item.checked.goodsSpecificationDetailVoList.map(z => {
                    if (y.specificationId == z.specificationId && y.specificationValueId == z.specificationValueId) {
                        y.choose = true
                    }
                })
            })
        })
    }

    // 计算列表中商品在购物车中的数量
    _watchCount(shoppingCartGoodsVoList) {
        // 所有商品被清空后 收起购物车列表
        if (shoppingCartGoodsVoList.length == 0 && this.state.cartShow) {
            this.goodsList.hideDialog()
            this.state.cartShow = false
        }
        let totalPrice = 0,
            totalCount = 0
        let searchList = this.state.searchList
        shoppingCartGoodsVoList.map(x => {
            totalPrice = Number(Number(totalPrice) + Number(x.price * x.quantity)).toFixed(2)
            totalCount += x.quantity
            x.totalPrice = Number(x.price * x.quantity).toFixed(2)
        })
        searchList.map(x => {
            x.goodsTemplateResult.num = 0
            shoppingCartGoodsVoList.map(m => {
                if (m.goodsDetailVo.goodsTemplateId === x.goodsTemplateResult.id) {
                    x.goodsTemplateResult.num += parseInt(m.quantity)
                }
            })
        })
        totalPrice = Number(Number(totalPrice) + Number(this.state.allPackingExpense) + Number(this.state.deliveryExpense)).toFixed(2)
        this.setState({
            searchList,
            shoppingCartGoodsVoList,
            totalPrice,
            totalCount
        })
    }
    // 去结算
    toSubmitOrder() {
        if (this.state.totalPrice == 0) {
            return
        }
        let {
            shoppingCartId,
            shoppingCartGoodsVoList,
            tableId,
            storesId,
            tableName,
            storesDetail,
            deliveryExpense,
            allPackingExpense,
        } = this.state
        let storesName = encodeURIComponent(storesDetail.name)
        localStorage.setItem('shoppingCartGoodsVoList', JSON.stringify(shoppingCartGoodsVoList))
        let url = null;
        if (this.state.orderType === 'waimai') {
            url = `/waimaiSubmitOrder?storesId=${storesId}&shoppingCartId=${shoppingCartId}&tableId=${tableId}&tableName=${tableName}&storesName=${storesName}&deliveryExpense=${deliveryExpense}&allPackingExpense=${allPackingExpense}`
        } else {
            url = `/submitOrder?storesId=${storesId}&shoppingCartId=${shoppingCartId}&tableId=${tableId}&tableName=${tableName}`
        }
        goPage(url)
    }
    render() {
        let { searchList, finished, loading, totalCount, totalPrice, currentItem, zIndex, imgUrl, deliveryExpense, allPackingExpense, startExpense, orderType } = this.state
        return (
            <div className="page-searchGoods">
                <div className='pickGoods-box'>
                    <div className='right-box'>
                        <div className="content">
                            <div className='search-box flex-middle'>
                                <div className="search">
                                    <SearchBar
                                        ref="searchBar"
                                        style={{ height: '0.7rem', borderRadius: '0.1rem' }}
                                        placeholder="请输入商品名" maxLength={15}
                                        showCancelButton={false}
                                        cancelText=" "
                                        onCancel={() => {

                                        }}
                                        onSubmit={(e) => {
                                            this.search(e)
                                        }}
                                        onChange={(e) => {
                                            this.state.name = e
                                        }}
                                    />
                                </div>
                                <div className='search-btn' onClick={() => {
                                    this.search()
                                }}>搜索</div>
                            </div>
                            <div className="goods-box">
                                <div className='goods-list'>
                                    {searchList.map((item, index) => {
                                        return (
                                            <div className="goods" key={index}>
                                                <div className="left">
                                                    <div style={{ position: 'relative' }}>
                                                        {item.goodsTemplateResult.inventory <= 0 ? <div className='no-goods'>商品已售罄</div> : ""}
                                                        <LazyLoad
                                                            overflow={true}
                                                            placeholder={<img alt="" src={require('common/img/bg.jpg')}></img>}
                                                            height="100%"
                                                        >
                                                            <img className="cover" src={imgUrl + item.goodsTemplateResult.imgFileId + '?x-oss-process=image/resize,w_300'}></img>
                                                        </LazyLoad>
                                                    </div>
                                                    <div className="goods-info">
                                                        <span className="name text-overflow-2">{item.goodsTemplateResult.name}</span>
                                                        <span className="sales">月销{item.goodsTemplateResult.sales}</span>
                                                        <div className="price">￥{item.goodsTemplateResult.price}
                                                            <div className="num-btn-box">
                                                                {item.goodsTemplateResult.num > 0 ? <img src={require("common/img/reduce.png")} onClick={() => {
                                                                    this.showCancleText()
                                                                }}></img> : ""}
                                                                {item.goodsTemplateResult.num > 0 ? <span className="num" >{item.goodsTemplateResult.num}</span> : ""}
                                                                <img src={require(`common/img/${item.goodsTemplateResult.inventory > 0 ? 'plus.png' : 'plus2.png'}`)}
                                                                    onClick={() => {
                                                                        this.checkSpec(item)
                                                                    }}></img>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {searchList.length == 0 && finished ? <div className="normal">
                                        <img src={require('common/img/null2.png')}></img>
                                        <span>未搜索到相关商品</span>
                                    </div> : ""}
                                </div>
                            </div>

                            {loading ? <div className='loadings' >
                                <img src={require('common/img/loading.gif')}></img>
                                <span>加载中</span>
                            </div> : ""}
                        </div>
                    </div>
                </div>
                <FooterCart ref="cart"
                    deliveryExpense={deliveryExpense ? deliveryExpense : 0}
                    startExpense={startExpense ? startExpense : 0}
                    orderType={orderType ? orderType : ''}
                    allPackingExpense={allPackingExpense ? allPackingExpense : 0}
                    handleFooterCart={this.handleFooterCart.bind(this)}
                    toSubmitOrder={this.toSubmitOrder.bind(this)}
                    totalCount={totalCount}
                    zIndex={zIndex}
                    totalPrice={totalPrice}>
                </FooterCart>
                <div>
                    <CartList ref="cartList"
                        data={this.state.shoppingCartGoodsVoList}
                        setFootIndex={this.setFootIndex.bind(this)}
                        cartShow={this.cartShow.bind(this)}
                        addCart={this.addCart.bind(this)}
                        reduceCart={this.reduceCart.bind(this)}
                        clearCart={this.clearCart.bind(this)}
                    ></CartList>
                </div>
                <Spec ref="spec"
                    currentItem={currentItem}
                    checkSpecs={this.checkSpecs.bind(this)}
                    addCart={this.addCart.bind(this)}></Spec>
            </div>
        )
    }
}