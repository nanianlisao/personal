import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory,createHashHistory } from "history";
import { Router } from 'react-router-dom';
// import 'antd-mobile/dist/antd-mobile.css';
import './index.css';
import 'pages/index.less';

// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import { LocaleProvider } from 'antd'
// import App from './App';
import * as serviceWorker from './serviceWorker';
import RouteMap from './router/routerMap'
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }


    render() {
        let history = createBrowserHistory();
        // let history = createHashHistory();
        return (

            <Router history={history}>
                <RouteMap />
            </Router>

        )
    }
}


ReactDOM.render(
    // <LocaleProvider locale={zhCN}>
    <Index />
    // </LocaleProvider> 
    , document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
