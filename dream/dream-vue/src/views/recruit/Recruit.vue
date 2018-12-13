<template>
  <div>
    <div class="recruit">
      <scroll class="recruit-wrapper" ref="scroll">
        <div ref="page">
          <div class="banner">
            <img src="https://wmx.njdream.cn/website/recruit/recruit_banner.png" alt="" width="100%">
            <img :src="joinSrc" alt="" class="join">
          </div>
          <section class="jobs-wrapper">
            <div class="job-box" v-for="(job, jobIndex) in jobs" :key="job.codeName">
              <div class="job-content">
                <header>{{job.position}}</header>
                <div class="job-content-item">
                  <div class="job-content-item-title">岗位职责</div>
                  <ul class="job-content-item-info">
                    <li v-for="(duty, ind) in job.duty" :key="ind">{{ind + 1}}、{{duty}}</li>
                  </ul>
                </div>
                <div class="job-content-item">
                  <div class="job-content-item-title">任职要求</div>
                  <ul class="job-content-item-info">
                    <li v-for="(require, ind) in job.require" :key="ind">{{ind + 1}}、{{require}}</li>
                  </ul>
                </div>
                <div class="apply">
                  <span @click="_apply(jobIndex)">申请职位</span>
                </div>
              </div>
            </div>
          </section>
          <m-footer></m-footer>
        </div>
      </scroll>
      <div class="loading" v-show="finish">
        <loading @hide="hidden" @refresh="refresh" :imgsArr="imgsArr" v-if="imgsArr.length"></loading>
      </div>
    </div>
    <transition name="form-fade">
      <div class="job-form" v-show="position">
        <div class="layout" @click="_hideForm"></div>
        <div class="form-wrap">
          <div class="title">申请岗位</div>
          <div class="remark">{{position}}</div>
          <ul class="form-list">
            <li class="form-item" v-for="form in forms" :key="form.name">
              <img :src="form.icon" alt="">
              <input type="text" :placeholder="form.name">
              <span v-if="form.require">*</span>
            </li>
          </ul>
          <div class="submit">提交</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Scroll from 'components/scroll/scroll'
import Loading from 'components/loading/loading'
import mFooter from 'components/m-footer/m-footer'
import { jobs, forms } from './data'
export default {
  name: 'recruit',
  data() {
    return {
      finish: true,
      imgsArr: [],
      joinSrc: require('./join.png'),
      jobs: jobs,
      forms: forms,
      position: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.getImgsArr()
    })
  },
  methods: {
    _apply(index) {
      this.position = this.jobs[index].position
    },
    _hideForm() {
      this.position = ''
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
  components: {
    mFooter,
    Scroll,
    Loading
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@themeColor: #fc5919;
.bor-bottom {
  border-bottom: 0.01rem solid rgba(7, 17, 27, .2);
}

.recruit {
  position: fixed;
  top: 0.6rem;
  bottom: 0;
  width: 100%;
  .recruit-wrapper {
    height: 100%;
    overflow: hidden;
    .banner {
      position: relative;
      .join {
        position: absolute;
        top: 0.48rem;
        left: 0.56rem;
        width: 0.94rem;
      }
    }
    .jobs-wrapper {
      padding: 0.25rem 5%;
      .job-box {
        .job-content {
          padding: 0.25rem 5%;
          header {
            font-size: 0.15rem;
            font-weight: bold;
            color: #333;
            padding-bottom: 0.15rem;
            .bor-bottom();
          }
          .job-content-item {
            margin: 0.15rem 0;
            .job-content-item-title {
              font-size: 0.12rem;
              font-weight: bold;
              color: #333;
              margin-bottom: 0.1rem;
            }
            .job-content-item-info {
              li {
                font-size: 0.1rem;
                color: #666;
                line-height: 0.18rem;
              }
            }
          }
          .apply {
            border-top: 0.01rem solid rgba(7, 17, 27, .2);
            padding: 0.2rem 0.2rem 0 0;
            text-align: right;
            span {
              display: inline-block;
              width: 0.82rem;
              line-height: 0.357rem;
              text-align: center;
              font-size: 0.12rem;
              color: @themeColor;
              border-radius: 0.04rem;
              border: 0.01rem solid @themeColor;
            }
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

.job-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  z-index: 100;
  background-color: rgba(7, 17, 27, .5);
  .layout {
    width: 100%;
    height: 100%;
  }
  .form-wrap {
    position: absolute;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    padding: 0.2rem 12%;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    max-height: 5rem;
    .title {
      font-size: 0.15rem;
      color: @themeColor;
      margin-bottom: 0.1rem;
    }
    .remark {
      font-size: 0.12rem;
      height: 0.18rem;
      line-height: 0.18rem;
      color: #666;
      margin-bottom: 0.07rem;
    }
    .form-list {
      font-size: 0.12rem;
      .form-item {
        display: flex;
        align-items: center;
        position: relative;
        border: 0.01rem solid #999;
        border-radius: 0.02rem;
        margin-bottom: 0.1rem;
        line-height: 0.34rem;
        height: 0.34rem;
        &:last-child {
          margin-bottom: 0;
        }
        img {
          width: 0.16rem;
          height: 0.16rem;
          margin-left: 0.07rem;
        }
        input {
          width: 1.46rem;
          padding: 0 0.2rem 0 0.1rem;
          box-sizing: border-box;
        }
        span {
          position: absolute;
          right: 0.1rem;
          font-size: 0.1rem;
          color: @themeColor;
          caret-color: red;
        }
      }
    }
    .submit {
      width: 1rem;
      line-height: 0.34rem;
      background: @themeColor;
      color: #fff;
      font-size: 0.12rem;
      text-align: center;
      margin: 0.1rem auto 0;
    }
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all .3s ease;
}

.form-fade-enter,
.form-fade-leave-to {
  opacity: 0;
}

</style>
