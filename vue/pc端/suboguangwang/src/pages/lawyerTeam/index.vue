<template>
  <div class="lawyer-box">
    <w-banner></w-banner>
    <div class="lawyer-main-box">
      <w-bread :breadList="breadList"></w-bread>
      <div class="lawyer-item-box">
        <div class="lawyer-title all-main-box">
          <h2>律师团队</h2>
        </div>
        <p>苏博拥有一批既有丰富经验，又有深厚理论基础的律师。苏博的合伙人大多毕业于国内外著名法学院，不少合伙人在国际著名律师行工作多年。在成为苏博的合伙人之前，均已在其相关专业领域执业多年，并已经取得良好的业绩。苏博的律师及助理律师在加入苏博前，均需接受严格的遴选，且均为遴选中的佼佼者。苏博并通过各种各样的培训以提高助理律师的服务水平。</p>
        <div class="lawyer-list">
          <div
            class="lawyer-item"
            v-for="(item, index) in lawyerList"
            :key="index"
            :style="(index+1) % 3 == 0 ? 'margin-left: 0;': 'margin-right: .25rem;'"
            @click="onLawyerTeamDetail(item.id)"
          >
            <div class="lawyer-img">
              <img v-lazy="item.src" alt>
            </div>
            <div class="lawyer-introduce">
              <div class="lawyer-top">
                <h2>{{item.name}}</h2>
                <div class="location">
                  <Icon type="ios-pin" class="lawyer-icon"/>
                  <span>{{item.location}}</span>
                </div>
              </div>
              <p>在所职务：{{item.duty}}</p>
              <p>专业领域：{{item.domain}}</p>
            </div>
          </div>
          <div class="article-none" v-if="!lawyerList.length">
            <img src="../../assets/img/no-msg.png" alt>
            <p>暂无律师</p>
          </div>
        </div>
      </div>
      <w-page :totalPage="totalPage" :pageSize="pageSize" @on-update="onChangePage"/>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import Vue from "vue";
import { Icon } from "iview";
import { apiTeammate } from "js/api";
import Constant from "utils/Constant";
import { storage } from "utils/storage";

export default {
  name: "lawyerTeam",
  components: {
    Icon
  },
  data() {
    return {
      totalPage: 100,
      page: 1,
      pageSize: 9,
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/lawyerTeam",
          name: "律师团队"
        }
      ],
      lawyerList: []
    };
  },
  created() {
    this._fetchLawyerTeamList();
  },
  methods: {
    onLawyerTeamDetail(opt) {
      this.$router.push(`/lawyerTeam/lawyerTeamDetail/${opt}`);
    },
    async _fetchLawyerTeamList() {
      const opt = await apiTeammate({
        startIndex: (this.page - 1) * this.pageSize,
        pageSize: this.pageSize
      });
      this.totalPage = opt.totalCount;
      if (opt.totalCount) {
        this.lawyerList = opt.items.map(item => {
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          let domain = item.subCategoryQueryVoList.map(ele => {
            return ele.name;
          });
          domain = domain.join("，");
          return {
            id: item.id,
            src: item.photoFileId,
            name: item.name,
            duty: item.duty,
            location: item.province,
            domain: domain
          };
        });
      }
    },
    onChangePage(page) {
      this.page = page;
      this._fetchLawyerTeamList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.lawyer-box
  .lawyer-main-box
    width: 13.17rem
    margin: 0 auto
    .lawyer-item-box
      border: 0.02rem solid rgba(240, 241, 245, 1)
      .lawyer-title
        border-bottom: 0.02rem solid rgba(240, 241, 245, 1)
        text-align: center
        height: 0.71rem
        h2
          border-bottom: 0.02rem solid rgba(63, 81, 181, 1)
          width: 1rem
          margin: 0 auto
          font-size: 0.24rem
          padding: 0.17rem 0
      >p
        margin: 0.4rem 0.74rem 0.61rem 0.74rem
        font-size: 0.16rem
        color: rgba(51, 51, 51, 1)
  .lawyer-list
    margin: 0 0.74rem 0.7rem 0.74rem
    .lawyer-item
      width: 3.7rem
      height: 4.8rem
      box-shadow: 0 0.12rem 0.3rem 0 rgba(0, 0, 0, 0.09)
      border-radius: 0.03rem
      display: inline-block
      margin-bottom: 0.3rem
      cursor: pointer
      vertical-align: top
      .lawyer-img
        width: 3.7rem
        height: 3.18rem
        display: block
        overflow: hidden
        img
          width: 3.7rem
          height: 3.18rem
      .lawyer-introduce
        padding: 0.3rem 0.3rem 0.24rem 0.3rem
        transition: all 0.2s ease-in-out
        .lawyer-top
          display: flex
        .location
          display: flex
          align-items: center
        h2
          font-weight: 400
          font-size: 0.18rem
          display: inline-block
          margin-right: 0.06rem
        .lawyer-icon
          font-size: 0.18rem
          color: rgba(63, 81, 181, 1)
        span
          font-size: 0.15rem
          color: rgba(149, 149, 149, 1)
        p
          font-size: 0.15rem
          color: rgba(149, 149, 149, 1)
          margin: 0.05rem 0
        p:last-child
          height: 0.44rem
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
    .lawyer-item:hover
      .lawyer-introduce
        background: rgba(63, 81, 181, 1)
        h2, span, p, .lawyer-icon
          color: #fff
    .article-none
      text-align: center
      img
        width: 1.25rem
        height: 1.25rem
      p
        color: rgba(221, 221, 221, 1)
        margin-top: 0.3rem
        font-size: 0.24rem
</style>
