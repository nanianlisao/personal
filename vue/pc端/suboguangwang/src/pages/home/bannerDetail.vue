<template>
  <div class="detail-box">
    <div class="detail-us-box all-main-box">
      <w-bread :breadList="breadList"></w-bread>
      <div class="company-introduce">
        <div class="msg-title title">
          <h2>{{detailName}}</h2>
        </div>
        <div class="main-msg" v-html="detailUs"></div>
      </div>
    </div>
    <w-footer></w-footer>
  </div>
</template>

<script>
import { storage } from 'utils/storage'
export default {
  name: 'bannerDetail',
  data () {
    return {
      breadList: [
        {
          path: '/',
          src: require('./../../assets/img/home.png'),
          name: '首页'
        },
        {
          path: `/home/bannerDetail/${this.$route.params.id}`,
          name: '详情'
        }
      ],
      detailUs: '',
      detailName: ''
    }
  },
  created() {
    this._fetchAboutUs()
  },
  methods: {
    _fetchAboutUs() {
      const obj = storage.get('bannerDetail')
      if (obj.name) {
        this.detailUs = obj.detail
        this.detailName = obj.name
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .detail-box
    background #F1F0F5
    width 100%
    .detail-us-box
      padding-top .01rem
      .company-introduce
        background #ffffff
        padding .64rem 1.59rem 1.04rem 1.59rem
        margin-bottom 0.56rem
        .msg-title
          border-bottom .01rem solid rgba(240,241,245,1)
          height .45rem
          text-align center
        .main-msg
          margin-top .40rem
          font-size .16rem
</style>
