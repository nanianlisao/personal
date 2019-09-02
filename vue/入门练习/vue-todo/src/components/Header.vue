<template>
<header class="header">
  <h1>{{header}}</h1>
</header>
</template>

<script>
export default {
  data () {
    return {
      header: 'NaNian Test'
    }
  }
}
</script>
<style lang="less" scoped>
  h1{
    font-size: 100px;
    text-align: center;
    color: rgba(175,47,47,.6);
    padding: 100px 0;
  }
</style>
