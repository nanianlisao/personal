<template>
  <div class="helper">
    <span class="left">{{unFinishedTodoLength}}项未完成</span>
    <span class="tabs">
    <span v-for="state in states" :key="state.key" :class="[state, filter === state.key ? 'actived' : '']" @click="toggleFilter(state.key)">{{state.name}}</span>
    </span>
    <span class="clear" @click="clearAllCompleted">删除已完成任务</span>
  </div>
</template>
<script>
export default {
  computed: {
    unFinishedTodoLength () {
      return this.todos.filter(todo => !todo.completed).length
    }
  },
  props: {
    filter: {
      type: String
    },
    todos: {
      type: Array
    }
  },
  data () {
    return {
      states: [
        {
          key: 'all',
          name: '全部'
        }, {
          key: 'active',
          name: '未完成'
        }, {
          key: 'completed',
          name: '已完成'
        }
      ]
    }
  },
  methods: {
    toggleFilter (state) {
      this.$emit('toggle', state)
    },
    clearAllCompleted () {
      this.$emit('clearAll')
    }
  }
}

</script>
<style lang="less" scoped>
.helper {
  font-weight: 100;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  line-height: 30px;
  background-color: #ffffff;
  font-size: 14px;
  font-smoothing: antialiased;
  .left,
  .clear,
  .tabs {
    padding: 0px 10px;
    box-sizing: border-box;
  }
  .left,
  .clear {
    width: 150px;
  }
  .left {
    text-align: left;
  }
  .clear {
    text-align: right;
    cursor: pointer;
  }
  .tabs {
    width: 200px;
    display: flex;
    justify-content: space-around;
    * {
      display: inline-block;
      padding: 0px 10px;
      cursor: pointer;
      border: 1px solid rgba(175, 47, 47, 0);
      &.actived {
        border-color: rgba(175, 47, 47, 0.4);
        border-radius: 5px;
      }
    }
  }
}

</style>
