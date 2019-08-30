import 'base/js/rem.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick' // 解决移动端点击延迟300ms
import 'base/css/reset.less'
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('@/assets/logo.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
