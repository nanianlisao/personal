import React from 'react'
import { Carousel, Modal, SearchBar, Toast } from 'antd-mobile';
import { Axios, goPage, objDeepCopy, parseQueryString, postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant'
import FooterCart from 'components/footerCart/FooterCart' // 底部固定栏
import CartList from 'components/cartList/CartList' // 购物车底部弹窗
import Spec from 'components/spec/Spec' // 规格弹窗
import AutoTick from 'components/autoTick/AutoTick' // 优惠券弹窗
import LazyLoad from 'react-lazyload'
import './CheckGoods.css'
const alert = Modal.alert;
export default class CheckGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            tabIndex: 0,
            tableId: '',
            storesId: '', // 店铺id
            shoppingCartId: '', // 购物车id
            storesDetail: { viewPagerVoList: [] }, // 店铺详情
            goodsTypeList: [],
            totalPrice: 0,
            startExpense: 0, // 起送价
            allPackingExpense: 0, // 打包费
            deliveryExpense: 0, // 配送费
            zIndex: 88,
            cartShow: false,
            currentItem: null, //选取规格时的对象
            newTicket: [],
            orderType: '',  // orderType == 'waimai' 时为外卖单
        }
    }
    componentWillUnmount() {
        this.ws && this.ws.close()
    }

    async componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        var { id, noquer, cartId, scene, orderType, tem } = options
        console.log(options)
        if (cartId) {
            this.setState({
                shoppingCartId: cartId
            })
        }
        Toast.loading('加载中', 1)
        await new Promise((res) => {
            var timer2 = setInterval(() => {
                if (window.ws || window.my) {
                    clearInterval(timer2)
                    res()
                }
            }, 100)
        })
        if (orderType === 'waimai') {
            this.setState({
                orderType
            })
        }
        if (scene) {
            scene = decodeURIComponent(scene)
            let arr = scene.split(',');
            this.state.storesId = arr[0]
            this.setState({
                storesId: arr[0]
            })
            this.state.tableId = arr[1] ? arr[1] : '' // 针对用户扫店铺码进入
            if (this.state.tableId) {
                this.getTableName(this.state.tableId)
            }
            if (this.state.tableId && !noquer) { // 携带noquer参数 不去查看桌码下的订单 
                try {
                    let res2 = await Axios.get(`/order/table/detail/${this.state.tableId}`)
                    if (res2.data.orderAndGoodsVos && res2.data.orderAndGoodsVos.length > 0) {
                        alert('提示', '此桌号有未支付的订单', [
                            { text: '稍候', style: { color: '#999' } },
                            { text: '去查看', style: { color: '#FC612A' }, onPress: () => { goPage(`/submitOrderOk?tableId=${this.state.tableId}&origin=check`) }, },
                        ])
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        } else {
            this.state.storesId = id
            this.setState({
                storesId: id
            })
        }
        await this.getNewTicket()
        await this.getPageDetail() // 获取店铺信息和商品列表

        this.getShoppingcart()
        this.createWebSocket() // 创建websocket
        if (tem && Constant.data.firstIn) { // 扫菜品码进入 并且是第一次进入
            setTimeout(() => {
                Constant.data.firstIn = false
                this.handleScanCode(tem)
            }, 500)
        }
    }


    // 查看是否获取到新的优惠券
    async getNewTicket() {
        let res = await Axios.get('/ticket/findnearticket', {
            startIndex: 0,
            pageSize: 20
        })
        let data = res.data.items
        if (data.length == 0) return;
        if (JSON.stringify(data) !== Constant.nearticket) {
            Constant.nearticket = JSON.stringify(data)
            this.setState({
                newTicket: data,
                finish: true
            })
            this.refs.autoTick.show()
        }
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

    // 获取桌台名字
    async getTableName(tableId) {
        try {
            let res = await Axios.get(`/table/select/${tableId}`)
            console.log(res)
            this.setState({
                tableName: res.data
            })
        } catch (e) { }
    }



    async getPageDetail() {
        let res = await Axios.get('/goods/list', {
            storesId: this.state.storesId
        })
        document.title = res.data.storesGoodsQueryVo.name
        this.setState({
            goodsTypeList: res.data.categoryVoList,
            storesDetail: res.data.storesGoodsQueryVo,
        })
        this._checkTime(res.data.storesGoodsQueryVo)
    }

    // 调起扫码
    addCartByScan() {
        postMessage('scan', 'cartScan')
        onMessage('cartScan', data => {
            var options = parseQueryString(data)
            if (options.storesId && options.storesId == this.state.storesId) {
                if (options.tem) {
                    this.handleScanCode(options.tem)
                } else {
                    alert('提示', '无效码')
                }
            } else {
                alert('提示', '无效码')
            }
        })
    }


    // 扫菜品码加入购物车
    async handleScanCode(tem) {
        var item = null
        var goodsTypeList = this.state.goodsTypeList
        goodsTypeList.map((x) => {
            if (x.goodsTemplateVoList.length) {
                x.goodsTemplateVoList.map((y) => {
                    if (y.id == tem) {
                        item = y
                    }
                })
            }
            if (x.subCategoryVoList.length > 0) {
                x.subCategoryVoList.map(y => {
                    if (y.goodsTemplateVoList.length > 0) {
                        y.goodsTemplateVoList.map((z) => {
                            if (z.id == tem) {
                                item = z
                            }
                        })
                    }
                })
            }
        })

        if (!item) {
            alert('提示', '未查找到改商品')
        } else {
            this.checkSpec(item)
        }
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
                Toast.success('加入成功', 1)
            } catch (e) {
                console.log(e)
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

    // 切换规格
    checkSpecs(item, index, bindex) {
        try {
            if (item.choose || item.grey) return;
            let currentItem = this.state.currentItem
            currentItem.specificationGoodsQueryVoList[bindex].goodsSpecificationVoList.map((x, i) => {
                x.choose = i === index
            })
            let checkedItem = objDeepCopy(currentItem.checked)
            currentItem.goodsVoList.map(goods => {
                let isThisGoods = true;
                goods.goodsSpecificationVoList.map((spec, index) => {
                    if (checkedItem.goodsSpecificationVoList[index].specificationId == item.specificationId) {
                        checkedItem.goodsSpecificationVoList[index].specificationValueId = item.specificationValueId
                    }
                    if (!(spec.specificationId == checkedItem.goodsSpecificationVoList[index].specificationId && spec.specificationValueId == checkedItem.goodsSpecificationVoList[index].specificationValueId)) {
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
        } catch (e) {
            console.log(e)
        }
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

    // 提示用户在购物车中删减商品
    showCancleText() {
        alert('提示', '商品请在购物车中删减', [
            { text: '知道了', style: { color: '#ea5520' } },
        ])
    }

    _watch(item) {
        item.specificationGoodsQueryVoList.map(x => {
            x.goodsSpecificationVoList.map(y => {
                y.choose = false
                item.checked.goodsSpecificationVoList.map(z => {
                    if (y.specificationId == z.specificationId && y.specificationValueId == z.specificationValueId) {
                        y.choose = true
                    }
                })
            })
        })
    }


    _checkTime(shop) {
        let endTime = shop.endTime >= shop.beginTime ? shop.endTime : parseInt(shop.endTime.split(':')[0]) + 24 + ':' + shop.endTime.split(':')[1]
        let nowTime = new Date().Format('hh:mm')
        nowTime = shop.endTime >= shop.beginTime ? nowTime : parseInt(nowTime.split(':')[0]) + 24 + ':' + nowTime.split(':')[1]
        if (nowTime > endTime || nowTime < shop.beginTime) {
            alert('提示', '当前店铺不在营业中', [
                { text: '确定', onPress: () => { goPage('/index') }, style: { color: '#ea5520' } },
            ])
        }
    }

    _watchCount(shoppingCartGoodsVoList) {
        // 删除购物车最后一个时，收起购物车弹框
        if (shoppingCartGoodsVoList.length == 0 && this.state.cartShow) {
            this.refs.cartList.hide()
            this.state.cartShow = false
        }
        let totalPrice = 0,
            totalCount = 0
        let goodsTypeList = this.state.goodsTypeList
        shoppingCartGoodsVoList.map(x => {
            totalPrice = Number(Number(totalPrice) + Number(x.price * x.quantity)).toFixed(2)
            totalCount += x.quantity
            x.totalPrice = Number(x.price * x.quantity).toFixed(2)
        })
        goodsTypeList.map(x => {
            x.subCategoryVoList.map(y => {
                y.goodsTemplateVoList.map(z => {
                    z.num = 0
                    shoppingCartGoodsVoList.map(m => {
                        if (m.goodsDetailVo.goodsTemplateId === z.id) {
                            z.num += parseInt(m.quantity)
                        }
                    })
                })
            })

            x.goodsTemplateVoList.map(z => {
                z.num = 0
                shoppingCartGoodsVoList.map(m => {
                    if (m.goodsDetailVo.goodsTemplateId === z.id) {
                        z.num += parseInt(m.quantity)
                    }
                })
            })

        })
        totalPrice = Number(Number(totalPrice) + Number(this.state.allPackingExpense) + Number(this.state.deliveryExpense)).toFixed(2)
        this.setState({
            goodsTypeList,
            shoppingCartGoodsVoList,
            totalPrice,
            totalCount
        })
    }
    // 去搜索页面
    goSearchPage() {
        let {
            shoppingCartId,
            storesId,
            storesDetail,
            tableName,
            tableId,
            orderType,
        } = this.state

        localStorage.setItem('storesDetail', JSON.stringify(storesDetail))
        let url = `/searchGoods?storesId=${storesId}&shoppingCartId=${shoppingCartId}&tableId=${tableId}&tableName=${tableName}&orderType=${orderType}`
        goPage(url)
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
        let { tabIndex, tableId, tableName, goodsTypeList, storesDetail, imgUrl, zIndex,
            totalPrice, totalCount, currentItem, deliveryExpense, allPackingExpense, startExpense, orderType } = this.state
        return (
            <div className="page-checkGoods">
                <div className='top-box'>
                    <Carousel
                        className='top-swiper'
                        infinite
                        autoplay={true}
                        dotStyle={{ background: '#fff', width: '0.2rem', height: '0.2rem' }}
                        dotActiveStyle={{ background: '#fc612a', width: '0.2rem', height: '0.2rem' }}
                    >
                        {storesDetail.viewPagerVoList.map((val, i) => (
                            <img
                                src={imgUrl + val.imgFileId + '?x-oss-process=image/resize,w_600'}
                                alt="2222"
                                className="banner"
                                key={i}
                            />
                        ))}
                    </Carousel>
                    {tableId ? <div className='text'>您的桌号是{tableName}。</div> : ""}
                </div>
                <div className='pickGoods-box'>
                    <div className="content">
                        <div className="left-box" scroll-y="true">
                            {goodsTypeList.map((item, index) => {
                                return (
                                    <div key={item.id}>{item.subCategoryVoList.length > 0 || item.goodsTemplateVoList.length > 0
                                        ? <div className={['item', index == tabIndex ? 'active' : ''].join(" ")}
                                            onClick={() => {
                                                this.setState({
                                                    tabIndex: index
                                                })
                                            }}
                                        >
                                            {index == tabIndex ? <img src={imgUrl + item.logoFileId + '?w=300'} mode="aspectFit"></img> : ""}
                                            <span className='text-overflow-2'>{item.name}</span>
                                        </div> : ""}</div>
                                )
                            })}
                        </div>
                        <div className="right-box">
                            <div className="content">
                                <div className="search wrap" onClick={() => {
                                    this.goSearchPage()
                                }}>
                                    <div className="search-w">
                                        <SearchBar
                                            style={{ height: '0.7rem', borderRadius: '0.1rem' }}
                                            placeholder="请输入商品名" maxLength={15}
                                            showCancelButton={false}
                                            disabled={true}
                                            clearTextOnFocus={false}
                                        />
                                        <div className="searchNull"></div>
                                    </div>
                                    {orderType ? "" : <div className="scan-code" onClick={(e) => {
                                        e.stopPropagation()
                                        this.addCartByScan()
                                    }}>
                                        <img src={require('common/img/scan_grey.png')}></img>
                                        <span>扫一扫</span>
                                    </div>}
                                </div>
                                <div className="goods-box">
                                    <div>
                                        {goodsTypeList[tabIndex] && goodsTypeList[tabIndex].goodsTemplateVoList.map((item, index) => {
                                            return (
                                                <div className="goods" key={item.id} >
                                                    {goodsTypeList[tabIndex].goodsTemplateVoList.length > 0 ? <div className="left">
                                                        <div style={{ position: 'relative' }}>
                                                            {item.inventory <= 0 ? <div className='no-goods'>商品已售罄</div> : ""}
                                                            <LazyLoad
                                                                overflow={true}
                                                                placeholder={<img alt="" src={require('common/img/bg.jpg')}></img>}
                                                                height="100%"
                                                            >
                                                                <img className="cover" src={imgUrl + item.imgFileId + '?x-oss-process=image/resize,w_300'} mode="aspectFill"></img>
                                                            </LazyLoad>
                                                        </div>
                                                        <div className="goods-info">
                                                            <span className="name text-overflow-2">{item.name}</span>
                                                            <span className="sales">月销{item.sales}</span>
                                                            {item.tags ? <div className="tag"><img src={require('common/img/tag.png')}></img><span>{item.tags}</span></div> : ""}
                                                            <div className="price">￥{item.price}{item.originalPrice ? <span className="old-price">￥{item.originalPrice}</span> : ""}
                                                                <div className="num-btn-box">
                                                                    {item.num ? <img src={require("common/img/reduce.png")} onClick={() => {
                                                                        this.showCancleText()
                                                                    }}></img> : ""}
                                                                    {item.num ? <span className="num">{item.num}</span> : ""}
                                                                    <img src={require(`common/img/${item.inventory > 0 ? 'plus.png' : 'plus2.png'}`)} onClick={() => {
                                                                        this.checkSpec(item)
                                                                    }}></img>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> : ""}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        {goodsTypeList[tabIndex] && goodsTypeList[tabIndex].subCategoryVoList.map((goodsType, typeIndex) => {
                                            return (
                                                <div key={typeIndex}>
                                                    {goodsType.goodsTemplateVoList.length > 0 ? <div className='type-second' key={goodsType.id}>
                                                        <div className='type-title'>{goodsType.name}</div>
                                                        {goodsType.goodsTemplateVoList.map((item, index) => {
                                                            return (
                                                                <div className="goods" key={item.imgFileId}>
                                                                    <div className="left">
                                                                        <div style={{ position: 'relative' }}>
                                                                            {item.inventory <= 0 ? <div className='no-goods'>商品已售罄</div> : ""}
                                                                            <LazyLoad
                                                                                overflow={true}
                                                                                placeholder={<img alt="" src={require('common/img/bg.jpg')}></img>}
                                                                                height="100%"
                                                                            >
                                                                                <img className="cover" src={imgUrl + item.imgFileId + '?x-oss-process=image/resize,w_300'} mode="aspectFill"></img>
                                                                            </LazyLoad>
                                                                        </div>
                                                                        <div className="goods-info">
                                                                            <span className="name text-overflow-2">{item.name}</span>
                                                                            <span className="sales">月销{item.sales}</span>
                                                                            {item.tags ? <div className="tag"><img src={require('common/img/tag.png')}></img><span>{item.tags}</span></div> : ""}
                                                                            <div className="price">￥{item.price}{item.originalPrice ? <span className="old-price">￥{item.originalPrice}</span> : ""}
                                                                                <div className="num-btn-box">
                                                                                    {item.num ? <img src={require("common/img/reduce.png")} onClick={() => {
                                                                                        this.showCancleText()
                                                                                    }}></img> : ""}
                                                                                    {item.num ? <span className="num">{item.num}</span> : ""}
                                                                                    <img src={require(`common/img/${item.inventory > 0 ? 'plus.png' : 'plus2.png'}`)} onClick={() => {
                                                                                        this.checkSpec(item)
                                                                                    }}></img>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div> : ""}
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
                {/* 底部购物车组件 */}
                <FooterCart ref="cart"
                    handleFooterCart={this.handleFooterCart.bind(this)}
                    toSubmitOrder={this.toSubmitOrder.bind(this)}
                    totalCount={totalCount}
                    deliveryExpense={deliveryExpense ? deliveryExpense : 0}
                    startExpense={startExpense ? startExpense : 0}
                    orderType={orderType ? orderType : ''}
                    allPackingExpense={allPackingExpense ? allPackingExpense : 0}
                    zIndex={zIndex}
                    totalPrice={totalPrice}>
                </FooterCart>
                {/* 购物车列表 */}
                <CartList ref="cartList"
                    data={this.state.shoppingCartGoodsVoList}
                    setFootIndex={this.setFootIndex.bind(this)}
                    cartShow={this.cartShow.bind(this)}
                    addCart={this.addCart.bind(this)}
                    reduceCart={this.reduceCart.bind(this)}
                    clearCart={this.clearCart.bind(this)}
                ></CartList>
                {/* 选择规格弹窗 */}
                <Spec ref="spec"
                    currentItem={currentItem}
                    checkSpecs={this.checkSpecs.bind(this)}
                    addCart={this.addCart.bind(this)}></Spec>
                {/* 新获得优惠券弹窗 */}
                <AutoTick ref="autoTick" newTicket={this.state.newTicket} />
            </div>)
    }
}