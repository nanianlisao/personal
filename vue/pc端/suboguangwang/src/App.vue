<template>
  <div id="app">
    <div class="fixed-top">
      <div class="welcome-box">
        <div class="welcome flex all-main-box">
          <p>欢迎来到苏博律师事务所！</p>
          <div class="welcome-right">
            <a
              href="javascript:void(0);"
              @click="onAddFavorite('苏博律师事务所', 'lawgw.njshushuo.com')"
            >加入收藏</a>
            <span>|</span>
            <a href="javascript:void(0);" @click="onSetHome(this, 'lawgw.njshushuo.com')">设为首页</a>
          </div>
        </div>
      </div>
      <div class="header-box flex all-main-box" @click="hideInput">
        <div class="img-box">
          <img v-lazy="logoSrc" alt class="logo" v-if="logoSrc" />
        </div>
        <div class="tab-right">
          <Menu
            ref="key"
            mode="horizontal"
            theme="light"
            :class="{'small':isShowInput}"
            :active-name="$store.getters.activeKey"
            @on-select="onSelectMenu"
          >
            <MenuItem v-for="(item, index) in headerList" :key="index" :name="item.value">
              {{item.name}}
              <p>{{item.english}}</p>
            </MenuItem>
          </Menu>
          <div :class="[{'active': isShowInput},'input-wrap']" @click.stop="showInput">
            <Icon type="md-search" color="#999" size="25" />
            <Input class="top-input" v-model="inputValue" @on-enter="searchInput" />
          </div>
        </div>
      </div>
    </div>

    <div class="main-box">
      <transition name="page">
        <keep-alive
          :exclude="['experDetail','bannerDetail','newsDetail','hotCaseDetail','lawyerTeamDetail']"
        >
          <router-view class="router"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { Menu, MenuItem, Message, Modal, Icon, Input } from "iview";
import { apiMenuList, apiBaseMsg } from "js/api";
import { storage } from "utils/storage";
import Constant from "utils/Constant";
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

