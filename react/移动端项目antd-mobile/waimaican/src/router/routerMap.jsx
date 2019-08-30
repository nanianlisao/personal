import React from 'react';
import { Route, BrowserRouter, Redirect, Switch, withRouter } from 'react-router-dom';
import Index from 'pages/index/Index';
import ChooseShop from 'pages/index/home/chooseShop/ChooseShop';
import ChooseCanShop from 'pages/index/home/chooseShop/ChooseCanShop';
import ChooseLocation from 'pages/index/home/chooseLocation/ChooseLocation';
import ChangeLocation from 'pages/index/home/chooseLocation/ChangeLocation';

import ShopDetail from 'pages/index/home/chooseShop/shopDetail/ShopDetail';
import MyOrder from 'pages/index/mine/myOrder/MyOrder';
import MyWaimaiOrder from 'pages/index/mine/myOrder/MyWaimaiOrder';

import MyTicket from 'pages/index/mine/myTicket/MyTicket';
import HisTicket from 'pages/index/mine/myTicket/hisTicket/HisTicket';
import TicketDetail from 'pages/index/mine/myTicket/ticketDetail/TicketDetail';
import Notice from 'pages/index/mine/notice/Notice';
import CheckGoods from 'pages/index/home/checkGoods/CheckGoods';
import SearchGoods from 'pages/index/home/checkGoods/searchGoods/SearchGoods';
import SubmitOrder from 'pages/index/home/checkGoods/submitOrder/SubmitOrder';
import WaimaiSubmitOrder from 'pages/index/home/checkGoods/waimaiSubmitOrder/WaimaiSubmitOrder';

import SubmitOrderOk from 'pages/index/home/checkGoods/submitOrderOk/SubmitOrderOk';
import SubmitPay from 'pages/index/home/checkGoods/submitPay/SubmitPay';
import PaySuccess from 'pages/index/home/checkGoods/paySuccess/PaySuccess';


import OrderDetail from 'pages/index/ordering/orderDetail/OrderDetail';
import HisDetail from 'pages/index/mine/myOrder/hisDetail/HisDetail';
import WaimaiOrderDetail from 'pages/index/mine/myOrder/waimaiOrderDetail/WaimaiOrderDetail';


import myEE from 'util/eventEmitter';

class RouteMap extends React.Component {
    componentWillMount() {
        myEE.on('push', this.push.bind(this));
    }

    push(url) {
        this.props.history.push(url);
    }

    componentDidMount() { // 监听url变化
        // this.props.history.listen((e) => {
        //     if(window.env=='ali'){
        //         window.my.postMessage({
        //             type: 'url',
        //             val: e.pathname + e.search
        //         })  
        //     }else if(window.env=='wx'){
        //         window.ws.send(JSON.stringify({
        //             type: '1',
        //             token: localStorage.getItem('token'),
        //             data: {
        //                 type: 'url',
        //                 val: e.pathname + e.search,
        //             }
        //         }))
        //     }
            
        // })
    }

    render() {
        return (
            // <BrowserRouter>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/index" replace />} />
                    <Route path="/index" component={Index} />
                    <Route path="/chooseShop" component={ChooseShop} exact />
                    <Route path="/chooseLocation" component={ChooseLocation} exact />
                    <Route path="/changeLocation" component={ChangeLocation} exact />
                    <Route path="/chooseCanShop" component={ChooseCanShop} exact />
                    <Route path="/chooseShop/shopDetail" component={ShopDetail} />
                    <Route path="/myOrder" component={MyOrder} />
                    <Route path="/myWaimaiOrder" component={MyWaimaiOrder} />
                    
                    <Route path="/myTicket" component={MyTicket} />
                    <Route path="/ticket/hisTicket" component={HisTicket} />
                    <Route path="/ticket/ticketDetail" component={TicketDetail} />
                    <Route path="/notice" component={Notice} />
                    <Route path="/checkGoods" component={CheckGoods} />
                    <Route path="/searchGoods" component={SearchGoods} />
                    <Route path="/submitOrder" component={SubmitOrder} />
                    <Route path="/waimaiSubmitOrder" component={WaimaiSubmitOrder} />
                    
                    <Route path="/submitOrderOk" component={SubmitOrderOk} />
                    <Route path="/submitPay" component={SubmitPay} />
                    <Route path="/paySuccess" component={PaySuccess} />
                    <Route path="/orderDetail" component={OrderDetail} />
                    <Route path="/waimaiOrderDetail" component={WaimaiOrderDetail} />


                    
                    <Route path="/hisDetail" component={HisDetail} />
                    {/* <Route path="/login" component={Login} /> */}
                    {/* <Route path="*" component={NotFound} /> */}
                </Switch>
            // </BrowserRouter>
        )
    }
}
export default withRouter(RouteMap)

