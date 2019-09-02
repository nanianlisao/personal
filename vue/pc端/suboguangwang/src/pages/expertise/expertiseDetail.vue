<template>
  <div class="expertise-detail-box">
    <w-banner></w-banner>
    <div class="main-expertise-box flex-box all-main-box">
      <w-bread :breadList="breadList"></w-bread>
      <div class="left-box">
        <h2>
          {{menuName}}
          <img src="./../../assets/img/menu.png">
        </h2>
        <Menu
          ref="menu"
          :open-names="openMenu"
          :active-name="selectTile"
          @on-select="onSelectMenu"
          width="auto"
        >
          <Submenu :name="item.id" v-for="(item, index) in menuList" :key="index">
            <template slot="title">{{item.name}}</template>
            <MenuItem
              :name="item.id+'-'+obj.id"
              v-for="(obj, idx) in item.subCategoryQueryVos"
              :key="idx"
            >{{obj.name}}</MenuItem>
          </Submenu>
        </Menu>
        <h2 v-if="lawyerList.length">
          相关人员
          <img src="./../../assets/img/menu.png">
        </h2>
        <div
          class="related-personnel"
          v-for="item in lawyerList"
          :key="item.name + item.id"
          @click="onChangeLawyer(item.id)"
        >
          <div class="lawyer-avatar">
            <img v-lazy="item.photoFileId" alt>
          </div>
          <div>
            <p>{{item.name}}</p>
            <span>{{item.duty}}</span>
          </div>
        </div>
        <h2 v-if="newsList.length">
          相关资讯
          <img src="./../../assets/img/menu.png">
        </h2>
        <ul
          class="about-news"
          v-for="(item, index) in newsList"
          :key="item.infoTitle + index"
          @click="onChangeInfo(item.infoId,item.columnId)"
        >
          <li>
            <p class="circle"></p>
            {{item.infoTitle}}
          </li>
        </ul>
      </div>
      <div class="right-box">
        <div class="title">
          <h2>{{mainTxtTitle}}</h2>
        </div>
        <div class="main-txt" v-html="mainTxt" v-if="mainTxt"></div>
        <div class="main-txt no-msg" v-if="!mainTxt">
          <img src="./../../assets/img/no-msg.png" alt>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import Vue from "vue";
import { Menu, MenuItem, Submenu } from "iview";
import { apiSubClassify } from "js/api";
import { storage } from "utils/storage";
import Constant from "utils/Constant";
import { API, appId } from "js/config";
import { Axios } from "utils/util";
export default {
  name: "experDetail",
  components: {
    Menu,
    Submenu,
    MenuItem
  },
  data() {
    let _this = this;
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
        },
        {
          path: ``,
          name: ""
        }
      ],
      menuName: "",
      selectTile: "1-1",
      mainTxtTitle: "",
      mainTxt: "",
      openMenu: [],
      menuList: [],
      lawyerList: [],
      newsList: []
    };
  },

  watch: {
    openMenu(to, from) {
      this.$refs.menu.$children.forEach(item => {
        item.opened = false;
      });
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
    }
  },

  mounted() {
    this._fetchMenuList(); // 查询菜单列表
  },

  methods: {

    // 查询菜单列表
    async _fetchMenuList() {
      let subColumnId = this.$route.query.subColumnId;
      const id = this.$route.params.id;
      let res = await Axios.get(`${API}category/list/applet`, {
        subColumnId: subColumnId,
        appId: appId,
        pageSize: 100, // 没有分页
        startIndex: 0
      });
      this.menuList = res.items;
      this.menuName = this.$route.query.name
        ? this.$route.query.name
        : res.items[0].subColumnName;
      this.breadList[2].name = this.$route.query.name
        ? this.$route.query.name
        : res.items[0].subColumnName;
      this.menuList.forEach(async item => {
        if (item.id == id) {
          // 根据params.id展示当前分类
          if (item.subCategoryQueryVos) {
            // 查询子分类
            let obj = await Axios.get(`${API}subcategory/list/applet`, {
              appId: appId,
              // 如果没有指定子分类，默认展示该分类下第一个子分类
              id: this.$route.query.subCategoryId
                ? this.$route.query.subCategoryId
                : item.subCategoryQueryVos[0].id
            });
            if (obj.items.length) {
              this.selectTile = id + "-" + obj.items[0].id;
              console.log("this.selectTile " + this.selectTile);
              this.mainTxtTitle = obj.items[0].name;
              this.mainTxt = obj.items[0].remark;
              this.lawyerList = obj.items[0].teammateSubCategoryQueryVoList.map(
                item => {
                  item.photoFileId = Constant.data.picUrl + item.photoFileId;
                  return {
                    photoFileId: item.photoFileId,
                    name: item.teammateName,
                    id: item.teammateId,
                    duty: item.teammateDuty
                  };
                }
              );
              this.newsList = obj.items[0].infoSubCategoryQueryVoList;
            }
          }
        }
      });
      this.openMenu = [Number(id)];
    },

    async onSelectMenu(obj) {
      const num = obj.indexOf("-");
      const subId = obj.slice(num + 1);
      const id = obj.slice(0, num);
      let opt = await Axios.get(`${API}subcategory/list/applet`, {
        appId: appId,
        // 如果没有指定子分类，默认展示该分类下第一个子分类
        id: subId
      });
      if (opt.items.length > 0) {
        this.selectTile = id + "-" + opt.items[0].id;
        this.mainTxtTitle = opt.items[0].name;
        if (opt.items[0].remark) {
          this.mainTxt = opt.items[0].remark;
        }
        if (opt.items[0].teammateSubCategoryQueryVoList) {
          this.lawyerList = opt.items[0].teammateSubCategoryQueryVoList.map(
            item => {
              item.photoFileId = Constant.data.picUrl + item.photoFileId;
              return {
                photoFileId: item.photoFileId,
                name: item.teammateName,
                id: item.teammateId,
                duty: item.teammateDuty
              };
            }
          );
          this.newsList = opt.items[0].infoSubCategoryQueryVoList;
          this.$router.replace(
            `/expertise/expertiseDetail/${id}?name=${
              this.menuName
            }&subColumnId=${
              this.$route.query.subColumnId
            }&subCategoryId=${subId}`
          );
        }
      }
    },

    // 跳转到律师简介
    onChangeLawyer(id) {
      this.$router.push(`/lawyerTeam/lawyerTeamDetail/${id}`);
    },

    // 跳转到资讯
    onChangeInfo(id, columnId) {
      if (columnId === 6) {
        this.$router.push(`/hotCase/hotCaseDetail/${id}`);
      } else if (columnId === 5) {
        this.$router.push(`/newsCenter/newsCenterDetail/${id}`);
      }
    }
  }
};
</script>

<style lang="stylus">
@import './../../assets/css/expertiseDetail.styl'
</style>
