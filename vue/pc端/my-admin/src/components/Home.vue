<template>
  <el-container class="home-warpper">
    <el-header class="top-header" height="44px">
      <div class="app-name">
        餐协招牌菜
      </div>
      <div class="top-header-setup">
        <div class="admin-level">超级管理员</div>
        <el-dropdown>
          <div class="el-dropdown-link admin-name">
            nanda666<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item>切换账户</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="el-icon-message"></i>
        <el-dropdown>
          <div class="el-dropdown-link admin-name">
            <i class="admin-icon-ren"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>默认(黑色)</el-dropdown-item>
            <el-dropdown-item>红色</el-dropdown-item>
            <el-dropdown-item>蓝色</el-dropdown-item>
            <el-dropdown-item>绿色</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto" class="aside">
        <div class="menu-toggle" @click.prevent="triggleCollapse">
          <img :src="logo" alt="" v-show="!isCollapse" height="40">
          <img :src="logo2" alt="" v-show="isCollapse" height="40">
          <!--    <i class="el-icon-d-arrow-left" v-show="!isCollapse"></i>
          <i class="el-icon-d-arrow-right" v-show="isCollapse"></i> -->
        </div>
        <el-menu :default-active="defaultActiveIndex" class="el-menu-vertical-demo" @select="handleSelect" @close="handleClose" :collapse="isCollapse">
          <el-menu-item index="0" @click="jumpTo({path:'/desktop/desktop'})">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">菜系管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="jumpTo({path:'/forum/list'})">菜系列表</el-menu-item>
              <el-menu-item index="1-2" @click="jumpTo({path:'/forum/about'})">关于我们</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-3">
              <span slot="title">二级列表</span>
              <el-menu-item index="1-3-1">三级列表1</el-menu-item>
              <el-menu-item index="1-3-2">三级列表2</el-menu-item>
              <el-menu-item index="1-3-3">三级列表3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">评价管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="jumpTo({path:'/comment/list'})">评价列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-picture"></i>
              <span slot="title">图片管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">图片管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span slot="title">优惠券管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click="jumpTo({path:'/ticket/addTicket'})">添加优惠券</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span slot="title">店铺管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">酒店列表</el-menu-item>
              <el-menu-item index="5-2">客房列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-picture"></i>
              <span slot="title">轮播图管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1">轮播图列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">店铺管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">酒店列表</el-menu-item>
              <el-menu-item index="5-2">客房列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="8">
            <template slot="title">
              <i class="el-icon-time"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="8-1">订单列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-col :span="24" class="content-wrapper">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </el-col>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      logo: require('@/assets/index_logo.png'),
      logo2: require('@/assets/index_logo2.png'),
      defaultActiveIndex: '0',
      isCollapse: false
    }
  },
  computed: {
    menuWidth() {
      return this.isCollapse ? 'auto' : '200px'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.defaultActiveIndex = key
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    triggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    jumpTo(url) {
      this.$router.push(url) // 用go刷新
    }
  }
}

</script>
<style lang="less">
.el-menu-vertical-demo.el-menu {
  background-color: transparent;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-item-group__title {
  display: none;
}

.home-warpper {
  overflow: hidden;
  height: 100%;
  .top-header {
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    .app-name {
      line-height: 44px;
      font-size: 16px;
    }
    .top-header-setup {
      display: flex;
      align-items: center;
      cursor: pointer;
      .admin-name {
        color: #fff;
        padding: 0 15px;
      }
    }
  }
  .aside {
    background-color: #eeeeee;
    position: relative;
    &::-webkit-scrollbar {
      display: none;
    }
    .menu-toggle {
      text-align: center;
      font-size: 18px;
      padding: 10px 0;
      border-bottom: 1px solid #fc5919;
    }
  }
  .content-wrapper {
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
  }
}

</style>
