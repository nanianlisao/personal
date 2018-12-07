import Vue from 'vue'
import Router from 'vue-router'
const Home = () =>
  import('@/components/Home')
const ForumList = () =>
  import('@/components/forum/list')
const CommentList = () =>
  import('@/components/comment/list')
const ForumAbout = () =>
  import('@/components/forum/about')
const Desktop = () =>
  import('@/components/desktop/desktop')
const addTicket = () =>
  import('@/components/ticket/addTicket')
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/desktop/desktop'
  }, {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/',
    component: Home,
    children: [
      { path: '/desktop/desktop', component: Desktop, name: '数据分析' },
      { path: '/forum/list', component: ForumList, name: '论坛列表' },
      { path: '/forum/about', component: ForumAbout, name: '关于我们' },
      { path: '/comment/list', component: CommentList, name: '评论列表' },
      { path: '/ticket/addTicket', component: addTicket, name: '添加优惠券' }
    ]
  }]
})
