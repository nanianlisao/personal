<template>
  <div class="about-us-title">
    <div class="banner-img-box">
      <img :src="bannerMsg.src" alt>
    </div>
    <div class="about-text">
      <div class="main-text">
        <p>{{bannerMsg.label}}</p>
        <p>{{bannerMsg.english}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from "utils/storage";
export default {
  props: {
    bannerMsg1: {
      type: Object
    }
  },
  data() {
    return {
      bannerMsg: {}
    };
  },
  created() {
    // 查询所有的栏目列表， 根据当前的columnId 展示banner信息
    let allColumnInfo = storage.get("allColumnInfo");
    let columnId = storage.get("categoryId");
    const obj = allColumnInfo.find(x => x.id === columnId);
    if (obj.name) {
      this.bannerMsg.label = obj.name;
      this.bannerMsg.src = obj.photoFileId;
      this.bannerMsg.english = obj.english;
    }
  }
};
</script>

<style lang="stylus">
.about-us-title
  width 100%
  height 3rem
  position relative
  .banner-img-box
    width 100%
    height 3rem
    overflow hidden
    img
      width 100%
      height 3rem
  .about-text
    background rgba(63, 81, 181, 0.7)
    width 5.08rem
    height 0.97rem
    color #fff
    font-size 0.2rem
    position absolute
    top 30%
    right 0
    .main-text
      width 2.5rem
      text-align center
      display flex
      flex-direction column
      align-items center
      justify-content center
      height 100%
      p:first-child
        border-bottom 0.02rem solid #fff
        padding 0.04rem 0
        margin 0 auto
      p:last-child
        font-size 0.16rem
        margin-top 0.05rem
        text-transform Uppercase
</style>
