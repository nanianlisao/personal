<template>
  <div class="expertise-box">
    <w-banner></w-banner>
    <div class="expertise-main all-main-box">
      <w-bread :breadList="breadList"></w-bread>
      <div class="expertise-select">
        <div class="business public-box" v-for="(item, index) in categoryList" :key="index">
          <div class="public-title title">
            <h2>{{item.name}}</h2>
          </div>
          <div class="public-main-box">
            <div
              class="select-box"
              v-for="(opt, idx) in item.categoryQueryVoList"
              :key="idx"
              @click="onExpertisePage(opt, item)"
            >{{opt.name}}</div>
            <div class="article-none" v-if="item.categoryQueryVoList.length===0">
              <img src="../../assets/img/no-msg.png" alt>
              <p>暂无相关领域</p>
            </div>
          </div>
        </div>
        <div class="article-none" v-if="categoryList.length===0">
          <img src="../../assets/img/no-msg.png" alt>
          <p>暂无相关领域</p>
        </div>
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import { storage } from "utils/storage";
import { API, appId } from "js/config";
import { Axios } from "utils/util";
export default {
  name: "expertise",
  data() {
    return {
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/expertise",
          name: "专业领域"
        }
      ],
      businessList: [],
      categoryList: []
    };
  },
  created() {
    this._fetchSubtopic();
  },
  methods: {
    // 跳转到分类详情
    onExpertisePage(opt, item) {
      this.$router.push(
        `/expertise/expertiseDetail/${opt.id}?name=${item.name}&subColumnId=${
          item.id
        }`
      );
    },

    // 查询子栏目列表
    async _fetchSubtopic() {
      const categoryId = storage.get("categoryId");
      let res = await Axios.get(`${API}subcolumn/list/with/applet`, {
        columnId: categoryId,
        appId: appId
      });
      this.categoryList = res;
      console.log(res);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.expertise-box
  background #f0f1f5
  .expertise-main
    padding-bottom 0.71rem
    .expertise-select
      background #fff
      padding 0.63rem 1.03rem
  .public-box
    .public-title
      border-bottom 0.01rem solid rgba(240, 241, 245, 1)
      text-align center
      height 0.45rem
    .public-main-box
      margin 0.42rem 0
      .select-box
        width 3.27rem
        height 0.73rem
        line-height 0.73rem
        display inline-block
        border 0.02rem solid rgba(63, 81, 181, 1)
        margin 0 0.03rem 0.03rem 0
        text-align center
        font-size 0.16rem
        color rgba(51, 51, 51, 1)
        cursor pointer
        transition all 0.3s
      .select-box:hover
        background rgba(63, 81, 181, 1)
        color #FFF
  .article-none
    text-align center
    img
      width 1.25rem
      height 1.25rem
    p
      color rgba(221, 221, 221, 1)
      margin-top 0.3rem
      font-size 0.24rem
</style>
