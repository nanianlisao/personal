import { resolve } from 'path'

// 常规一级路由
export const normalFirstRoutes = [
  {
    path: '/',
    meta: { name: '首页' },
    component: resolve => require(['@/pages/home/index2'], resolve),
    children: [{
      path: '/home/bannerDetail',
      meta: { name: '轮播详情' },
      component: resolve => require(['@/pages/home/bannerDetail'], resolve)
    }]
  },
  {
    path: '/aboutUs',
    meta: { name: '关于我们' },
    component: resolve => require(['@/pages/aboutUs'], resolve)
  },
  {
    path: '/lawyerTeam',
    meta: { name: '律师团队' },
    component: resolve => require(['@/pages/lawyerTeam'], resolve),
    children: [{
      path: '/lawyerTeam/lawyerTeameDetail',
      meta: { name: '律师团队详情' },
      component: resolve => require(['@/pages/lawyerTeam/lawyerTeamDetail'], resolve)
    }]
  },
  {
    path: '/expertise',
    meta: { name: '专业领域' },
    component: resolve => require(['@/pages/expertise'], resolve),
    children: [{
      path: '/expertise/expertiseDetail',
      meta: { name: '专业领域详情' },
      component: resolve => require(['@/pages/expertise/expertiseDetail'], resolve)
    }]
  },
  {
    path: '/newsCenter',
    meta: { name: '新闻资讯' },
    component: resolve => require(['@/pages/newsCenter'], resolve),
    children: [{
      path: '/newsCenter/newsCenterDetail',
      meta: { name: '新闻咨询详情' },
      component: resolve => require(['@/pages/newsCenter/newsCenterDetail'], resolve)
    }]
  },
  {
    path: '/search',
    meta: { name: '搜索结果' },
    component: resolve => require(['@/pages/search'], resolve)
  },
  {
    path: '/hotCase',
    meta: { name: '热门案例' },
    component: resolve => require(['@/pages/hotCase'], resolve),
    children: [{
      path: '/hotCase/hotCaseDetail',
      meta: { name: '热门案例详情' },
      component: resolve => require(['@/pages/hotCase/hotCaseDetail'], resolve)
    }]
  },
  {
    path: '/contactUs',
    meta: { name: '联系我们' },
    component: resolve => require(['@/pages/contactUs'], resolve)
  }
]

// 常规二级路由
export const normalChildRoutes = [
  {
    path: '/expertise/expertiseDetail/:id',
    component: resolve => require(['@/pages/expertise/expertiseDetail'], resolve)
  },
  {
    path: '/lawyerTeam/lawyerTeamDetail/:id',
    component: resolve => require(['@/pages/lawyerTeam/lawyerTeamDetail'], resolve)
  },
  {
    path: '/hotCase/hotCaseDetail/:id',
    component: resolve => require(['@/pages/hotCase/hotCaseDetail'], resolve)
  },
  {
    path: '/newsCenter/newsCenterDetail/:id',
    component: resolve => require(['@/pages/newsCenter/newsCenterDetail'], resolve)
  },
  {
    path: '/home/bannerDetail/:id',
    component: resolve => require(['@/pages/home/bannerDetail'], resolve)
  }
]

// 主路由
export const routes = [
  {
    path: '/',
    component: resolve => require(['@/App'], resolve),
    children: [
      ...normalFirstRoutes,
      ...normalChildRoutes
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
