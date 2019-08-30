import React, { Suspense, lazy } from 'react'
import { Switch, Route } from 'react-router'
import myEE from '../utils/eventEmitter';
import { withRouter } from 'react-router-dom';

const Login = lazy(() => import('../pages/login/Login'))
const Main = lazy(() => import('../pages/tabs/Main'))

const Start = lazy(() => import('../pages/tabs/img/Start'))
const Banner = lazy(() => import('../pages/tabs/img/Banner'))
const Advert = lazy(() => import('../pages/tabs/img/Advert'))

const Brand = lazy(() => import('../pages/tabs/news/Brand'));
const Meeting = lazy(() => import('../pages/tabs/news/Meeting'));

const Activity = lazy(() => import('../pages/tabs/sign/Activity'));
const SignList = lazy(() => import('../pages/tabs/sign/List'));
const Record = lazy(() => import('../pages/tabs/sign/Record'));

const OrderList = lazy(() => import('../pages/tabs/order/OrderList'));

const User = lazy(() => import('../pages/tabs/scope/User'));

const Setting = lazy(() => import('../pages/tabs/app/Setting'));
const Qrcode = lazy(() => import('../pages/tabs/app/Qrcode'));

export interface IRouteMapProps {
    [propName: string]: any
}

class RouteMap extends React.Component<IRouteMapProps> {
    constructor(props: IRouteMapProps) {
        super(props);
        this.state = {
        }
    }
    public componentDidMount() {
        // 添加一个push事件监听，通过事件EventEmitter控制页面跳转
        myEE.on('push', this.push.bind(this));
    }

    // 跳转url 可以在此处通过url做一些判断，限制用户是否进行跳转登
    push(url: string) {
        this.props.history.push(url);
    }


    public render() {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path="/" exact={true} component={Login} />
                    <Route path="/login" component={Login} />
                    <Route path="/main" render={() => <Main />} />
                </Switch>
            </Suspense>
        )
    }
}

// 二级路由，登录成功后 在Main中引入
export const Router2 = () => (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route path="/main/img/start" component={Start} />
                <Route path="/main/img/banner" component={Banner} />
                <Route path="/main/img/advert" component={Advert} />

                <Route path="/main/news/brand" render={() => <Brand />} />
                <Route path="/main/news/meeting" render={() => <Meeting />} />

                <Route path="/main/sign/activity" render={() => <Activity />} />
                <Route path="/main/sign/list" render={() => <SignList />} />
                <Route path="/main/sign/record" render={() => <Record />} />

                <Route path="/main/order/list" render={() => <OrderList />} />

                <Route path="/main/scope/user" render={() => <User />} />

                <Route path="/main/app/setting" render={() => <Setting />} />
                <Route path="/main/app/qrcode" render={() => <Qrcode />} />
            </Switch>
        </Suspense>

    </div>
)

export default withRouter(RouteMap as any)

