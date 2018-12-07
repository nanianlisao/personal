import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor' // 富文本编辑器
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/reset.css'
import '@/assets/style/main.css'
import '@/assets/fonts/iconfont.css'
import '@/assets/js/util.js'
// 富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
