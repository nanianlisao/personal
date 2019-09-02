<template>
  <Page
    :total="totalPage"
    :current="current"
    class="page-item"
    :page-size="pageSize"
    @on-change="onChangePage"
  />
</template>

<script>
import Vue from "vue";
import { Page } from "iview";

export default {
  components: {
    Page
  },
  props: {
    totalPage: Number,
    pageSize: Number,
    current: Number
  },
  data() {
    return {};
  },
  methods: {
    onChangePage(opt) {
      this.$emit("on-update", opt);
    }
  }
};
</script>

<style lang="stylus">
.page-item
  text-align center
  margin 0.35rem 0 0.65rem 0
  .ivu-page-item, .ivu-page-item-jump-next, .ivu-page-prev, .ivu-page-next
    border none
    background rgba(240, 240, 240, 1)
  .ivu-page-item-active
    background rgba(63, 81, 181, 1)
    >a
      color #fff
  .ivu-page-item:hover, .ivu-page-item-jump-next
    >a
      color rgba(63, 81, 181, 1)
  .ivu-page-item-active:hover
    >a
      color #fff
</style>
