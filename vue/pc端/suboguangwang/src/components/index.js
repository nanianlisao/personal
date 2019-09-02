import Vue from 'vue'
import Toast from './Toast'
import Spin from './Spin'

import Contact from './Contact'
import Footer from './Footer'
import Bread from './Bread'
import Banner from './Banner'
import Page from './Page'
import Year from './Year'
import SideBar from './SideBar'
import Video from './Video'

const components = {
  'contact': Contact,
  'footer': Footer,
  'bread': Bread,
  'banner': Banner,
  'page': Page,
  'year': Year,
  'side-bar': SideBar,
  'video': Video
}

Vue.use({
  install: Vue => {
    Object.keys(components).forEach(key => {
      Vue.component(`w-${key}`, components[key])
    })

    Vue.prototype.$toast = window.$toast = Toast
    Vue.prototype.$spin = window.$spin = Spin
  }
})
