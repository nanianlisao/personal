<template>
  <div class="year-select">
    <Button class="next" :disabled="next" shape="circle" type="primary" @click="onNext">&lt;</Button>
    <div class="year" v-for="(item, index) in yearList" :key="index" :class="activeYear == index ? 'year-active':''" @click="onSelectYear(item, index)">{{item}}</div>
    <Button class="prev" :disabled="prev" shape="circle" type="primary" @click="onPrev">&gt;</Button>
  </div>
</template>

<script>
import { Button } from 'iview'

export default {
  components: {
    Button
  },
  props: {
    yearList: Array,
    next: Boolean,
    prev: Boolean
  },
  data () {
    return {
      activeYear: 0
    }
  },
  mounted () {

  },
  methods: {
    // 选择年份
    onSelectYear(opt, idx) {
      this.activeYear = idx
      this.$emit('on-select', opt)
    },
    onNext() {
      this.activeYear = 0
      this.$emit('on-next')
    },
    onPrev() {
      this.activeYear = 0
      this.$emit('on-prev')
    }
  }
}
</script>

<style lang="stylus">
  .year-select
    width 7.41rem
    margin 0 auto
    div
      display inline-block
      margin 0 .23rem
      font-size .16rem
      cursor pointer
    .next, .prev
      font-size .16rem
      font-weight bold
      padding 0
      width .26rem
      height .26rem
    .year
      vertical-align middle
      border-bottom .02rem solid #fff
    .year-active
      color #3F51B5
      border-bottom .02rem solid #3F51B5
      vertical-align middle
    .ivu-btn-primary
      background #3F51B5
      border none
      vertical-align middle
    .ivu-btn-primary[disabled]
      background #ABABAB
      border .01rem solid #ABABAB
      color #fff
    .ivu-btn>span
      vertical-align baseline
</style>
