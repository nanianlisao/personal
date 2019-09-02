<template>
  <div id="app" @click="hideTab">
    <tab-head ref="tab"></tab-head>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
import TabHead from 'components/tab-head/tab-head'
export default {
  name: 'App',
  components: {
    TabHead
  },
  methods: {
    hideTab() {
      this.$refs.tab.hideTab()
    }
  },
  data() {
    return {
      show: false
    }
  }
}

</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
}

</style>
