import React from 'react'
import './Home.css'
import { Carousel } from 'antd-mobile';
import { Axios, goPage, goCheckGoodsByScan,delayFn } from 'util/util'
import Constant from 'util/Constant'
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            bannerList: [],
            themePic: {}
        };
    }
    componentWillMount() {
        document.title = '首页'
        delayFn(this.getBannerList.bind(this),Constant.data,'app_id')
    }


    async getBannerList() {
        let res = await Axios.get('viewPager/list/app', {
            type: 1, //  1:主题，2:首页轮播图
            appId: Constant.data.app_id
        })
        this.setState({
            themePic: res.data.items[0]
        })
        let res2 = await Axios.get('viewPager/list/app', {
            type: 2, //  1:主题，2:首页轮播图
            appId: Constant.data.app_id
        })
        this.setState({
            bannerList: res2.data.items
        })
    }
    // 自主点餐
    toCheckShop() {
        goPage('/chooseShop');
    }
    // 扫码点餐
    goCheckGoods() {
        goCheckGoodsByScan()
    }
    render() {
        return (
            <div className="page-home">
                {/* <WingBlank> */}
                <div style={{ height: '4.3rem' }}>
                    <Carousel
                        className='my-swiper'
                        autoplay={true}
                        dotStyle={{ background: '#fff', width: '0.2rem', height: '0.2rem' }}
                        dotActiveStyle={{ background: '#fc612a', width: '0.2rem', height: '0.2rem' }}
                        infinite
                    // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    // afterChange={index => console.log('slide to', index)}
                    >
                        {this.state.bannerList.map((val, i) => (
                            <img
                                src={this.state.imgUrl + val.imgFileId + '?x-oss-process=image/resize,w_600'}
                                alt=""
                                className="banner"
                                key={i}
                            />
                        ))}
                    </Carousel>
                </div>
                {/* </WingBlank> */}
                <div className='checkshop-wrapper flex-center-ver'>
                    <div className='checkshop scan-shop flex-center-ver' onClick={this.goCheckGoods.bind(this)}>
                        <img alt="" src={require('common/img/scanCode.png')}></img>
                        <span>扫码点餐</span>
                    </div>
                    <div className='checkshop scan-shop flex-center-ver' onClick={this.toCheckShop.bind(this)}>
                        <img alt="" src={require('common/img/orderShop.png')}></img>
                        <span>预约点餐</span>
                    </div>
                    <div className='checkshop order-shop flex-center-ver' onClick={()=>{
                        goPage('/chooseLocation')
                    }}>
                        <img alt="" src={require('common/img/waimai.png')}></img>
                        <span>外卖送餐</span>
                    </div>
                </div>
                <div className="ad">
                    {this.state.themePic ? <img alt="" src={this.state.imgUrl + this.state.themePic.imgFileId + '?w=650'} mode="aspectFill"></img> : ""}
                </div>
            </div>
        )
    }
}
export default Home