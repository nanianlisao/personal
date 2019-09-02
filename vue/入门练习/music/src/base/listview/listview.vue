<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
    <ul>
      <li class="list-group" v-for="group in data" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" :key="item.id" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li :class="['item',{'current':index===currentIndex}]" v-for="(item, index) in shortcutList" :key="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
const ANCHOR_HEIGHT = 18
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      const { index } = e.target.dataset
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = index
      this._scrollTo(index)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let index = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(index)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectItem(item) {
      this.$emit('select', item)
    },
    _scrollTo(index) {
      if (index < 0) {
        index = 0
      } else if (index > this.$refs.listGroup.length - 1) {
        index = this.$refs.listGroup.length - 1
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      this.currentIndex = parseInt(index)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => group.title.substr(0, 1))
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 滚动到顶部 高亮显示第一个
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY > height1 && -newY < height2)) {
          this.currentIndex = i
          return
        }
      }
      // 滚动到最底部的位置 取最后一位
      this.currentIndex = this.$refs.listGroup.length - 1
    }
  },
  components: {
    Scroll
  }
}

</script>
<style lang="less" scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #222;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      background: #333;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      list-style: none;
      &.current {
        color: #ffcd32;
      }
    }
  }
}

</style>
