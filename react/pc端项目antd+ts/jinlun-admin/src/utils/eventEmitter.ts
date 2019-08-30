// 通过eventBus进行不同组件间的通讯 (主要是控制路由跳转 push事件)
import EventEmitter from 'events'
const myEE = new EventEmitter()
export default myEE


