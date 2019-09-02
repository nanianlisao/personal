<template>
  <div class="hot-case-box">
    <w-banner></w-banner>
    <div class="hot-case-main flex-box all-main-box">
      <w-bread :breadList="breadList" class="bread"></w-bread>
      <div class="left-box">
        <w-side-bar :menuList="menuList" @on-select="onSelectMenu" :activeBar="activeBar"></w-side-bar>
      </div>

      <div class="right-box" v-for="(item, index) in mainTextList" :key="index">
        <div class="news-title">
          <h2>{{item.title}}</h2>
        </div>
        <div class="time-share">
          <p>时间：{{item.time}}</p>
        </div>
        <div class="main-text" v-html="item.body"></div>
        <div class="box" v-if="item.type==2">
          <!-- <video id="media" class="video" controls :poster="imgUrl + item.photoFileId">
            <source :src="imgUrl+item.videoFileId">
          </video> -->
          <!-- <embed
            src="https://file.njshushuo.com/flvplayer.swf"
            :flashvars="'vcastr_file='+imgUrl + item.videoFileId"
            quality="high"
            bgcolor="#000000"
            width="500"
            height="380"
            name="VideoPlayer"
            align="middle"
            allowScriptAccess="*"
            allowfullscreen="true"
            type="application/x-shockwave-flash"
            pluginspage="http://www.macromedia.com/go/getflashplayer"
          /> -->
           <w-video :url="imgUrl + item.videoFileId" :types="item.videoFileType" />
        </div>
        <div class="index-list">
          <a
            href="javascript:;"
            v-if="item.beforeInfoId"
            @click="onChangePage(item.beforeInfoId)"
          >上一篇：{{item.beforeInfoTitle}}</a>
          <a href="javascript:void(0);" v-if="!item.beforeInfoId">上一篇：暂无</a>
          <a
            href="javascript:;"
            v-if="item.afterInfoId"
            @click="onChangePage(item.afterInfoId)"
          >下一篇：{{item.afterInfoTitle}}</a>
          <a href="javascript:void(0);" v-if="!item.afterInfoId">下一篇：暂无</a>
          <Button type="primary" @click="onBackList">返回列表</Button>
        </div>
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import Vue from "vue";
import { Button } from "iview";
import { storage } from "utils/storage";
import { apiSubtopic, apiMessage } from "js/api";
import Constant from "utils/Constant";

export default {
  name: "newsDetail",
  components: {
    Button
  },
  data() {
    return {
      imgUrl: Constant.data.picUrl,
      activeBar: 0,
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/newsCenter",
          name: "新闻资讯"
        },
        {
          path: ``,
          name: "资讯详情"
        }
      ],
      menuList: [],
      mainTextList: []
    };
  },
  created() {
    if (this.$route.query.activeBar) {
      this.activeBar = parseInt(this.$route.query.activeBar);
    }
    if (this.$route.query.subColumnId) {
      this.subColumnId = parseInt(this.$route.query.subColumnId);
    }
    if (this.$route.query.year) {
      this.year = parseInt(this.$route.query.year);
    }
    this._fetchMenu();
  },
  methods: {
    onChangePage(id) {
      this.$router.replace(`/newsCenter/newsCenterDetail/${id}`);
      this._fetchMainMsg();
    },
    onSelectMenu(opt, idx) {
      this.activeBar = idx;
      this.$router.push(`/newsCenter?subColumnId=${opt}&activeBar=${idx}&refresh=true`);
    },
    onBackList() {
      this.$router.push(`/newsCenter`);
    },
    async _fetchMenu() {
      const categoryId = storage.get("categoryId");
      let params = {
        columnId: categoryId
      };
      const obj = await apiSubtopic(params);
      this.menuList = obj.map(item => {
        return {
          value: item.name,
          id: item.id
        };
      });
      this._fetchMainMsg();
    },
    async _fetchMainMsg() {
      const categoryId = storage.get("categoryId");
      const params = {
        id: this.$route.params.id,
        columnId: categoryId,
        subColumnId: this.subColumnId ? this.subColumnId : "",
        year: this.year ? this.year : ""
      };

      const opt = await apiMessage(params);
      this.mainTextList = opt.items.map(item => {
        return {
          title: item.title,
          time: item.date,
          type: item.type,
          body: item.body,
          videoFileId: item.videoFileId,
          photoFileId: item.photoFileId,
          afterInfoTitle: item.afterInfoTitle,
          afterInfoId: item.afterInfoId,
          beforeInfoId: item.beforeInfoId,
          beforeInfoTitle: item.beforeInfoTitle,
          videoFileType: item.videoFileType
        };
      });
      this.activeBar = this.menuList.findIndex(
        x => x.id === opt.items[0].subColumnId
      );
      // console.log(this.activeBar);
    }
  }
};
</script>

<style lang="stylus" scoped>
.hot-case-box
  .hot-case-main
    .bread
      margin-left 0.15rem
    .left-box
      border 0.02rem solid rgba(235, 235, 235, 1)
      width 3.25rem
      padding 0.5rem 0.4rem 0.55rem 0.15rem
    .right-box
      width 8.01rem
      margin-left 0.69rem
      border 0.02rem solid rgba(235, 235, 235, 1)
      padding 0.52rem 0.4rem 0.6rem
      margin-bottom 0.2rem
      .news-title
        position relative
        padding 0.1rem 0
        &:after, &:before
          content ''
          position absolute
          left 0
          bottom 0
          width 100%
          height 0.02rem
          background #EBEBEB
        &:after
          width 2.02rem
          background #3F51B5
        h2
          width 95%
          font-size 0.24rem
          line-height 0.36rem
      .time-share
        margin 0.18rem 0 0.44rem 0
        height 0.24rem
        line-height 0.24rem
        p
          font-size 0.14rem
          display inline-block
      .main-text
        color #000
        font-size 0.16rem
        p
          font-size 0.14rem
          color rgba(51, 51, 51, 1)
          line-height 0.29rem
        img
          width 7.13rem
          height 3.65rem
      .box
        video
          width 7.75rem
          height 4.35rem
      .index-list
        margin 0.54rem 0 0 0
        a
          color rgba(51, 51, 51, 1)
          display block
          margin-bottom 0.14rem
</style>

<style lang="stylus">
.index-list
  position relative
  a:hover
    text-decoration underline
  .ivu-btn-primary
    background rgba(90, 110, 217, 1)
    border none
    width 1rem
    position absolute
    right 0
    top 0.05rem
</style>
