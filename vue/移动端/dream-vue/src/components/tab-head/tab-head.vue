<template>
  <div class="header">
    <div class="nav">
      <div class="logo">
        <img :src="logoImg" alt="logo" width="100%">
      </div>
      <button :class="['change',{'show':show}]" @click.stop="changePage">
        <span></span>
        <span></span>
      </button>
    </div>
    <transition name="fade">
      <ul class="tab" v-if="show" @click.stop="hideTab">
        <li>
          <router-link tag="div" class="tab-item" to="/home">
            <span class="tab-link">首页</span>
          </router-link>
        </li>
        <li>
          <router-link tag="div" class="tab-item" to="/wechat">
            <span class="tab-link">微信小程序</span>
          </router-link>
        </li>
        <li>
          <router-link tag="div" class="tab-item" to="/advert">
            <span class="tab-link">朋友圈广告</span>
          </router-link>
        </li>
        <li>
          <router-link tag="div" class="tab-item" to="/focuspay">
            <span class="tab-link">集付</span>
          </router-link>
        </li>
      </ul>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logoImg: require('./index_logo.png'),
      show: false
    }
  },
  methods: {
    changePage() {
      this.show = !this.show
    },
    hideTab() {
      this.show = false
    }
  }
}

</script>
<style lang="less" scoped>
.bor-bottom {
  border-bottom: 0.01rem solid rgba(7, 17, 27, .2);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  background-color: #fff;
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.6rem;
    padding: 0 5%;
    .bor-bottom();
    .logo{
      width: 1.4rem;
    }
    .change {
      width: 0.4rem;
      height: 0.4rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      &.show {
        span {
          &:first-child {
            transform: rotate(-45deg) translateY(0.06rem);
          }
          &:last-child {
            transform: rotate(45deg) translateY(-0.06rem);
          }
        }
      }
      span {
        width: 0.25rem;
        height: 0.02rem;
        background-color: #333;
        transition: all 0.3s;
        &:first-child {
          margin-bottom: 0.06rem;
        }
      }
    }
  }
  .tab {
    width: 100%;
    &.none {
      display: none;
    }
    .tab-item {
      line-height: 0.6rem;
      font-size: 0.16rem;
      color: #333;
      text-align: left;
      padding-left: 5%;
      .bor-bottom();
      &.router-link-active {
        .tab-link {
          color: #ea5520;
        }
      }
    }
  }
}

.fade-enter-active {
  transition: all .3s ease;
}

.fade-leave-active {
  transition: all 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
