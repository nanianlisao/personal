<template>
  <div class="footer-box" :style="footStyle">
    <div class="select-box">
      <div>
        <div v-for="(item, index) in footerList" :key="index" class="select-element">
          <span @click="onJumpPage(item.value, item.id, item)">{{item.label}}</span>
          <span v-if="index != footerList.length - 1">|</span>
        </div>
      </div>
    </div>
    <div class="website-msg">
      Copyright
      <sup>©</sup>
      2019 subolaw.com 南京数说智能科技有限公司 版权所有 电话：{{phone}} <a href="http://beian.miit.gov.cn" target="_blank">苏ICP备19003548号-2</a>
    </div>
  </div>
</template>

<script>
import { storage } from "utils/storage";
import { apiMenuList } from "js/api";
import Constant from "utils/Constant";

export default {
  props: {
    footStyle: {
      type: String,
      default: "bottom: 0;"
    }
  },
  data() {
    return {
      footerList: [],
      phone: ""
    };
  },
  created() {
    let timer = setInterval(() => {
      if (storage.get("allColumnInfo")) {
        clearInterval(timer);
        let allColumnInfo = storage.get("allColumnInfo");
        this._fetchFooterList(allColumnInfo);
      }
    }, 200);
    let timer2 = setInterval(() => {
      if (storage.get("baseMsg")) {
        clearInterval(timer2);
        this.phone = storage.get("baseMsg").phone
      }
    }, 100);
  },
  methods: {
    // 页脚页面跳转
    onJumpPage(opt, id, item) {
      this.$router.push(opt);
    },

    // 生成底部菜单
    async _fetchFooterList(menuList) {
      if (menuList.length > 0) {
        this.footerList = menuList.map((item, index) => {
          switch (index) {
            case 0:
              item.value = "/";
              item.chineseName = "网站首页";
              break;
            case 1:
              item.value = "/aboutUs";
              item.chineseName = "苏博介绍";
              break;
            case 2:
              item.value = "/lawyerTeam";
              item.chineseName = "团队介绍";
              break;
            case 3:
              item.value = "/expertise";
              item.chineseName = "专业领域";
              break;
            case 4:
              item.value = "/newsCenter";
              item.chineseName = "新闻资讯";
              break;
            case 5:
              item.value = "/hotCase";
              item.chineseName = "热点案例";
              break;
            case 6:
              item.value = "/contactUs";
              item.chineseName = "联系我们";
              break;
          }
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          return {
            label: item.chineseName,
            name: item.name,
            english: item.englishName,
            value: item.value,
            id: item.id,
            photoFileId: item.photoFileId
          };
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.footer-box
  color #E0E0E0
  text-align center
  position absolute
  width 100%
  .select-box
    background #363636
    padding 0.29rem
    .select-element
      display inline-block
      span
        padding 0 0.16rem
        cursor pointer
  .website-msg
    background #252525
    padding 0.13rem
</style>
