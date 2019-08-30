import React from 'react'
import { goPage, postMessage, parseQueryString } from 'util/util'
import './ShopDetail.css'
import Map from "components/map/MapComponent";
import Constant from 'util/Constant'

export default class ShopDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shop: {},
            orderType:''
        }
    }
    componentWillMount() {
        document.title = '门店详情'
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        let shop = JSON.parse(decodeURIComponent(options.shopItem))
        this.setState({
            shop: shop,
            orderType: options.orderType ? options.orderType : ''
        })
    }

    // 去选择商品
    toCheckGoods(status, id) {
        if (status == 1) {
            goPage(`/checkGoods/CheckGoods?id=${id}&orderType=${this.state.orderType}`)
        }
    }
    render() {
        let { shop } = this.state
        return (
            <div className="page-shopDetail">
                <Map
                    width='7.5rem'
                    height='7.56rem'
                    position={this.state.shop.lon ? {
                        longitude: this.state.shop.lon,
                        latitude: this.state.shop.lat
                    } : {}}
                />
                <div className='shop-wrapper'>
                    <div className='info-box'>
                        <div className='name-box'>
                            <div className="name text-overflow-1 flex-center-ver">
                                <img className="loca2" src={require("common/img/loca2.png")} mode="aspectFit"></img>
                                <span>{shop.name}</span>
                            </div>
                            <div className='working-flag'>
                                {/* <img src={shop.businessDesc.id==1?require("common/img/tickBg_ac.png"):require("common/img/tickBg.png")} ></img> */}
                                <img src={require(`common/img/${shop.businessDesc.id == 1 ? "tickBg_ac.png" : "tickBg.png"}`)} ></img>
                                <span>{shop.businessDesc.id == 1 ? "营业中" : "歇业中"}</span>
                            </div>
                        </div>
                        <div className='addr-box'>
                            <div className="addr text-overflow-1">{shop.address}</div>
                            {shop.distance ? <div className="distance">{shop.distanceT}</div> : ""}
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="left">
                            <div>营业时间：{shop.beginTime} ~ {shop.endTime}</div>
                            <div>门店电话：{shop.tel}</div>
                        </div>
                        <div className='telphone-box'>
                            <img src={require("common/img/tel2.png")} onClick={() => {
                                postMessage('callphone', shop.tel)
                            }}></img>
                        </div>
                    </div>
                    <div className="confirmOrder {shop.businessDesc.id==1?'':'grey'}" onClick={() => {
                        this.toCheckGoods(shop.businessDesc.id, shop.id)
                    }}>选择商品</div>
                </div>
            </div>
        )
    }
}