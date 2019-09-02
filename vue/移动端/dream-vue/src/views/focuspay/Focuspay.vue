<template>
  <div class="advert">
    <scroll class="advert-wrapper" ref="scroll">
      <div ref="page">
        <div class="content">
          <!-- banner -->
          <div class="banner">
            <img src="https://wmx.njdream.cn/website/focuspay/banner_top.png" alt="" width="100%">
          </div>
          <!-- 支付方式 -->
          <div class="method">
            <div class="title">支付方式</div>
            <ul class="method-list">
              <li class="method-item" v-for="method in methods" :key="method.name">
                <div class="img-box">
                  <img v-lazy="method.img" alt="" width="100%" height="100%">
                </div>
                <div class="method-right">
                  <div class="method-title">{{method.name}}</div>
                  <div class="method-info">{{method.val}}</div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 营销功能 -->
          <div class="function">
            <div class="title">营销功能</div>
            <div class="function-img">
              <img src="https://wmx.njdream.cn/website/focuspay/sell-work.png" alt="" width="100%">
            </div>
          </div>
          <!-- 合作伙伴 -->
          <div class="demos">
            <div class="title">合作伙伴</div>
            <ul class="demo-list">
              <li class="img-box" v-for="demo in demos" :key="demo">
                <img v-lazy="demo" alt="" width="100%" height="100%">
              </li>
            </ul>
          </div>
        </div>
        <m-footer></m-footer>
      </div>
    </scroll>
    <div class="loading" v-show="finish">
      <loading @hide="hidden" @refresh="refresh" :imgsArr="imgsArr" v-if="imgsArr.length"></loading>
    </div>
  </div>
</template>
<script>
import mFooter from 'components/m-footer/m-footer'
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import { demos, methods } from './data.js'
export default {
  name: 'Focuspay',
  data() {
    return {
      imgsArr: [],
      finish: true, // 控制进度条
      demos: demos,
      methods: methods
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
    Loading
  }
}

</script>
<style lang="less" scoped>
@themeColor: #de541e;
.advert {
  position: fixed;
  top: 0.6rem;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5;
  .advert-wrapper {
    height: 100%;
    overflow: hidden;
    .title {
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      position: relative;
      padding-left: 0.1rem;
      font-size: 0.18rem;
      line-height: 0.28rem;
      color: #333;
      &:before {
        content: '';
        position: absolute;
        top: 0.05rem;
        left: 0;
        width: 0.04rem;
        height: 0.18rem;
        background-color: @themeColor;
      }
    }
    .banner {
      font-size: 0;
      width: 100%;
    }
    .method {
      overflow: hidden;
      padding: 0.18rem 5%;
      .method-list {
        margin-top: 0.1rem;
        .method-item {
          display: flex;
          align-items: center;
          padding: 0.1rem 0;
          border-top: 0.01rem solid #ccc;
          .img-box {
            width: 0.67rem;
            height: 0.838rem;
            font-size: 0;          }
          .method-right{
            margin-left: 0.1rem;
            color: #333;
            .method-title{
              font-size: 0.14rem;
            }
            .method-info{
              font-size: 0.12rem;
              margin-top: 0.12rem;
            }
          }
        }
      }
    }
    .function{
      background-color: #fff;
      overflow: hidden;
      padding: 0.2rem 5%;
      .function-img{
        width: 3rem;
        font-size: 0;
        margin: 0.15rem 0 0 .34rem;
      }
    }
    .demos {
      padding: 0.32rem 5%;
      overflow: hidden;
      .demo-list {
        margin-top: 0.1rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .img-box {
          width: 0.77rem;
          height: 0.417rem;
          font-size: 0;
          margin-top: 0.08rem;
        }
      }
    }
  }
}

</style>
