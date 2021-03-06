import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import SingerDetail from '@/components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: '/singer/:id',
      component: SingerDetail
    }]
  }, {
    path: '/search',
    component: Search
  }, {
    path: '/rank',
    component: Rank
  }]
})
