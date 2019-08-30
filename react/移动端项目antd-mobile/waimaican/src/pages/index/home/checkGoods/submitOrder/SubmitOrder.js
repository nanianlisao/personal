import React from 'react'
import { Modal, InputItem, Toast, List } from 'antd-mobile';
import { Axios, goPage, checkPhone, postMessage, onMessage, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
import './SubmitOrder.css'
const alert = Modal.alert;
export default class SubmitOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            trueP: true,
            setCode: '',
            storesId: '', // 店铺id
            timing: '',
            phone: Constant.user_id.phone ? Constant.user_id.phone : "",
            shoppingCartId: '', // 购物车id
            totalPrice: 0,
            totalCount: 0,
            shoppingCartGoodsVoList: [],
        }
    }
    componentWillMount() {
        document.title = '提交订单'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
     
        var { shoppingCartId, storesId, tableName, tableId } = options
        let shoppingCartGoodsVoList = localStorage.getItem('shoppingCartGoodsVoList')
        this.setState({
            shoppingCartId,
            storesId,
            shoppingCartGoodsVoList: JSON.parse(shoppingCartGoodsVoList),
            tableName,
            tableId
        }, () => {
            this._watchCount(JSON.parse(shoppingCartGoodsVoList))
            this.createWebSocket() // 创建websocket
        })
    }
    componentWillUnmount() {
        this.ws.close()
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
            console.log("close");
            clearInterval(this.socketTimer)
        }
        this.ws.onmessage = (res) => {
            let data = JSON.parse(res.data)
            this._watchCount(data.shoppingCartGoodsVoList)
        }
    }

    // 加入购物车
    async addCart(goodsId, state) {
        if (state == 2) return;
        try {
            let res = await Axios.post('/shoppingcart/add', {
                goodsId: goodsId,
                shoppingCartId: this.state.shoppingCartId,
                tableId: this.state.tableId,
                storesId: this.state.storesId,
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
        })
    }

    _watchCount(shoppingCartGoodsVoList) {
        let totalPrice = 0,
            totalCount = 0
        shoppingCartGoodsVoList.map(x => {
            totalPrice = Number(Number(totalPrice) + Number(x.price * x.quantity)).toFixed(2)
            totalCount += x.quantity
            x.totalPrice = Number(x.price * x.quantity).toFixed(2)
        })
        this.setState({
            shoppingCartGoodsVoList,
            totalPrice,
            totalCount
        })
    }

    // 创建订单
    async goOrderSubmitOk() {
        try {
            if (this.state.timer) {
                return
            }
            this.state.timer = true
            let {
                setCode,
                phone,
                message,
                shoppingCartId,
                storesId,
                tableId,
                trueP
            } = this.state
            if (!checkPhone(phone)) {
                alert('请输入手机号码', '您还没有输入手机号码哦', [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
                this.state.timer = false
                return
            }
            if (!trueP && !setCode) {
                alert('提示', '请输入手机验证码', [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
                this.state.timer = false
                return
            }
            let res = await Axios.post('/order/create', {
                "code": setCode,
                "phone": phone,
                "remark": message,
                "shoppingCartId": shoppingCartId,
                "storesId": storesId,
                "tableId": tableId,
            })
            console.log(res)
            Toast.success('提交成功')
            Constant.user_id.phone = phone

            this.state.timer = false
            setTimeout(() => {
                goPage(`/submitOrderOk?orderId=${res.data.id}&tableId=${tableId}`)
            }, 1000)
        } catch (e) {
            console.log(e)
            if (e.res) {
                if (e.res.retCode == 12289 || e.res.retCode == 12290 || e.res.retCode == 12291) {
                    alert('提示', e.res.retMsg, [
                        {
                            text: '确定', style: { color: '#EA5520' }, onPress: () => {
                                this.props.history.goBack()
                            }
                        },
                    ])
                }
            }
        }
        this.state.timer = false
    }

    async bindTiming() {
        if (this.state.timing) return;
        clearInterval(this.timers)
        let res = await Axios.post('/sms/send', {
            appId: Constant.data.app_id,
            content: `您的验证码是#code，有效期5分钟。如非本人操作，请忽略。`,
            telephone: this.state.phone,
            num: 5
        }, false, Constant.getResourUrl())
        console.log(res)
        var timing = 60
        this.timers = setInterval(() => {
            timing--
            this.setState({
                timing: timing
            })
            if (timing <= 0) {
                clearInterval(this.timers)
            }
        }, 1000)
    }

    // 绑定桌码
    scanCode() {
        postMessage('scan', 'homeScan');
        onMessage("homeScan", async (data) => {
            try {
                data = data.split('=')[1]
                // path = 'pages/index/index?scene=86,28'
                if (data.split(',')[0] == this.state.storesId && data.split(',')[1]) {
                    let tableId = data.split(',')[1]
                    this.setState({
                        tableId: tableId
                    })
                    let res2 = await Axios.get(`table/select/${tableId}`)
                    console.log(res2)
                    this.setState({
                        tableName: res2.data,
                    })
                } else {
                    alert('提示', '无效码', [
                        { text: '确定', style: { color: '#EA5520' } },
                    ])
                }
            } catch (e) {
                alert('提示', '无效码', [
                    { text: '确定', style: { color: '#EA5520' } },
                ])
            }
        })
    }

    // 一键获取
    getPhoneNumber() {
        postMessage('phone', 'phone');
        onMessage("phone", async (data) => {
            this.setState({
                phone: data
            })
        }, false)
    }
    render() {
        let { trueP, setCode, tableId, tableName, shoppingCartGoodsVoList, totalPrice, totalCount, phone, timing } = this.state
        return (
            <div className="page-submitOrder">
                <div className='content'>
                    <div className='desk-code-wrap little-box flex-middle'>
                        <div className='desk-code-info'>
                            <span>我的桌牌号：</span>
                            <span className='desk-code'>{tableId ? decodeURI(tableName) : '暂未添加桌牌，请扫码绑定'}</span>
                        </div>
                        <div className='scan' onClick={() => {
                            this.scanCode()
                        }}>
                            <img src={require('common/img/scan.png')}></img>
                        </div>
                    </div>
                    <div className='getPhone little-box flex-center-ver' style={{ paddingRight: 0 }}>
                        <span className='val'><span className='require'>*</span>手机号:</span>
                        <List>
                            <InputItem className="input" type="number" value={phone} maxLength={11} onChange={(e) => {
                                var trueP = true
                                if (e && Constant.user_id.phone != e) {
                                    trueP = false
                                }
                                this.setState({
                                    phone: e,
                                    trueP: trueP
                                })
                            }}></InputItem>
                        </List>
                        {!trueP && phone ? <div className={['get-verify', timing ? "timing" : ""].join(" ")} onClick={() => {
                            this.bindTiming()
                        }}>{timing ? timing + '`' : '获取验证码'}</div> : ""}
                        {!phone ? <div className="get-verify" onClick={() => {
                            this.getPhoneNumber()
                        }}>
                            <span>一键获取</span>
                        </div> : ""}
                    </div>
                    {!trueP ? <div className='getCode-wrap little-box flex-center-ver'>
                        <span className='val'><span className='require'>*</span>验证码:</span>
                        <InputItem className="input" type="number" maxLength={8} onChange={(e) => {
                            this.setState({
                                setCode: e,
                            })
                        }}></InputItem>
                    </div> : ""}
                    <div className='order-wrap little-box'>
                        <div className='order-title'>订单详情：</div>
                        <div className='order-info'>
                            {shoppingCartGoodsVoList.map((item, index) => {
                                return (
                                    <div className='order-info-people' key={index}>
                                        <div className='people-avatar'>
                                            <img src={item.avatarUrl} mode='aspectFill'></img>
                                        </div>
                                        <div className='goods-list'>
                                            <div className='goods-item'>
                                                <div className='goods-info'>
                                                    <span className='goods-detail'>{item.goodsDetailVo.goodsTemplateName}</span>
                                                    <span className='sku'>
                                                        {item.goodsDetailVo.goodsSpecificationDetailVoList.map((litem) => (<span key={litem.specificationValueId}>{litem.specificationValueName}</span>))}</span>
                                                </div>
                                                <div className='goods-footer flex-middle'>
                                                    <div className='goods-price'>￥ {item.totalPrice}</div>
                                                    <div className='goods-move flex-middle'>
                                                        <img src={require("common/img/reduce.png")} onClick={() => {
                                                            this.reduceCart(item.goodsId)
                                                        }}></img>
                                                        <span className="num">{item.quantity}</span>
                                                        <img src={require("common/img/plus.png")} onClick={() => {
                                                            this.addCart(item.goodsId, item.state)
                                                        }}></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='order-footer'>共{totalCount}件商品</div>
                    </div>
                    <div className='remark little-box flex-middle'>
                        <span>备注:</span>
                        <InputItem className="input" onChange={(e) => {
                            this.setState({
                                message: e
                            })
                        }}></InputItem>
                    </div>
                </div>
                <div className='footer flex-middle'>
                    <div className='all-price'>
                        <span>合计金额</span>
                        <span className='price-count'>￥ {totalPrice}</span>
                    </div>
                    <div className='submit-order' onClick={() => {
                        this.goOrderSubmitOk()
                    }}>去下单</div>
                </div>
            </div>
        )
    }
}