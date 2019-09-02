<template>
  <div id="app">
    <div class="mask"></div>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}

</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
  body {
    width: 100%;
    height: 100%;
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      width: 100%;
      height: 100%;
      background: url('http://img3.3lian.com/2013/c2/78/d/38.jpg');
      background-size: cover;
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.7;
        background-color: #999;
      }
    }
  }
}

</style>
