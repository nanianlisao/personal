<template>
  <div class="about">
    <scroll class="about-wrapper" ref="scroll">
      <div ref="page">
        <div class="introduct">
          <img :src="bannerImg" alt="" width="100%">
          <div class="intro-info">
            <div class="title">集梦简介</div>
            <div class="remark">专业智能整合方案服务机构</div>
            <div class="intro-text">
              <p>南京集梦文化传媒有限公司成立于2011年，是一家集" 移动互联、移动支付、新媒体运营 "三大支撑业务为主体的科技型公司，6年来，通过公司所有员工的付出与努力，现在在南京已经有一定影响力，公司与腾讯、阿里巴巴、支付宝、中国银联、南京广电、江苏卫视等企业一直保持着良好的合作关系。</p>
              <p>集梦，是一个信念坚定的团队；集梦，是一个敢想敢干的团队；集梦人，心怀梦想、脚踏实地，为着梦想，一起打拼！欢迎所有怀有梦想的伙伴加入我们集梦团队，让我们踏着力气踩着梦，我们会变成巨人...... </p>
            </div>
          </div>
        </div>
        <div class="develop">
          <header class="title">发展历程</header>
          <img :src="devImg" alt="" width="100%">
        </div>
        <div class="connect">
          <header class="title">联系我们</header>
          <div class="info-list">
            <p class="info-item">南京集梦文化传媒有限公司</p>
            <p class="info-item">合作热线：4008-123-686</p>
            <p class="info-item">邮箱：dream_hz@aliyun.com</p>
            <p class="info-item">网址：www.njdream.cn</p>
            <p class="info-item">地址：南京市秦淮区中华路420号江苏科技创业大厦703室</p>
          </div>
        </div>
        <foot-map class="foot-map"></foot-map>
        <m-footer></m-footer>
      </div>
    </scroll>
    <div class="loading" v-show="finish">
      <loading @hide="hidden" @refresh="refresh" :imgsArr="imgsArr" v-if="imgsArr.length"></loading>
    </div>
  </div>
</template>
<script>
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import mFooter from 'components/m-footer/m-footer'
import footMap from 'components/foot-map/foot-map'
export default {
  name: 'about',
  data() {
    return {
      finish: true,
      imgsArr: [],
      bannerImg: 'https://wmx.njdream.cn/website/about/info_banner@2x.png',
      devImg: 'https://wmx.njdream.cn/website/about/info_develop@2x.png'
    }
  },
  created() {
    this.$nextTick(() => {
      this.getImgsArr()
    })
  },
  methods: {
    getImgsArr() {
      let dom = this.$refs.page
      let imgs = dom.getElementsByTagName('img')
      this.imgsArr = Array.from(imgs)
    },
    loadImage() {
      if (!this.checkloaded) {
        this.$refs.scroll.refresh()
        this.checkloaded = true
      }
    },
    refresh() {
      this.$refs.scroll.refresh()
    },
    // 隐藏进度条
    hidden() {
      this.finish = false
    }
  },
  components: {
    mFooter,
    Scroll,
    Loading,
    footMap
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@themeColor: #fc5919;
.bor-bottom {
  border-bottom: 0.01rem solid rgba(7, 17, 27, .2);
}

.about {
  position: fixed;
  top: 0.6rem;
  bottom: 0;
  width: 100%;
  .about-wrapper {
    height: 100%;
    overflow: hidden;
    .introduct {
      font-size: 0;
      .intro-info {
        padding: 0.12rem 0.22rem 0.22rem;
        background-color: #323232;
        color: #fff;
        .title {
          font-size: 0.15rem;
          text-align: center;
        }
        .remark {
          text-align: center;
          font-size: 0.13rem;
          margin-top: 0.1rem;
          color: #d5a58c;
        }
        .intro-text {
          position: relative;
          margin-top: 0.12rem;
          p {
            font-size: 0.1rem;
            text-indent: 0.08rem;
            margin-bottom: 0.07rem;
          }
          &:before {
            content: '“';
            font-size: 0.2rem;
            position: absolute;
            top: -0.15rem;
            left: -0.05rem;
          }
          &:after {
            content: '”';
            font-size: 0.2rem;
            position: absolute;
            bottom: -0.15rem;
            right: -0.05rem;
          }
        }
      }
    }
    .develop {
      padding: 0.22rem 5%;
      font-size: 0;
      .title {
        font-size: 0.15rem;
        color: #323232;
        text-align: center;
        margin-bottom: 0.18rem;
      }
    }
    .connect {
      .title {
        font-size: 0.15rem;
        color: #323232;
        text-align: center;
        margin-bottom: 0.25rem;
      }
      .info-list {
        padding: 0 0.47rem;
        .info-item{
          color: #333;
          font-size: 0.11rem;
          margin-bottom: 0.07rem;
        }
      }
    }
  }
  .foot-map{
    margin-bottom: 0.1rem;
  }
  .loading {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: #fff;
  }
}

</style>