export default {
  name: "App",
  components: {
    Menu,
    MenuItem,
    Icon,
    Input
  },

  data() {
    return {
      key: "/",
      isShowInput: false,
      inputValue: "",
      headerList: [],
      logoSrc: ""
    };
  },

  created() {
    this._fetchMenuList();
    this._fetchLogoSrc();
  },

  mounted() {
    // 进行刷新页面时， 根据页面的路由 刷新this.key.(表示当前在哪个一级栏目下)
    console.log(this.$route.path);
    this.$nextTick(() => {
      // 如果是二级路由中 例如 /hotCase/hotCaseDetail/:id 进行字符串截取， 取 /hotCase
      if (this.$route.path.indexOf("/", 2) != -1) {
        // 例如 /hotCase/hotCaseDetail/22 => /hotCase
        let secondRouterName = this.$route.path.slice(
          0,
          this.$route.path.indexOf("/", 2)
        );
        // 如果是 /home/bannerDetail/:id => /home , this.key 取 `/`
        if (secondRouterName === "/home") {
          this.key = "/";
        } else {
          // 否则 this.key 就是 二级路由名
          this.key = secondRouterName;
        }
      } else {
        // 如果是一级路由中 key 就是path
        this.key = this.$route.path;
      }
      // 保存到store中， 同时需要手动调用menu的updateActiveName进行刷新
      this.$store.commit("setActiveKey", this.key);
      this.$refs.key.updateActiveName();
    });
  },

  computed: {
    ...mapGetters(["activeKey"])
  },

  watch: {
    $route(to) {
      // 路由变化时，根据path和allColumnInfo的value，更改storage里面的categoryId
      var allColumnInfo = storage.get("allColumnInfo");
      let path = "/" + to.path.split("/")[1];
      let currentColumn = allColumnInfo.find(x => x.value === path);
      // 排除 轮播图详情页
      if (path.indexOf("/home") !== -1) {
        path = "/";
      }
      this.$store.commit("setActiveKey", path);
      // 排除 一级路由 /search
      if (currentColumn && currentColumn.id) {
        storage.set("categoryId", currentColumn.id);
      }
    }
  },

  methods: {
    // 选择对应菜单
    onSelectMenu(opt) {
      this.$router.push(opt);
    },

    async _fetchMenuList() {
      const menuList = await apiMenuList();
      if (menuList.length) {
        // 查询所有一级栏目列表，根据索引 对应不同的路由
        let headerList = menuList.map((item, index) => {
          switch (index) {
            case 0:
              item.value = "/";
              break;
            case 1:
              item.value = "/aboutUs";
              break;
            case 2:
              item.value = "/lawyerTeam";
              break;
            case 3:
              item.value = "/expertise";
              break;
            case 4:
              item.value = "/newsCenter";
              break;
            case 5:
              item.value = "/hotCase";
              break;
            case 6:
              item.value = "/contactUs";
              break;
          }
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          return {
            name: item.chineseName,
            english: item.englishName,
            value: item.value,
            id: item.id,
            photoFileId: item.photoFileId,
            sort: item.sort
          };
        });
        // 将一级栏目信息存入缓存中，避免页面刷新时，重新请求一级栏目列表
        storage.set("allColumnInfo", headerList);
        // 后台根据sort 对一级栏目进行排序
        this.headerList = headerList.sort((x, y) => (x.sort > y.sort ? -1 : 1));
        // 手动调用menu的updateActiveName进行刷新
        this.$nextTick(() => {
          this.$refs.key.updateActiveName();
        });
      }
    },

    // 查询logo图
    async _fetchLogoSrc() {
      const obj = await apiBaseMsg();
      this.logoSrc = Constant.data.picUrl + obj.logoFileId;
      storage.set("baseMsg", obj);
    },

    // 展示输入框
    showInput() {
      console.log('@click.stop="showInput"');
      this.isShowInput = true;
    },

    // 隐藏输入框
    hideInput() {
      this.isShowInput = false;
    },

    // 搜索
    searchInput() {
      if (this.inputValue) {
        let q = encodeURIComponent(this.inputValue.trim());
        this.$router.push(`/search?q=${q}`);
      }
    },

    // 设为首页
    onSetHome(obj, url) {
      try {
        obj.style.behavior = "url(#default#homepage)";
        obj.setHomePage(url);
      } catch (e) {
        if (window.netscape) {
          try {
            netscape.security.PrivilegeManager.enablePrivilege(
              "UniversalXPConnect"
            );
          } catch (e) {
            this.$Message.error(
              "抱歉，此操作被浏览器拒绝！请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为true"
            );
          }
        } else {
          this.$Message.error(
            `您的浏览器不支持，请按照下面步骤操作：1.打开浏览器设置。2.点击设置网页。3.输入网址点击确定。`
          );
        }
      }
    },
    // 收藏
    onAddFavorite(title, url) {
      try {
        window.external.addFavorite(url, title);
      } catch (e) {
        try {
          window.sidebar.addPanel(title, url, "");
        } catch (e) {
          this.$Message.error(
            "抱歉，您所使用的浏览器无法完成此操作。加入收藏失败，请进入新网站后使用Ctrl+D进行添加"
          );
        }
      }
    }
  }
};
</script>

<style lang="stylus">
@import './assets/css/base.styl'
.fixed-top
  position fixed
  top 0
  z-index 101
  width 100%
  background #fff
  .welcome-box
    background #3F51B5
    color #fff
  .welcome
    padding 0.1rem 0
    .welcome-right
      span, a
        color #fff
        display inline-block
        margin-left 0.08rem
  .header-box, .welcome
    text-align center
    align-items center
    top 0
    z-index 101
  .header-box
    height 0.75rem
    .img-box
      display flex
      width 2.25rem
      height 0.4rem
      .logo
        height 0.4rem
        width 2.39rem
        object-fit contain
    .tab-right
      display flex
      align-items center
      .input-wrap
        display flex
        align-items center
        border-bottom 2px solid transparent
        .top-input
          width 0
          transition all 0.5s
          input
            border none
            font-size 16px
            &:focus
              box-shadow none
        &.active
          border-color #3F51B5
          .top-input
            width 1.62rem
    .ivu-menu
      height 0.75rem
      .ivu-menu-item
        line-height 0.16rem
        padding 0.18rem 0.2rem 0
        color #989898
      .ivu-menu-item:hover, .ivu-menu-item-active
        color #3F51B5
        border-bottom 0.02rem solid #3F51B5
      p
        margin-top 0.05rem
        font-size 0.12rem
        text-transform Uppercase
      &.small
        .ivu-menu-item
          transition all 0.5s
          padding 0.18rem 0.1rem
.ivu-menu-horizontal.ivu-menu-light:after
  background none
.main-box
  padding-top 1.12rem
  position relative
  height 100%
  >div
    min-height 100%
    position relative
    padding-bottom 1.2rem
h2
  color rgba(17, 17, 17, 1)
.page-enter-active, .page-leave-active
  transition all 0.2s linear
.page-leave-to, .page-enter
  // transform translateX(-20px)
  // opacity 0.5
</style>
