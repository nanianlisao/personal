<template>
  <transition name="fade">
    <div class="toast-box" v-if="visiable">
      <div class="toast" v-text="text"></div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visiable: false
      }
    },
    props: {
      text: String
    }
  }
</script>

<style lang="stylus" scoped>
  .toast-box
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background rgba(0, 0, 0, .3)
    z-index 300

  .toast
    position fixed
    left 50%
    top 50%
    transform translate(-50%, -50%)
    padding .20rem .40rem
    background rgba(0,0,0,.6)
    border-radius .04rem
    font-size .18rem
    color #fff

  .fade-enter-active, .fade-leave-active
    transition .4s

  .fade-enter, .fade-leave-active
    opacity 0
</style>
