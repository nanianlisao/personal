import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'  // antd国际化 设为中文
import './index.css'
import registerServiceWorker from './registerServiceWorker' // 后台注册service worker 离线缓存



ReactDOM.render(
  <LocaleProvider locale={zhCN}>
      <App />
  </LocaleProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
