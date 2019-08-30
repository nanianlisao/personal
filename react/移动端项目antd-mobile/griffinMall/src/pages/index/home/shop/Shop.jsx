import React from 'react'
import ShopList from 'components/shopList/ShopList'
import './Shop.less'
import { SearchBar } from 'antd-mobile';
import Map from "common/map/MapComponent";
export default class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shop: {},
            search: '',
            searchName: ''
        }
    }
    componentWillMount() {
        document.title = '门店详情'
    }

    render() {
        let { shop, search } = this.state
        return (
            <div className="page-shopList">
                <section className="search-wrap flex-between">
                    <SearchBar
                        className="search-bar"
                        value={search}
                        onChange={(e) => {
                            this.setState({
                                search: e
                            })
                        }}
                        onSubmit={(e) => {
                            this.setState({
                                showList: true,
                                searchName: search
                            })
                        }}
                        placeholder="搜索你想要去的校区" maxLength={15}
                        showCancelButton={false}
                        clearTextOnFocus={false}
                        cancelText=" "
                    />
                    <div className="search-btn" onClick={() => {
                        this.setState({
                            showList: true,
                            searchName: search
                        })
                    }}>搜索</div>
                </section>
                <section className='map'>
                    <Map
                        width='100%'
                        height='5rem'
                        position={this.state.shop.lon ? {
                            longitude: this.state.shop.lon,
                            latitude: this.state.shop.lat
                        } : {}}
                    />
                </section>
                <section className="shop-list">
                    <ShopList
                        loadUrl='/stores/list/app'
                        json={{
                            name: this.state.searchName
                        }} />
                </section>
            </div >
        )
    }
}