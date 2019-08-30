import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Index from 'pages/index/Index';
import Login from 'pages/Login';
import NotFound from 'pages/NOT404/NotFound';


import myEE from 'util/eventEmitter';

class RouteMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            historyListener: null
        }
    }

    componentWillMount() {
        myEE.on('push', this.push.bind(this));
    }

    componentDidMount() { // 监听url变化
        this.props.history.listen((e) => {
            
        })
    }

    push(url) {
        this.props.history.push(url);
    }

    render() {
        return (
            <Switch>
                {/* <Route path="/" exact render={() => <Redirect to="/index" replace />} /> */}
                <Route path="/" exact component={Login} />} />
                <Route path="/login" exact component={Login} />} />
                <Route path="/index" component={Index} />
                <Route  component={NotFound} />
            </Switch>
        )
    }
}
export default withRouter(RouteMap)



