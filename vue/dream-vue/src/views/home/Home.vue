<template>
  <div class="home">
    <scroll class="home-wrapper" ref="scroll">
      <div ref="page">
        <div class="slide-wrapper">
          <!-- 轮播图部分 -->
          <slide>
            <div v-for="(item,index) in swipers" :key="item.id">
              <img class="needsclick" :src="item.src" :alt="index">
            </div>
          </slide>
        </div>
        <div class="content">
          <section class="form">
            <h2>
          联系我们
        </h2>
            <div class="remark">请留您的联系方式我们将尽快与您联系</div>
            <form>
              <div class="form-list">
                <div class="form-item">
                  <div class="img-box">
                    <img src="./icon_info.png" alt="" width="100%" />
                  </div>
                  <input type="text" name="name" placeholder="姓名(必填)" />
                </div>
                <div class="form-item">
                  <div class="img-box">
                    <img src="./icon_phone.png" alt="" width="100%" />
                  </div>
                  <input type="number" name="phone" placeholder="手机(必填)" />
                </div>
                <div class="form-item">
                  <div class="img-box">
                    <img src="./icon_email.png" alt="" width="100%" />
                  </div>
                  <input type="text" name="email" placeholder="邮箱(必填)" />
                </div>
                <div class="button-wrap">
                  <button type="submit">预约咨询</button>
                </div>
              </div>
            </form>
          </section>
          <section class="call-phone">
            <h2>期待您的来电</h2>
            <div class="remark">欢迎拨打免费热线，了解更多服务与产品介绍</div>
            <div class="phone-wrapper">
              <img src="./index_phone.png" alt="" width="40">
              <span class="phone">4008-123-686</span>
              <span class="work-time">我们的工作时间是周一至周六8:30 - 17:30</span>
            </div>
          </section>
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
import Slide from 'components/slide/slide'
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import mFooter from 'components/m-footer/m-footer'
export default {
  name: 'Home',
  data() {
    return {
      msg: '这是home啊',
      swipers: [{
        id: 0,
        src: require('./slide1.png')
      }, {
        id: 1,
        src: require('./slide2.png')
      }, {
        id: 2,
        src: require('./slide3.png')
      }],
      finish: true,
      imgsArr: []
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
    Slide,
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

.home {
  position: fixed;
  top: 0.6rem;
  bottom: 0;
  width: 100%; // height: 100%;
  // padding-top: 60rem;
  .home-wrapper {
    height: 100%;
    overflow: hidden;
    .slide-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .content {
      padding: 0.2rem 5% 0;
      h2 {
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
      .remark {
        font-size: 0.12rem;
        color: #666;
        line-height: 0.18rem;
        margin-top: 0.07rem;
      }
      .form {
        .bor-bottom();
        .form-list {
          width: 2rem;
          margin: 0.1rem auto 0.25rem;
          .form-item {
            padding: 0 0.06rem;
            margin-bottom: 0.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #eee;
            .img-box {
              width: 0.17rem;
            }
            input {
              width: 1.6rem;
              height: 0.34rem;
              line-height: 0.34rem;
              font-size: 0.1rem;
              color: #666;
            }
          }
          .button-wrap {
            text-align: center;
            margin-top: 0.15rem;
            button {
              width: 0.8rem;
              line-height: 0.34rem;
              font-size: 0.12rem;
              color: #fff;
              background-color: @themeColor;
              border-radius: 0.04rem;
            }
          }
        }
      }
      .call-phone {
        padding-top: 0.2rem;
        .phone-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.20rem 0 0.20rem;
          .phone {
            font-size: 0.14rem;
            font-weight: bold;
            color: @themeColor;
            margin-top: 0.08rem;
          }
          .work-time {
            font-size: 0.12rem;
            color: #666;
            margin-top: 0.08rem;
          }
        }
      }
    }
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
