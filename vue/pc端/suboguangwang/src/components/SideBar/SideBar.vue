<template>
  <div class="side-bar">
    <dl>
      <dt>{{sideTitle}}</dt>
      <dd
        :class="activeClass === idx ? 'active':''"
        v-for="(opt, idx) in menuList"
        :key="idx"
        @click="onSelectMenu(opt.id, idx)"
      >{{opt.value}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    menuList: Array,
    sideTitle: {
      type: String,
      default: "新闻资讯"
    },
    activeBar: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeClass: 0
    };
  },

  watch: {
    activeBar(newV) {
      this.activeClass = newV;
    }
  },

  created() {
    this.activeClass = this.activeBar;
  },

  mounted() {},
  methods: {
    onSelectMenu(opt, idx) {
      this.activeClass = idx;
      this.$emit("on-select", opt, idx);
    }
  }
};
</script>

<style lang="stylus">
.side-bar
  dl
    width 2.7rem
    dt
      background #3F51B5
      color #ffffff
      font-size 0.16rem
      padding 0.16rem 0.23rem
    dd
      margin 0.19rem 0 0 0.24rem
      cursor pointer
      font-size 0.16rem
    dd:hover, .active
      color #3F51B5
</style>
