<template>
  <div class="search-box">
    <div class="all-main-box">
      <w-bread :breadList="breadList"></w-bread>
      <div class="search-content" ref="content">
        <div
          class="item-name"
          v-for="(item,index) in dataList"
          :key="index"
          @click="goDetail(item.type,item.id,item.beforeId,item.subColumnId,item.subColumnName)"
        >
          <div class="search-title line-1">{{item.title}}</div>
          <div class="search-body line-3">{{item.showBody}}</div>
        </div>
        <div class="no-msg" v-if="dataList.length===0">
          <img src="./../../assets/img/no-msg.png" alt>
          <p>未查到相关内容</p>
        </div>
        <w-page
          v-if="dataList.length>0"
          :totalPage="totalCount"
          :pageSize="pageSize"
          @on-update="onChangePage"
        />
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import { apiSearch } from "js/api";
import { storage } from "utils/storage";
import { getSimpleText, slideTo } from "utils/util";
export default {
  name: "expertise",
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      dataList: [],
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/",
          name: "搜索结果"
        }
      ]
    };
  },
  created() {
    console.log("created");
    this.getSearchList();
  },

  watch: {
    $route(to, from) {
      // 在当前页搜索 更新数据
      if (to.path === from.path) {
        this.getSearchList();
      }
    }
  },

  methods: {
    // 查询列表信息
    async getSearchList(page = this.page, pageSize = this.pageSize) {
      let q = decodeURIComponent(this.$route.query.q);
      let res = await apiSearch({
        string: q,
        startIndex: (page - 1) * pageSize,
        pageSize: pageSize
      });
      res.items.forEach(x => {
        x.showBody = getSimpleText(x.body)
          .trim()
          .slice(0, 200);
      });
      this.totalCount = res.totalCount;
      this.dataList = res.items;
    },

    goDetail(type, id, beforeId, subColumnId, subColumnName) {
      // type 1：子分类  2：新闻资讯 3：热点案例 4：律师
      let url = "";
      if (type === 1) {
        // 子分类 需要分类Id 子分类Id 子栏目Id 子栏目名称
        url = `/expertise/expertiseDetail/${beforeId}?subColumnId=${subColumnId}&subCategoryId=${id}&name=${subColumnName}`;
      } else if (type === 2) {
        url = `/newsCenter/newsCenterDetail/${id}`;
      } else if (type === 3) {
        url = `/hotCase/hotCaseDetail/${id}`;
      } else if (type === 4) {
        url = `/lawyerTeam/lawyerTeamDetail/${id}`;
      }
      this.$router.push(url);
    },

    onChangePage(e) {
      this.page = e;
      slideTo(0);
      this.getSearchList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.search-box
  background #f0f1f5
  overflow auto
  .search-content
    background #ffffff
    padding 0.4rem 0.8rem 0.8rem
    margin-bottom 0.8rem
    .no-msg
      padding 0.6rem
      display flex
      align-items center
      justify-content center
      flex-direction column
      img
        margin-bottom 0.5rem
    .item-name
      border-bottom 0.03rem solid #F0F0F0
      padding 0.35rem 0
      .search-title
        cursor pointer
        line-height 28px
        font-size 18px
        color #333
        padding-left 16px
        font-family SourceHanSansCN-Regular
        font-weight 400
        &:hover
          color #ca0c16
      .search-body
        cursor pointer
        margin-top 18px
        line-height 25px
        font-size 16px
        color #959595
        padding-left 16px
        &:hover
          color #00c
</style>
