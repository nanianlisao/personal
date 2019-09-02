<template>
  <div class="recommend">
    <scroll class="recommend-content" :data.sync="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slide>
            <div v-for="(item,index) in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" :alt="index" @load="loadImage">
              </a>
            </div>
          </slide>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in discList" :key="item.dissid">
              <div class="icon">
                <img width="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading> </loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Slide from '@/base/slide/slide'
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'
import axios from 'axios'
import qs from 'qs'
import getDiscList from '@/base/data.js'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
export default {
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      setTimeout(() => {
        this.discList = getDiscList
      }, 1000)
      // getDiscList().then(res => {
      //   console.log(res)
      // })
      let jsonData = {
        appId: 62,
        currentPage: 1,
        pageSize: 10,
        totalRows: 1
      }
      let data = qs.stringify(jsonData)
      axios.post('nj/api/theme/themeTypeList', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).then((res) => {
        console.log(res)
      })
      // axios.get('qqy/soso/fcgi-bin/search_for_qq_cp?w=1&n=10&p=1').then(res => {
      //   console.log(res)
      // })
    },
    loadImage() {
      if (!this.checkloaded) {
        this.$refs.scroll.refresh()
        this.checkloaded = true
      }
    }
  },
  components: {
    Slide,
    Scroll,
    Loading
  }
}

</script>
<style lang="less" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: 14px;
        color: #ffcd32;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: 14px;
          .name {
            margin-bottom: 10px;
            color: #fff;
          }
          .desc {
            color: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}

</style>
