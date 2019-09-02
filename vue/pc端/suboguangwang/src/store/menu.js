export default {
  state: {
    activeKey: '/'
  },
  getters: {
    activeKey: state => state.activeKey
  },
  mutations: {
    setActiveKey (state, payload) {
      state.activeKey = payload
    }
  }
}
