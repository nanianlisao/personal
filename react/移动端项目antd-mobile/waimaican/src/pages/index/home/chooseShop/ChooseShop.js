import React from 'react'
import './ChooseShop.css'
import { getLoaction, chooseLocation } from 'util/util'
import { SearchBar } from 'antd-mobile';
import NoToken from 'components/noToken/NoToken'
import ShopList from 'pages/index/home/chooseShop/shopList/ShopList'
export default class ChooseShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopList: [],
            pos: {},
            token: localStorage.getItem('token'),
        };
    }
    componentDidMount() {
        document.title = '选择门店'
        this.loadShopList()
    }

    // 获取门店（5km范围内）
    async loadShopList() {
        await this.refs.shopList.refreshData()
    }
    // 定位附近门店
    async getLoaction() {
        let res = await getLoaction()
        this.setState({
            pos: res
        }, () => {
            this.loadShopList()
        })
    }

    // 选择当前位置
    async chooseLocation() {
        chooseLocation((res) => {
            this.setState({
                pos: res
            }, () => {
                this.loadShopList()
            })
        })
    }



    render() {
        return (
            <div className="page-chooseShop">
                <div className="top">
                    <div className="search" onClick={() => {
                        this.chooseLocation()
                    }}>
                        <SearchBar
                            style={{ height: '0.98rem' }}
                            placeholder="点击选择地址" maxLength={8}
                            disabled={true} />
                        <div className="searchNull"></div>
                    </div>
                    <div className={['loaction', this.state.pos.latitude ? 'active' : ''].join(" ")}
                        onClick={() => {
                            this.getLoaction()
                        }}>
                        <span>定位附近门店</span>
                        {this.state.pos.latitude
                            ? <img alt="" src={require('common/img/loac.png')} mode="aspectFit"></img>
                            : <img alt="" src={require('common/img/loac2.png')} mode="aspectFit"></img>}
                    </div>
                </div>
                <div className="content">
                    <div className='shop-box' style={{
                        display: this.state.token ? 'block' : 'none'
                    }}>
                        <ShopList
                            ref="shopList"
                            loadUrl="stores/list/app"
                            json={{
                                longitude: this.state.pos.longitude,
                                latitude: this.state.pos.latitude,
                            }}
                            latitude={this.state.pos.latitude}
                            offsetTop={2.12}
                            refreshCallBack={() => {
                                this.setState({
                                    token: localStorage.getItem('token')
                                })
                            }}
                        />
                    </div>
                    {this.state.token ? null : <NoToken callback={this.loadShopList.bind(this)} />}
                </div>
            </div>
        )
    }
}