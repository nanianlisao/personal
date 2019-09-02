<template>
  <div class="lawyer-detail-box">
    <w-banner></w-banner>
    <div class="detail-box all-main-box">
      <w-bread :breadList="breadList" class="bread-box"></w-bread>
      <div class="detail-main-box flex-box">
        <div class="left-box">
          <div class="lawyer-pic">
            <img v-lazy="lawyerMsg.src" alt>
          </div>
          <div class="contact-msg">
            <img src="./../../assets/img/contact_email.png" alt>
            邮箱：
            <span>{{lawyerMsg.email}}</span>
          </div>
          <div class="contact-msg">
            <img src="./../../assets/img/contact_phone.png" alt>
            电话：
            <span>{{lawyerMsg.phone}}</span>
          </div>
          <div class="contact-msg">
            <img src="./../../assets/img/printer.png" alt>
            传真：
            <span>{{lawyerMsg.print}}</span>
          </div>
        </div>
        <div class="right-box">
          <div class="lawyer-basic-msg">
            <h2>{{lawyerMsg.name}}</h2>
            <span>{{lawyerMsg.duty}}</span>
            <div class="location">
              <Icon type="ios-pin" class="lawyer-icon"/>
              <span>{{lawyerMsg.location}}</span>
            </div>
            <p v-for="(item, index) in lawyerMsg.domain" :key="index">{{item}}</p>
          </div>

          <div class="work-experience" v-html="lawyerMsg.workExperience"></div>
        </div>
      </div>
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
  name: "lawyerTeamDetail",
  components: {
    Icon
  },
  data() {
    return {
      breadList: [
        {
          path: "/",
          src: require("./../../assets/img/home.png"),
          name: "首页"
        },
        {
          path: "/lawyerTeam",
          name: "律师团队"
        },
        {
          path: `/lawyerTeam/lawyerTeamDetail/${this.$route.params.id}`,
          name: "律师个人信息"
        }
      ],
      lawyerMsg: {
        src: "",
        email: "",
        phone: "",
        print: "",
        name: "",
        duty: "",
        location: "",
        domain: [],
        workExperience: ""
      }
    };
  },
  created() {
    this._fetchLawyerDetail();
  },
  methods: {
    async _fetchLawyerDetail() {
      let params = {
        id: this.$route.params.id
      };
      const opt = await apiTeammate(params);
      if (opt.items.length) {
        let arr = opt.items.map(item => {
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          let domain = item.subCategoryQueryVoList.map(ele => {
            return ele.name;
          });
          return {
            src: item.photoFileId,
            email: item.email,
            phone: item.phone,
            print: item.fax,
            name: item.name,
            duty: item.duty,
            location: item.city,
            domain: domain,
            workExperience: item.remark
          };
        });
        this.lawyerMsg = arr[0];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.lawyer-detail-box
  .detail-box
    .bread-box
      margin-left 0.39rem
  .detail-main-box
    margin-bottom 0.4rem
    .left-box
      box-shadow 0 0.12rem 0.3rem 0 rgba(0, 0, 0, 0.12)
      border-radius 0.03rem
      vertical-align top
      height 6.02rem
      .lawyer-pic
        width 3.23rem
        height 4.13rem
        margin-bottom 0.14rem
        overflow hidden
        img
          height 100%
      .contact-msg
        width 2.75rem
        margin 0 auto
        vertical-align middle
        font-size 0.15rem
        margin-bottom 0.09rem
        img
          vertical-align middle
    .right-box
      width 7.85rem
      margin-left 0.87rem
      padding 0.36rem 0 0.64rem 0
      .lawyer-basic-msg
        padding-bottom 0.4rem
        border-bottom 0.03rem dashed rgba(197, 197, 197, 1)
        margin-bottom 0.3rem
        h2
          display inline-block
          font-size 0.31rem
          margin-right 0.15rem
          font-weight 500
        span
          font-size 0.18rem
        .location
          display flex
          align-items center
          margin-top 0.31rem
          .lawyer-icon
            color #3f51b5
            font-size 0.18rem
          span
            font-size 0.16rem
        p
          display inline-block
          background rgba(242, 243, 244, 1)
          border-radius 0.03rem
          padding 0.05rem 0.1rem
          margin 0.29rem 0.1rem 0 0
      .work-experience
        margin-bottom 0.35rem
        font-size 0.16rem
        dt
          font-size 0.2rem
          color #3f51b5
          font-weight 400
          img
            vertical-align middle
        dd
          font-size 0.15rem
          color rgba(51, 51, 51, 1)
          padding-left 0.15rem
</style>
