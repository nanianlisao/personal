import React, { Suspense, lazy } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import myEE from 'util/eventEmitter';
import { Axios } from 'util/util'
import Constant from 'util/Constant'
import { Modal } from 'antd-mobile';


const Index = lazy(() => import('pages/index/Index'));
const ThemeDetail = lazy(() => import('pages/index/home/themeDetail/ThemeDetail'));
const AddTicket = lazy(() => import('pages/index/home/addTicket/AddTicket'));
const Search = lazy(() => import('pages/index/home/search/Search'));
const Shop = lazy(() => import('pages/index/home/shop/Shop'));
const BannerDetail = lazy(() => import('pages/index/home/bannerDetail/BannerDetail'));
const Category = lazy(() => import('pages/index/home/category/Category'));
const CategoryDetail = lazy(() => import('pages/index/home/category/categoryDetail/CategoryDetail'));
const Assemble = lazy(() => import('pages/index/home/assemble/Assemble'));
const AssembleList = lazy(() => import('pages/index/home/assemble/assembleList/AssembleList'));



const GoodsDetail = lazy(() => import('pages/index/home/goodsDetail/GoodsDetail'));
const Share = lazy(() => import('pages/index/home/goodsDetail/share/Share'));

const Comment = lazy(() => import('pages/index/home/goodsDetail/comment/Comment'));
const ConfirmOrder = lazy(() => import('pages/index/home/goodsDetail/confirmOrder/ConfirmOrder'));
const PaySuccess = lazy(() => import('pages/index/home/goodsDetail/paySuccess/PaySuccess'));
const Extend = lazy(() => import('pages/index/mine/extend/Extend'));
const Ticket = lazy(() => import('pages/index/mine/ticket/Ticket'));
const Order = lazy(() => import('pages/index/mine/order/Order'));
const OrderDetail = lazy(() => import('pages/index/mine/order/orderDetail/OrderDetail'));
const Evaluate = lazy(() => import('pages/index/mine/order/evaluate/Evaluate'));
const Refund = lazy(() => import('pages/index/mine/order/refund/Refund'));



const alert = Modal.alert
const Routers = [{
    path: '/home/themeDetail',
    name: '专题详情',
    component: ThemeDetail
}, {
    path: '/home/bannerDetail',
    name: '轮播图详情',
    component: BannerDetail
}, {
    path: '/home/addTicket',
    name: '领取优惠券',
    component: AddTicket
}, {
    path: '/home/search',
    name: '搜索',
    component: Search
}, {
    path: '/home/shop',
    name: '店铺列表',
    component: Shop
}, {
    path: '/home/category',
    name: '全部分类',
    component: Category
}, {
    path: '/home/categoryDetail',
    name: '商品列表',
    component: CategoryDetail

}, {
    path: '/home/pintuan',
    name: '拼团',
    component: Assemble
}, {
    path: '/home/AssembleList',
    name: '拼团列表',
    component: AssembleList

}, {
    path: '/home/goodsDetail',
    name: '商品详情',
    component: GoodsDetail
}, {
    path: '/home/goodsDetail/share',
    name: '分享',
    component: Share
}, {
    path: '/home/goodsDetail/comment',
    name: '商品评论',
    component: Comment
}, {
    path: '/home/goodsDetail/confirmOrder',
    name: '提交订单',
    component: ConfirmOrder
}, {
    path: '/home/goodsDetail/paySuccess',
    name: '支付成功',
    component: PaySuccess
}, {
    path: '/mine/extend',
    name: '我的推广',
    component: Extend
}, {
    path: '/mine/ticket',
    name: '我的优惠券',
    component: Ticket
}, {
    path: '/mine/order',
    name: '我的订单',
    component: Order
}, {
    path: '/mine/orderDetail/:id',
    name: '订单详情',
    component: OrderDetail
}, {
    path: '/mine/order/refund',
    name: '申请退款',
    component: Refund
}, {
    path: '/mine/order/evaluate',
    name: '评价',
    component: Evaluate
}]



class RouteMap extends React.Component {
    componentWillMount() {
        myEE.on('push', this.push.bind(this));
        myEE.on('goBack', this.goBack.bind(this));
    }

    async push(url) {
        this.props.history.push(url);
    }

    async goBack(url) {
        this.props.history.goBack();
    }

    getMemberDetail() {
        if (localStorage.getItem('token')) {
            if (Constant.data.timerss && Date.now() - Constant.data.timerss <= 60 * 1000) {  // 更新数据
                console.log('直接返回缓存数据')
                return Constant.data.memberDetail
            } else {
                console.log('数据超时了，重新发起请求')
                return Axios.get('/member/final/level').then((res) => {
                    Constant.data.timerss = Date.now()
                    Constant.data.memberDetail = res.data
                    return res.data
                })
            }
        } else {
            return {}
        }
    }

    componentDidMount() { // 监听url变化
        this.props.history.listen(({ pathname }) => {
            let currentRouter = Routers.find(x => x.path === pathname)
            if (currentRouter) {
                document.title = currentRouter.name
            }
        })
    }

    render() {
        return (
            <Suspense fallback={<div className="root-loading"><img src={require('common/img/loading.gif')} alt="" /> <span>页面加载中，请稍后</span></div>}>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/index" replace />} />
                    <Route path="/index" render={() => <Index />} />
                    {Routers.map((item, i) => (
                        <Route path={item.path} render={() => <item.component />} exact key={i} />
                    ))}
                    <Route render={() => <Index />} />
                </Switch>
            </Suspense>
        )
    }
}
export default withRouter(RouteMap)

