<template>
  <div class="advert">
    <scroll class="advert-wrapper" ref="scroll">
      <div ref="page">
        <div class="content">
          <!-- 广告形态 -->
          <div class="shape">
            <img v-lazy="shapeImg" alt="" width="100%" height="100%">
          </div>
          <!-- 推广目标 -->
          <div class="target">
            <img v-lazy="targetImg" alt="" width="100%" height="100%">
          </div>
          <!-- 投放形式 -->
          <div class="delivery">
            <div class="title">投放形式</div>
            <ul class="delivery-list">
              <li :class="['delivery-item',{run:item.run}]" @click="flop(index)" v-for="(item,index) in deliverise" :key="index">
                <div class="positive">
                  <div class="img-box">
                    <img v-lazy="item.img" alt="" width="100%" height="100%">
                  </div>
                  <h3 class="item-title">{{item.title}}</h3>
                  <div class="delivery-method-list">
                    <div class="delivery-method" v-for="method in item.methods" :key="method">{{method}}</div>
                  </div>
                </div>
                <div class="negative">
                  <div class="item-title">{{item.title}}</div>
                  <div class="action-list">
                    <div class="action-item" v-for="action in item.actions" :key="action">{{action}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分地域进价 -->
          <div class="area">
            <div class="title">分地域进价</div>
            <div class="tbody">
              <div class="tr" v-for="area in areaList" :key="area.name">
                <div class="key">{{area.name}}</div>
                <div class="val">{{area.city}}</div>
              </div>
            </div>
          </div>
          <!-- 项目案例 -->
          <div class="demos">
            <div class="title">项目案例</div>
            <div class="demo-list">
              <div class="img-box" v-for="demo in demos" :key="demo">
                <img v-lazy="demo" alt="" width="100%" height="100%">
              </div>
            </div>
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
import { deliverise, areaList, demos } from './data.js'
export default {
  name: 'Advert',
  data() {
    return {
      imgsArr: [],
      finish: true, // 控制进度条
      deliverise: deliverise,
      areaList: areaList,
      demos: demos,
      shapeImg: 'https://wmx.njdream.cn/website/advert/advert_product@2x.png',
      targetImg: 'https://wmx.njdream.cn/website/advert/advert_extension@2x.png'
    }
  },
  created() {
    this.$nextTick(() => {
      this.getImgsArr()
    })
  },
  methods: {
    flop(index) {
      this.deliverise[index].run = !this.deliverise[index].run
    },
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
      width: 90%;
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
    .shape {
      padding: 0.16rem 5% 0.33rem 5%;
      height: 2.33rem;
      box-sizing: border-box;
      background-color: #fff;
    }
    .target {
      margin-top: 0.2rem;
      padding: 0.32rem 5% 0.32rem 5%;
      background-color: #fff;
      box-sizing: border-box;
      height: 2.27rem;
    }
    .delivery {
      padding-top: 0.3rem;
      .delivery-list {
        display: flex;
        justify-content: space-between;
        padding: 0 5%;
        margin: 0.18rem 0 0.1rem 0;
        .delivery-item {
          width: 1.6rem;
          height: 2.15rem;
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
              width: 0.49rem;
              height: 0.33rem;
              margin: 0.28rem auto 0.11rem;
            }
            .item-title {
              font-size: 0.14rem;
              line-height: 0.21rem;
              color: #333;
              font-weight: bold;
              text-align: center;
            }
            .delivery-method-list {
              overflow: hidden;
              .delivery-method {
                margin: 0.08rem 0;
                text-align: center;
                font-size: 0.12rem;
                line-height: 0.16rem;
                color: #666;
              }
            }
          }
          .negative {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-color: @themeColor;
            color: #fff;
            transition: all 0.3s;
            transform: rotateY(180deg);
            z-index: -1;
            color: #fff;
            .item-title {
              font-size: 0.14rem;
              line-height: 0.21rem;
              font-weight: bold;
              text-align: center;
              margin-top: 0.1rem;
            }
            .action-list {
              margin-top: 0.14rem;
              .action-item {
                position: relative;
                padding: 0 0.05rem 0 0.18rem;
                line-height: 0.24rem;
                font-size: 0.12rem;
                &:before {
                  position: absolute;
                  content: '';
                  top: 0.1rem;
                  left: 0.06rem;
                  width: 0.04rem;
                  height: 0.04rem;
                  background-color: #fff;
                  border-radius: 0.02rem;
                }
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
    .area {
      background-color: #fff;
      margin-top: 0.38rem;
      padding-top: 0.2rem;
      overflow: hidden;
      .tbody {
        margin: 0.18rem 5% 0.25rem;
        border: 0.01rem solid #ccc;
        color: #333;
        .tr {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:not(:last-child) {
            border-bottom: 0.01rem solid #ccc;
          }
          .key {
            width: 1rem;
            flex-shrink: 0;
            font-size: 0.15rem;
            padding: 0.16rem 0;
            text-align: center;
          }
          .val {
            flex: 1;
            flex-shrink: 0;
            font-size: 0.12rem;
            padding: 0.16rem 0.1rem;
            line-height: 0.2rem;
            border-left: 0.01rem solid #ccc;
          }
        }
      }
    }
    .demos {
      padding: 0.32rem 0 0.1rem 0;
      overflow: hidden;
      .demo-list {
        margin-top: 0.16rem;
        padding: 0 5%;
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
