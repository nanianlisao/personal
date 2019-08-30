import React, { Suspense, lazy } from 'react'
import { Switch, Route } from 'react-router'
import myEE from '../utils/eventEmitter'
import { withRouter } from 'react-router-dom'

const Login = lazy(() => import('../pages/login/Login'))
const Main = lazy(() => import('../pages/tabs/Main'))

const Panel = lazy(() => import('../pages/tabs/panel/Panel'))

const ImgList = lazy(() => import('../pages/tabs/img/ImgList'))
const Active = lazy(() => import('../pages/tabs/img/Active'))
const Advert = lazy(() => import('../pages/tabs/img/Advert'))

const Floor = lazy(() => import('../pages/tabs/shop/Floor'))
const Type = lazy(() => import('../pages/tabs/shop/Type'))
const ShopList = lazy(() => import('../pages/tabs/shop/ShopList'))

const OrderList = lazy(() => import('../pages/tabs/order/OrderList'))

const TicketAdd = lazy(() => import('../pages/tabs/ticket/TicketAdd'))
const TicketList = lazy(() => import('../pages/tabs/ticket/TicketList'))

const User = lazy(() => import('../pages/tabs/app/User'))
const Qrcode = lazy(() => import('../pages/tabs/app/Qrcode'))

export interface IRouteMapProps {
    [propName: string]: any
}
class RouteMap extends React.Component<IRouteMapProps> {
    constructor(props: IRouteMapProps) {
        super(props)
        this.state = {
        }
    }
    public componentDidMount() {
        myEE.on('push', this.push.bind(this))
    }

    push(url: string) {
        this.props.history.push(url)
    }


    public render() {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/main" render={() => <Main />} />
                    <Route component={Login} />
                </Switch>
            </Suspense>
        )
    }
}

export const Router2 = () => (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route path="/main/panel/Panel" component={Panel} />

                <Route path="/main/img/imgList" component={ImgList} />
                <Route path="/main/img/active" component={Active} />
                <Route path="/main/img/advert" component={Advert} />

                <Route path="/main/shop/shopList" component={ShopList} />
                <Route path="/main/shop/floor" component={Floor} />
                <Route path="/main/shop/type" component={Type} />

                <Route path="/main/order/orderList" component={OrderList} />

                <Route path="/main/ticket/ticketAdd" component={TicketAdd} />
                <Route path="/main/ticket/ticketList" component={TicketList} />

                <Route path="/main/app/user" component={User} />
                <Route path="/main/app/qrcode" component={Qrcode} />

            </Switch>
        </Suspense>

    </div>
)

export default withRouter(RouteMap as any)

