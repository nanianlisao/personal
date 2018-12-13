<template>
  <div class="wxchat">
    <scroll class="wxchat-wrapper" ref="scroll">
      <div ref="page">
        <div class="banner">
          <img v-lazy="data.topImg" alt="" width="100%">
        </div>
        <section>
          <div class="title">小程序生态现状</div>
          <div class="midimg-wrap">
            <img v-lazy="data.midImg" alt="" width="100%">
          </div>
        </section>
        <section>
          <div class="title">集梦小程序</div>
          <ul class="program-list">
            <li v-for="(item, index) in miniProgram" :key="item.name" class="program-item">
              <div class="box" @click="scaleImg(index)">
                <div :class="['img-box',{scale:item.scale}]">
                  <img v-lazy="item.img" alt="" width="100%">
                  <transition name="fade">
                    <img :src="item.code" alt="" width="100%" class="code" v-show="item.scale">
                  </transition>
                </div>
              </div>
              <div class="program-name">{{item.name}}</div>
            </li>
          </ul>
        </section>
        <section>
          <div class="title">项目案例</div>
          <div class="demo-wrapper">
            <div class="demo-tab">
              <span :class="['tab-item',{active:currentTab === index}]" v-for="(item,index) in data.demo" :key="item.name" @click="changeTab(index)">{{item.name}}</span>
            </div>
            <!-- <transition name="fade"> -->
            <div class="demo-content" v-for="(item,index) in data.demo" :key="item.name" v-show="index === currentTab">
              <div class="demo-imgBox" v-for="img in item.imgs" :key="img">
                <img v-lazy="img" alt="" width="100%">
              </div>
            </div>
            <!-- </transition> -->
          </div>
        </section>
        <section>
          <div class="title">版本报价</div>
          <ul class="baojia-list">
            <li :class="['baojia-item',{run:item.run}]" @click="flop(index)" v-for="(item,index) in baojiaList" :key="index">
              <div class="positive">
                <div class="img-box">
                  <img v-lazy="item.img" alt="" width="100%" />
                </div>
                <h3>{{item.title}}</h3>
                <p class="price-item" v-for="price in item.content" :key="price.name" v-if="index!==2">
                  <span>{{price.name}}</span>
                  <span>￥{{price.val}}</span>
                </p>
                <p v-if="index===2" class="des">{{item.des}}</p>
              </div>
              <div class="negative">
                <ul v-if="index!==2">
                  <li class="sever-item" v-for="sever in item.sever" :key="sever">{{sever}}</li>
                </ul>
                <div class="remark" v-if="index===2">
                  <div class="remark-item" v-for="remark in item.remark" :key="remark">
                    {{remark}}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <div class="friend-link">
          <p class="title">金牌项目 诚邀代理</p>
          <p class="mark">移动电商、O2O、新零售行业、展示、互动、推广、交易必选利器</p>
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
import data from './data.js'
export default {
  data() {
    return {
      data: data,
      miniProgram: [],
      baojiaList: [],
      currentTab: 0,
      scale: false,
      imgsArr: [],
      finish: true // 控制进度条
    }
  },
  created() {
    this.miniProgram = [...data.miniProgram]
    this.baojiaList = [...data.baojia]
    this.$nextTick(() => {
      this.getImgsArr()
    })
  },
  methods: {
    changeTab(index) {
      this.currentTab = index
    },
    scaleImg(index) {
      let data = [...this.miniProgram]
      data[index].scale = !data[index].scale
      this.miniProgram = data
    },
    flop(index) {
      this.baojiaList[index].run = !this.baojiaList[index].run
    },
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
  watch: {},
  components: {
    mFooter,
    Scroll,
    Loading
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@themeColor: #de541e;
.bor-bottom {
  border-bottom: 0.01rem solid rgba(7, 17, 27, .2);
}

.wxchat {
  position: fixed;
  top: 0.6rem;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5;
  .wxchat-wrapper {
    height: 100%;
    overflow: hidden;
    section {
      padding-top: 0.3rem;
      .title {
        width: 90%;
        margin: 0 auto;
        box-sizing: border-box;
        position: relative;
        padding-left: 0.1rem;
        font-size: 0.15rem;
        line-height: 0.25rem;
        color: #333;
        &:before {
          content: '';
          position: absolute;
          top: 0.05rem;
          left: 0;
          width: 0.04rem;
          height: 0.15rem;
          background-color: @themeColor;
        }
      }
      .midimg-wrap {
        margin-top: 0.2rem;
      }
      .program-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 0.1rem;
        .program-item {
          width: 0.6rem;
          margin-top: 0.1rem;
          .box {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.6rem;
            background-color: #fff;
            font-size: 0;
            .img-box {
              position: relative;
              width: 50%;
              height: 50%;
              transition: all 0.3s;
              font-size: 0;
              &.scale {
                // width: 90%;
                // height: 90%;
                transform: scale(1.8);
              }
              .code {
                position: absolute;
                top: 0;
                left: 0;
              }
            }
          }
          .program-name {
            text-align: center;
            font-size: 0.12rem;
            line-height: 0.18rem;
            margin-top: 0.05rem;
          }
        }
      }
      .demo-wrapper {
        margin-top: 0.1rem;
        .demo-tab {
          display: flex;
          padding: 0 5%;
          justify-content: space-between;
          position: relative;
          bottom: -0.17rem;
          .tab-item {
            width: 1.05rem;
            line-height: 0.34rem;
            font-size: 0.12rem;
            background-color: @themeColor;
            color: #fff;
            text-align: center;
            transition: all 0.3s;
            z-index: 10;
            &.active {
              background-color: #fff;
              color: #333;
            }
          }
        }
        .demo-content {
          background-color: #fff;
          padding: 0.3rem 5% 0.2rem;
          display: flex;
          justify-content: space-between;
          transition: all 0.3s;
          .demo-imgBox {
            width: 1.02rem;
            height: 1.83rem;
          }
        }
      }
      .baojia-list {
        display: flex;
        justify-content: space-between;
        padding: 0 5%;
        margin: 0.13rem 0 0.1rem 0;
        .baojia-item {
          width: 1.02rem;
          height: 2rem;
          box-shadow: 0.01rem 0.02rem 0.05rem #ccc;
          position: relative;
          .positive {
            overflow: hidden;
            height: 100%;
            background-color: #fff;
            color: #333;
            transition: all 0.3s;
            transform: rotateY(0deg);
            -webkit-backface-visibility: hidden;
            .img-box {
              width: 0.42rem;
              height: 0.42rem;
              margin: 0.16rem auto 0.08rem;
              font-size: 0;
            }
            h3 {
              font-size: 0.14rem;
              line-height: 0.22rem;
              text-align: center;
            }
            .price-item {
              text-align: center;
              font-size: 0.12rem;
              line-height: 0.18rem;
              margin-top: 0.04rem;
              span {
                &:first-child {
                  margin-right: 0.03rem;
                }
              }
            }
            .des {
              text-align: center;
              font-size: 0.12rem;
              line-height: 0.18rem;
              margin-top: 0.04rem;
            }
          }
          .negative {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding-top: 0.12rem;
            background-color: @themeColor;
            color: #fff;
            transition: all 0.3s;
            transform: rotateY(180deg);
            z-index: -1;
            .sever-item {
              position: relative;
              padding-left: 0.26rem;
              font-size: 0.12rem;
              line-height: 0.18rem;
              &:before {
                position: absolute;
                content: '';
                top: 0.07rem;
                left: 0.16rem;
                width: 0.04rem;
                height: 0.04rem;
                background-color: #fff;
                border-radius: 0.02rem;
              }
            }
            .remark {
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              .remark-item {
                font-size: 0.12rem;
                line-height: 0.18rem;
                text-align: center;
                margin-bottom: 0.06rem;
              }
            }
          }
          &.run {
            .positive {
              transform: rotateY(180deg);
            }
            .negative {
              transform: rotateY(0deg);
            }
          }
        }
      }
    }
    .friend-link {
      background: url('https://wmx.njdream.cn/website/wechat/wechat_banner_bottom.png') no-repeat center center;
      background-size: cover;
      height: 0.94rem;
      overflow: hidden;
      text-align: center;
      .title {
        font-size: 0.12rem;
        color: @themeColor;
        font-weight: 700;
        margin-top: 0.34rem;
      }
      .mark {
        color: #333;
        font-size: 0.1rem;
        margin-top: 0.1rem;
      }
    }
  }
}

.fade-enter-active {
  transition: all .3s ease;
}

.fade-leave-active {
  transition: all .3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
