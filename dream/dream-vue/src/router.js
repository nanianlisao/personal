import Vue from 'vue'
import Router from 'vue-router'
// 异步加载
const Home = (resolve) => {
  import('views/home/Home').then((module) => {
    resolve(module)
  })
}
const Wechat = (resolve) => {
  import('views/wechat/Wechat').then((module) => {
    resolve(module)
  })
}
const Advert = (resolve) => {
  import('views/advert/Advert').then((module) => {
    resolve(module)
  })
}
const Focuspay = (resolve) => {
  import('views/focuspay/Focuspay').then((module) => {
    resolve(module)
  })
}
const Recruit = (resolve) => {
  import('views/recruit/Recruit').then((module) => {
    resolve(module)
  })
}
const About = (resolve) => {
  import('views/about/About').then((module) => {
    resolve(module)
  })
}
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: Home
  }, {
    path: '/wechat',
    component: Wechat
  }, {
    path: '/advert',
    component: Advert
  }, {
    path: '/focuspay',
    component: Focuspay
  }, {
    path: '/recruit',
    component: Recruit
  }, {
    path: '/about',
    component: About
  }]
});
