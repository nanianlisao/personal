<template>
  <transition name="slide">
    <div class="detail">
      <div class="return"></div>
    </div>
  </transition>
</template>
<script>
export default {
  created() {
    console.log(111)
    console.log(this.$route.params)
  }
}

</script>
<style lang="less" scoped>
.detail {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #222;
  z-index: 40;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: rotate(90deg) scale(0);
}

</style>
