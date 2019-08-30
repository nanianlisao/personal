import React, { Suspense, lazy } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import myEE from 'util/eventEmitter';
import { Axios } from 'util/util'
import Constant from 'util/Constant'
import { Modal } from 'antd-mobile';


const Index = lazy(() => import('pages/index/Index'));

const HomeList = lazy(() => import('pages/index/home/list/HomeList'));
const HomeDetail = lazy(() => import('pages/index/home/detail/HomeDetail'));

const BaojiaDetail = lazy(() => import('pages/index/baojia/detail/BaojiaDetail'));
const BaojiaRelease = lazy(() => import('pages/index/baojia/release/BaojiaRelease'));

const QuanziDetail = lazy(() => import('pages/index/quanzi/detail/QuanziDetail'));
const QuanziSearch = lazy(() => import('pages/index/quanzi/search/QuanziSearch'));
const QuanziChooseType = lazy(() => import('pages/index/quanzi/chooseType/QuanziChooseType'));
const QuanziRelease = lazy(() => import('pages/index/quanzi/release/QuanziRelease'));

const MyInfo = lazy(() => import('pages/index/mine/info/MyInfo'));
const ChangePhone = lazy(() => import('pages/index/mine/info/changePhone/ChangePhone'));
const Change = lazy(() => import('pages/index/mine/info/change/Change'));


const LevelUp = lazy(() => import('pages/index/mine/levelUp/LevelUp'));
const MyRelease = lazy(() => import('pages/index/mine/myRelease/MyRelease'));
const MyReceived = lazy(() => import('pages/index/mine/myReceived/MyReceived'));
const MyBaojia = lazy(() => import('pages/index/mine/myBaojia/MyBaojia'));
const MyBaojiaDetail = lazy(() => import('pages/index/mine/myBaojia/detail/MyBaojiaDetail'));

const MyHistory = lazy(() => import('pages/index/mine/myHistory/MyHistory'));
const ReplyList = lazy(() => import('pages/index/mine/replyList/ReplyList'));

const Login = lazy(() => import('pages/login/Login'));


const Register = lazy(() => import('pages/register/Register'));
const Data = lazy(() => import('pages/register/data/Data'));
const ChooseType = lazy(() => import('pages/register/chooseType/ChooseType'));

const alert = Modal.alert

class RouteMap extends React.Component {
    componentWillMount() {
        myEE.on('push', this.push.bind(this));
    }

    async push(url) {
        if (!(url.split('/').length <= 2 || /^\/(register|login)/.test(url))) {
            var res = await this.getMemberDetail()
            if (JSON.stringify(res) == '{}') {
                alert('提示', '您还未登录，是否前往登录', [
                    { text: '暂不' },
                    {
                        text: '去登录', onPress: () => {
                            this.props.history.push('/login')
                        }
                    }
                ])
                return
            } else if (!res.level) {
                alert('提示', '您的注册信息还在审核中，请等待', [
                    { text: '暂不' },
                    {
                        text: '确定'
                    }
                ])
                return
            }
        }
        this.props.history.push(url);
    }

    getMemberDetail() {
        if (localStorage.getItem('token')) {
            if (Constant.data.timerss && Date.now() - Constant.data.timerss <= 60 * 1000) {  // 更新数据
                return Constant.data.memberDetail
            } else {
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
        // this.props.history.listen((e) => {
        //     if (window.env == 'ali') {
        //         window.my.postMessage({
        //             type: 'url',
        //             val: e.pathname + e.search
        //         })
        //     } else if (window.env == 'wx') {
        //         window.ws.send(JSON.stringify({
        //             type: '1',
        //             token: localStorage.getItem('socketKey'),
        //             appId: Constant.data.app_id,
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
            <Suspense fallback={<div className="root-loading"><img src={require('common/img/loading.gif')} alt="" /> <span>页面加载中，请稍后</span></div>}>

                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/index" replace />} />
                    <Route path="/index" render={() => <Index />} />
                    <Route path="/home/list" render={() => <HomeList />} />
                    <Route path="/home/detail/:id" render={() => <HomeDetail />} />
                    <Route path="/baojia/release" render={() => <BaojiaRelease />} />
                    <Route path="/baojia/detail/:id" render={() => <BaojiaDetail />} />
                    <Route path="/quanzi/detail/:id" render={() => <QuanziDetail />} />
                    <Route path="/quanzi/search" render={() => <QuanziSearch />} />
                    <Route path="/quanzi/chooseType" render={() => <QuanziChooseType />} />
                    <Route path="/quanzi/release" render={() => <QuanziRelease />} />


                    <Route path="/mine/myInfo" exact render={() => <MyInfo />} />
                    <Route path="/mine/myInfo/changePhone" exact render={() => <ChangePhone />} />
                    <Route path="/mine/myInfo/change" exact render={() => <Change />} />
                    <Route path="/mine/levelUp" render={() => <LevelUp />} />
                    <Route path="/mine/myRelease" render={() => <MyRelease />} />
                    <Route path="/mine/myReceived" render={() => <MyReceived />} />
                    <Route path="/mine/myBaojia" exact render={() => <MyBaojia />} />
                    <Route path="/mine/myBaojia/detail/:id" render={() => <MyBaojiaDetail />} />
                    <Route path="/mine/myHistory" render={() => <MyHistory />} />
                    <Route path="/mine/replyList" render={() => <ReplyList />} />
                    <Route path="/register" exact render={() => <Register />} />
                    <Route path="/register/data" render={() => <Data />} />
                    <Route path="/register/chooseType" render={() => <ChooseType />} />
                    <Route path="/login" exact render={() => <Login />} />



                    <Route render={() => <Index />} />
                </Switch>
            </Suspense>

        )
    }
}
export default withRouter(RouteMap)

