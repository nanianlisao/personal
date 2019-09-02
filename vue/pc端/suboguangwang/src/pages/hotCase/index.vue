<template>
  <div class="hot-case-box">
    <w-banner></w-banner>
    <div class="hot-case-main flex-box all-main-box">
      <w-bread :breadList="breadList" class="bread"></w-bread>
      <div class="left-box">
        <w-side-bar
          :menuList="menuList"
          :sideTitle="sideTitle"
          @on-select="onSelectMenu"
          :activeBar="activeBar"
        ></w-side-bar>
      </div>

      <div class="right-box">
        <w-year
          :yearList="yearList"
          :next="next"
          :prev="prev"
          @on-next="onNext"
          @on-prev="onPrev"
          @on-select="onSelectYear"
        ></w-year>
        <div class="article-box">
          <div
            class="article-item"
            v-for="(item, index) in msgList"
            :key="index"
            @click="onJumpDetail(item.id)"
          >
            <div class="title">
              <img src="./../../assets/img/circle.png" alt />
              <p>{{item.title}}</p>
              <span>{{item.date}}</span>
            </div>
          </div>
          <div class="article-none" v-if="!msgList.length">
            <img src="../../assets/img/no-msg.png" alt />
            <p>暂无相关案例</p>
          </div>
        </div>
        <w-page
          :totalPage="totalPage"
          :current="page"
          :pageSize="pageSize"
          @on-update="onChangePage"
        ></w-page>
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import Vue from "vue";
import { Button } from "iview";
import { apiSubtopic, apiMessage } from "js/api";
import { storage } from "utils/storage";

export default {
  name: "hotCase",
  components: {
    Button
  },
  data() {
    return {
      totalPage: null,
      page: 1,
      pageSize: 10,
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/hotCase",
          name: "热点案例"
        }
      ],
      menuList: [],
      msgList: [],
      yearList: [],
      prev: true,
      next: true,
      list: [],
      year: null,
      subColumnId: null,
      sideTitle: "热点案例",
      activeBar: 0
    };
  },
  watch: {
    $route(to) {
      if (to.query.refresh) {
        // 需要刷新
        this.load();
      }
    }
  },

  created() {
    this.load();
  },
  methods: {
    load() {
      this.yearList = [];
      this.page = 1;
      this.list = [];
      this.activeBar = 0;
      this._fetchYear();
      this.year = this.yearList[0];
      this._fetchMenu();
      if (this.$route.query.activeBar) {
        this.activeBar = parseInt(this.$route.query.activeBar);
      }
    },
    // 跳转到详情页
    onJumpDetail(id) {
      this.$router.push(
        `/hotCase/hotCaseDetail/${id}?activeBar=${this.activeBar}&subColumnId=${this.subColumnId}&year=${this.year}`
      );
    },
    onChangePage(page) {
      this.page = page;
      this._fetchList();
    },
    // 上一页
    onNext() {
      let first = this.yearList[0];
      let arr = [];
      let date = new Date();
      let year = date.getFullYear();
      for (var i = 0; i < 8; i++) {
        let mainYear = ++first;
        if (mainYear >= year + 1) {
          this.next = false;
          break;
        } else {
          arr.push(mainYear);
        }
      }
      arr.reverse();
      if (arr.length < 8) {
        this.next = true;
        this.prev = false;
        this.list = arr.concat(this.yearList);
        this.list = Array.from(new Set(this.list));
        this.list.splice(8, this.list.length);
        this.yearList = this.list;
      } else {
        this.yearList = arr;
      }
      this.year = this.yearList[0];
      this._fetchList();
    },
    // 下一页
    onPrev() {
      let last = this.yearList[this.yearList.length - 1];
      let arr = [];
      for (let i = 0; i < 8; i++) {
        let year = --last;
        if (year < 2013) {
          this.prev = true;
          break;
        } else {
          arr.push(year);
          this.next = false;
        }
      }
      if (arr.length < 8) {
        this.list = this.yearList.concat(arr);
        this.list.splice(0, arr.length);
        this.yearList = this.list;
      } else {
        this.yearList = arr;
      }
      this.year = this.yearList[0];
      this._fetchList();
    },

    onSelectYear(opt) {
      this.year = opt;
      this.page = 1;
      this._fetchList();
    },

    onSelectMenu(opt, idx) {
      this.$router.replace(`/hotCase?subColumnId=${opt}&activeBar=${idx}`);
      this.subColumnId = opt;
      this.activeBar = idx;
      this.page = 1;
      this._fetchList();
    },

    // 判断年份，添加到列表
    _fetchYear() {
      let date = new Date();
      let year = date.getFullYear();
      let section = year - 2013;
      if (section > 8) {
        this.prev = false;
      }
      for (var i = 0; i < 8; i++) {
        if (year >= 2013) {
          this.yearList.push(year--);
        }
      }
    },

    async _fetchMenu() {
      const categoryId = storage.get("categoryId");
      let params = {
        columnId: categoryId
      };
      const obj = await apiSubtopic(params);
      if (obj.length) {
        this.menuList = obj.map(item => {
          return {
            value: item.name,
            id: item.id
          };
        });
        if (this.$route.query.subColumnId) {
          this.subColumnId = this.$route.query.subColumnId;
        } else {
          this.subColumnId = this.menuList[0].id;
        }
        this._fetchList();
      }
    },
    async _fetchList(page = this.page, pageSize = this.pageSize) {
      let oParams = {
        subColumnId: this.subColumnId,
        year: this.year,
        startIndex: (page - 1) * pageSize,
        pageSize: pageSize
      };
      const opt = await apiMessage(oParams);
      this.totalPage = opt.totalCount;
      this.msgList = [];
      if (opt.totalCount) {
        this.msgList = opt.items.map(item => {
          return {
            title: item.title,
            id: item.id,
            date: item.date
          };
        });
      }
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
      .article-box
        margin-top 0.58rem
        .article-item
          cursor pointer
          border-bottom 0.01rem dashed rgba(240, 240, 240, 1)
          margin-top 0.2rem
          .title
            img
              width 0.07rem
              height 0.07rem
              vertical-align middle
            p
              width 98%
              font-size 0.16rem
              display inline-block
              color rgba(51, 51, 51, 1)
              vertical-align middle
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
            span
              font-size 0.14rem
              color rgba(149, 149, 149, 1)
              display block
              padding-left 0.08rem
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
