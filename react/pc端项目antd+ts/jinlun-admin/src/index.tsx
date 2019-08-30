import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import RouteMap from './router'
import { Router } from 'react-router'
import { createBrowserHistory } from "history"
import zhCN from 'antd/lib/locale-provider/zh_CN'  // antd国际化 设为中文
import './index.css'
import registerServiceWorker from './registerServiceWorker' // 后台注册service worker 离线缓存

export interface IObjectAny {
  [propName: string]: any
}

export interface IActivityState {
  [propName: string]: any
  error: boolean | Error,
  info: string | ErrorInfo
}

interface ErrorInfo {
  componentStack: string
}

class PotentialError extends React.Component<IObjectAny, IActivityState> {
  constructor(props: IObjectAny) {
    super(props)
    this.state = {
      error: false,
      info: ''
    }
  }

  // 如果检测到有错误发生，抛出异常到页面中
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info })
  }

  render() {
    if (this.state.error) {
      return <h1>Error: {this.state.error.toString()}</h1>
    }
    return this.props.children
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
)
registerServiceWorker()
