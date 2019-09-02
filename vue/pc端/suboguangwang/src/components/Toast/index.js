import Vue from 'vue'

const Toast = Vue.extend(require('./toast'))
let instance

const toastInstance = (text, callback) => {
  if (!instance) {
    instance = new Toast({
      el: document.createElement('div')
    })
  }
  if (instance.visiable) return
  instance.text = text || '正在加载'
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visiable = true
    setTimeout(() => {
      instance.visiable = false
      callback && callback()
    }, 1000)
  })
}

export default toastInstance