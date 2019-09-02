<template>
  <div class="about-box">
    <w-banner></w-banner>

    <div class="about-us-box all-main-box">
      <w-bread :breadList="breadList"></w-bread>
      <div class="company-introduce">
        <div class="msg-title title">
          <h2>事务所简介</h2>
        </div>
        <div class="main-msg" v-html="aboutUs"></div>
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import { storage } from "utils/storage";
export default {
  name: "aboutUs",
  data() {
    return {
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/aboutUs",
          name: "关于我们"
        }
      ],
      aboutUs: ""
    }
  },
  created() {
    this._fetchAboutUs();
  },
  methods: {
    _fetchAboutUs() {
      const obj = storage.get("baseMsg");
      if (obj.meAbout) {
        this.aboutUs = obj.meAbout;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.about-box
  background: #F1F0F5
  width: 100%
  .about-us-box
    .company-introduce
      background: #ffffff
      padding: 0.64rem 1.59rem 1.04rem 1.59rem
      margin: 0.56rem 0
      .msg-title
        border-bottom: 0.01rem solid rgba(240, 241, 245, 1)
        height: 0.45rem
      .main-msg
        margin-top: 0.4rem
        font-size: 0.16rem
</style>
