import React from 'react'
import { Carousel, Toast, Modal } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import FooterShow from 'common/footerShow/FooterShow'
import './GoodsDetail.less'
import { goPage, Axios, parseQueryString, objDeepCopy, postMessage } from 'util/util'
import Constant from 'util/Constant'
const alert = Modal.alert
class GoodsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            goodsDetail: {
                checked: {},
                bannerList: []
            },
            specStr: '', // 已选择规格名字
            modalType: '',
            goodsNum: 1,
        }
    }
    componentWillMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.getGoodsDetail(options.id)
    }

    // 查询商品详情
    async getGoodsDetail(id) {
        let res = await Axios.get(`/goodsTemplate/detail/${id}`)
        res.data.bannerList = res.data.bannerFileId ? res.data.bannerFileId.split(',') : []
        let checkArr = res.data.goodsVoList.find(x => x.acquiescent == 1)
        console.log(res)
        res.data.checked = checkArr ? checkArr : res.data.goodsVoList[0]
        this._watch(res.data)
        this.getSpecStr(res.data)
        this.setState({
            goodsDetail: res.data
        })
    }

    // 遍历生成默认规格
    _watch(item) {
        if (item.specificationGoodsQueryVoList) {
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
    }

    // 切换单个规格
    checkSpecs(item, index, bindex) {
        if (item.choose || item.grey) return;
        let goodsDetail = this.state.goodsDetail
        goodsDetail.specificationGoodsQueryVoList[bindex].goodsSpecificationVoList.map((x, i) => {
            x.choose = i === index
        })
        let checkedItem = objDeepCopy(goodsDetail.checked)
        goodsDetail.goodsVoList.map(goods => {
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
        goodsDetail.checked = item
        this.setState({
            goodsDetail
        })
        this.getSpecStr(goodsDetail)
        // this._watchGrey()
    }

    // 计算已选规格的字符串
    getSpecStr(item) {
        console.log(item.checked)
        let goodsSpecificationDetailVoList = item.checked.goodsSpecificationDetailVoList
        let specStr = ''
        goodsSpecificationDetailVoList.map(x => {
            specStr = `${specStr}"${x.specificationValueName}" `
        })
        this.setState({
            specStr: specStr
        })
    }



    cartShow = (method) => {
        // if (this.state.goodsDetail.checked.inventory <= 0) {
        //     Toast.fail('库存不足', 1)
        //     return
        // }
        this.setState({
            modalType: method,
            goodsNum: 1
        })
        this.refs.cartModal.show()
    }

    cartHide = () => {
        console.log('hide')
        this.refs.cartModal.hide()
    }

    // 去购买
    addBuy() {
        console.log('去购买')
        if (this.state.goodsDetail.checked.inventory <= 0) {
            Toast.fail('库存不足', 1)
            return
        }
        let { goodsDetail, goodsNum, specStr } = this.state
        let totalPrice = (goodsDetail.checked.price * goodsNum).toFixed(2)
        let obj = {
            quantity: goodsNum,
            price: goodsDetail.checked.price,
            // price: goodsDetail.price,
            imgFileId: goodsDetail.imgFileId,
            name: goodsDetail.name,
            goodsId: goodsDetail.checked.id,
            specStr: specStr,

        }

        goPage(`/home/goodsDetail/confirmOrder?obj=${encodeURIComponent(JSON.stringify(obj))}&totalPrice=${totalPrice}`)
    }

    // 加入购物车
    async addCart() {
        if (this.state.goodsDetail.checked.inventory <= 0) {
            Toast.fail('库存不足', 1)
            return
        }
        let { goodsDetail } = this.state
        try {
            let res = await Axios.post('/shoppingcart/save', {
                goodsId: goodsDetail.checked.id,
                quantity: this.state.goodsNum,
                storesId: Constant.data.storesId
            })
            Toast.success('加入成功', 1)
            this.cartHide()
        } catch (e) {
            alert('提示', e.res.retMsg, [
                { text: '确定' },
            ])
        }

    }

    // 联系客服
    async callServiceTel() {
        if (!Constant.data.serviceTel) {
            let res = await Axios.get('/appService/find')
            console.log(res)
            Constant.data.serviceTel = res.data.serviceTel
        }
        postMessage('callphone', Constant.data.serviceTel)
    }


    render() {
        let { imgUrl, goodsDetail, specStr, modalType, goodsNum } = this.state
        return (
            <main className="page-goodsDetail"
                // style={{
                //     height: document.documentElement.clientHeight
                // }}
            >
                <section className="swiper">
                    <Carousel
                        className='top-swiper'
                        infinite
                        autoplay={true}
                    >
                        {goodsDetail.bannerList.map((val, i) => (
                            <img
                                src={imgUrl + val}
                                alt=""
                                className="banner"
                                key={i}
                            />
                        ))}
                    </Carousel>
                </section>
                <section className="content-item content-top">
                    <div className="flex-between">
                        <div className="header-left">
                            <div className="price">¥{goodsDetail.price}</div>
                            <div className="virtual-price">原价 <span>¥{goodsDetail.originalPrice}</span></div>
                        </div>
                        <div className="share-btn flex-center" onClick={() => {
                            this.refs.shareModal.show()
                        }}>
                            <img src={require('common/img/share_black.png')} alt="" />
                            <span>分享</span>
                        </div>
                    </div>
                    <div className="goods-name">{goodsDetail.name}</div>
                </section>
                <section className="content-center">
                    <div className="center-top">
                        <div className="flex-between">
                            <div>发货<span className="val">到店自提</span></div>
                            <div className="picks">已售{goodsDetail.sales}</div>
                        </div>
                        <div className="flex-between" onClick={this.cartShow.bind(this, '')}>
                            <div>已选<span className="val">{specStr ? specStr : '未选择'}</span></div>
                            <div className="flex-between picks"><span>规格选择</span><img src={require('common/img/arrowRGS.png')} alt="" /></div>
                        </div>
                    </div>
                    <div className="goods-comment flex-between" onClick={() => {
                        goPage(`/home/goodsDetail/comment?id=${goodsDetail.id}`)
                    }}>
                        <div>商品评价（{goodsDetail.goodsCommentCount}）</div>
                        <div className="flex-between picks"><span>查看全部</span><img src={require('common/img/arrowRAS.png')} alt="" /></div>
                    </div>
                </section>
                <section className="goods-des">
                    <div className="title">商品详情</div>
                    <div className="des" dangerouslySetInnerHTML={{ __html: goodsDetail.text }}></div>
                </section>
                <footer className="footer-wrap">
                    <div className="footer footer-detail flex-center">
                        <div className="little-btn flex-middle" onClick={() => {
                            localStorage.setItem('selectedTab', 'home')
                            goPage('/index')
                        }}>
                            <img src={require('common/img/footer_1.png')} alt="" />
                        </div>
                        <div className="little-btn flex-middle" onClick={() => {
                            this.callServiceTel()
                        }}>
                            <img src={require('common/img/footer_2.png')} alt="" />
                        </div>
                        <div className="little-btn flex-middle" onClick={() => {
                            localStorage.setItem('selectedTab', 'cart')
                            goPage('/index')
                        }}>
                            <img src={require('common/img/footer_3.png')} alt="" />
                        </div>
                        <div className="mid-btn add-cart" onClick={this.cartShow.bind(this, 'cart')}>加入购物车</div>
                        <div className="mid-btn add-buy" onClick={this.cartShow.bind(this, 'buy')}>立即购买</div>
                    </div>
                </footer>
                <FooterShow ref="cartModal" height={11}>
                    <div className="cart-modal">
                        <div className="close-btn" onClick={() => {
                            this.refs.cartModal.hide()
                        }}><img src={require('common/img/cancel.png')} alt="" /></div>
                        <div className="top flex-between">
                            <div className="poster"><img src={imgUrl + goodsDetail.imgFileId} alt="" /></div>
                            <div className="top-info">
                                <div className="price">￥{goodsDetail.checked.price}</div>
                                <div className="remark-g">库存 {goodsDetail.checked.inventory}件</div>
                                <div className="remark-b">已选 {specStr}</div>
                            </div>
                        </div>
                        <div className="spec-list">
                            {goodsDetail.specificationGoodsQueryVoList && goodsDetail.specificationGoodsQueryVoList.map((x, i) => (
                                <div className="spec-item" key={i}>
                                    <div className="title">{x.name}</div>
                                    <div className="spec-val-list flex-center">
                                        {x.goodsSpecificationVoList && x.goodsSpecificationVoList.map((y, index) => (
                                            <div className={["spec-val-item", y.choose ? 'act' : ''].join(' ')} key={index} onClick={() => {
                                                this.checkSpecs(y, index, i)
                                            }}>{y.specificationValueName}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="check-num flex-between">
                            <div className="title">购买数量</div>
                            <div className="title flex-middle">
                                <img src={require('common/img/reduce_btn.png')} alt="" onClick={() => {
                                    this.setState((preState) => {
                                        if (preState.goodsNum > 1) {
                                            return ({
                                                goodsNum: preState.goodsNum - 1
                                            })
                                        }
                                    })
                                }} />
                                <span>{goodsNum}</span>
                                <img src={require('common/img/plus_btn.png')} alt="" onClick={() => {
                                    this.setState((preState) => ({
                                        goodsNum: preState.goodsNum + 1
                                    }))
                                }} />
                            </div>
                        </div>
                        <div className="footer-wrap model-footer">
                            {!modalType ? <div className="footer flex-between">
                                <div className="footer-btn add-cart" onClick={() => {
                                    this.addCart()
                                }}>加入购物车</div>
                                <div className="footer-btn add-buy" onClick={() => {
                                    this.addBuy()
                                }}>立即购买</div>
                            </div> : <div className="footer">
                                    <div className="footer-btn" onClick={() => {
                                        if (modalType === 'cart') {
                                            this.addCart()
                                        } else if (modalType === 'buy') {
                                            this.addBuy()
                                        }
                                    }}>确认</div>
                                </div>}
                        </div>
                    </div>
                </FooterShow>
                <FooterShow ref="shareModal">
                    <div className="share-modal">
                        <div className="header flex-between">
                            <span className="title">分享</span>
                            <div className="imgCtn" onClick={() => {
                                this.refs.shareModal.hide()
                            }}><img src={require('common/img/cancel.png')} alt="" /></div>
                        </div>
                        <div className="content flex-middle">
                            <div className="share-item flex-middle" onClick={() => {
                                postMessage('share', {
                                    img: goodsDetail.bannerList[0],
                                    name: goodsDetail.name,
                                    goodsId: goodsDetail.id,
                                    storesId: Constant.data.storesId
                                })
                            }}>
                                <img src={require('common/img/share_friend.png')} alt="" />
                                <span>分享给好友</span>
                            </div>
                            <div className="share-item flex-middle" onClick={() => {
                                let item = { name: goodsDetail.name, img: goodsDetail.bannerList[0] ? goodsDetail.bannerList[0] : '', goodsId: goodsDetail.id }
                                goPage(`/home/goodsDetail/share?item=${encodeURIComponent(JSON.stringify(item))}`)
                            }}>
                                <img src={require('common/img/share_circle.png')} alt="" />
                                <span>生成商城海报</span>
                            </div>
                        </div>
                    </div>
                </FooterShow>
            </main>
        )
    }
}

export default withRouter(GoodsDetail)