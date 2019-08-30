import React from 'react'
import './ChooseShop.css'
import NoToken from 'components/noToken/NoToken'
import ShopList from 'pages/index/home/chooseShop/shopList/ShopList'
import Constant from 'util/Constant'
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
        this.refs.shopList.refreshData()
    }

    render() {
        return (
            <div>
                {this.state.token ? <div>
                    <ShopList
                        showHeader={true}
                        ref="shopList"
                        loadUrl="stores/list/nearby"
                        // loadUrl="stores/list/app"
                        orderType="waimai"
                        json={{
                            addressId: Constant.data.userAddress.id,
                        }}
                        addressId={Constant.data.userAddress.id}
                        offsetTop={0.67}
                    />
                </div> : <NoToken callback={this.loadShopList.bind(this)} />}
            </div>
        )
    }
}