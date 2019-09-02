import Vue from 'vue'

const Spin = Vue.extend(require('./spin'))
let instance

export const spinInstance = {
  show() {
    if (!instance) {
      instance = new Spin({
        el: document.createElement('div')
      })
    }
    if (instance.visiable) return
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.visiable = true
    })
  },
  hide() {
    if (instance.visiable === false || !instance) return
    instance.visiable = false
    Vue.nextTick(() => {
      document.body.removeChild(instance.$el)
    })
  }
}

export default spinInstance