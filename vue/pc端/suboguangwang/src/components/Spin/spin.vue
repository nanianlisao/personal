<template>
  <transition name="spin-fade">
    <div class="spin-wrap" v-if="visiable"></div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visiable: false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .spin-wrap
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    background rgba(255, 255, 255, .5) url('./spin.gif') no-repeat center center
    background-size .24rem .24rem
    z-index 100

  .spin-fade-enter-active, .spin-fade-leave-active
    transition .4s

  .spin-fade-enter
    opacity 0
    transform scale(2)

  .spin-fade-leave-active
    opacity 0
    transform scale(0)

</style>
