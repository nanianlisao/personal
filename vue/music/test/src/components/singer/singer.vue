<template>
  <div class="singer">
    <list-view :data="singers" @select="goSingerDetail"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from '@/common/js/singer'
import ListView from '@/base/listview/listview'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.map((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            mid: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_id,
          name: item.Fsinger_name,
          mid: item.Fsinger_mid
        }))
      })
      console.log(map)
      // 为了得到有序列表 我们需要来处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (/[a-zA-Z]/.test(val.title)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      return [...hot, ...ret]
    },
    goSingerDetail(item) {
      console.log(item)
      this.$router.push({
        path: `/singer/${item.id}`
      })
    }
  },
  components: {
    ListView
  }
}

</script>
<style lang="less" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}

</style>
