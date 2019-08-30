import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd'
// import Login from './pages/login/Login';
import RouteMap from './router';
import { Router } from 'react-router';
import { createBrowserHistory } from "history";
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import "antd/dist/antd.css";
import './index.css';
import registerServiceWorker from './registerServiceWorker';

export interface IObjectAny {
  [propName: string]: any
}

export interface IActivityState {
  [propName: string]: any
}

interface ErrorInfo {
  /**
   * Captures which component contained the exception, and its ancestors.
   */
  componentStack: string;
}
class PotentialError extends React.Component<IObjectAny, IActivityState> {
  constructor(props: IObjectAny) {
    super(props);
    this.state = { error: false };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.error) {
      return <h1>Error: {this.state.error.toString()}</h1>;
    }
    return this.props.children;
  }
}

const Index = () => {
  const history = createBrowserHistory()
  return (
    <Router history={history}>
      <RouteMap />
    </Router>
  )
}

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <PotentialError>
      <Index />
    </PotentialError>
  </LocaleProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
