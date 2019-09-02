<template>
  <div class="bread">
    <div class="bread-item" v-for="(item, index) in breadList" :key="index">
      <div class="bread-click-item" @click="onChangePage(item.path)">
        <img :src="item.src" alt v-if="item.src">
        <span class="name">{{item.name}}</span>
      </div>
      <span v-if="index < breadList.length - 1">&gt;</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    breadList: {
      type: Array
    }
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    onChangePage(path) {
      if (path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="stylus">
.bread
  margin: 0.22rem 0
  display: flex
  align-items: center
  .bread-item
    display: flex
    align-items: center
    font-size: 0.14rem
    .bread-click-item
      display: flex
      align-items: center
      cursor: pointer
      img
        width: 0.17rem
        height: 0.17rem
    span:hover
      color: #3F51B5
    span
      margin-left: 0.05rem
    >span
      color: #3F51B5
  .bread-item:last-child span
    color: #3F51B5
</style>
