// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAMap from 'vue-amap'
import store from './store'
import VueFullPage from 'vue-fullpage.js'
import VueLazyLoad from 'vue-lazyload'
import './assets/css/fullpage.css'
import 'fullpage.js/vendors/scrolloverflow' // Optional. When using scrollOverflow:true
import 'iview/dist/styles/iview.css' // 使用 CSS
import 'animate.css'
import './components'
import 'babel-polyfill'
import 'js/rem'

Vue.use(VueLazyLoad, {
  preLoad: 1.1,
  error: require('./assets/img/error.png'),
  loading: require('./assets/img/loadings01.jpg'),
  attempt: 1
})
Vue.use(VueAMap)
Vue.use(VueFullPage)

Vue.config.productionTip = false
VueAMap.initAMapApiLoader({
  key: 'ef07777d78634138f13fbec0564fd0c9'
})
/* eslint-disable no-new */
new Vue({
  el: '#rootApp',
  router,
  store,
  components: { App }
})
