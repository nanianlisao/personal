<template>
  <section class="real-app">
    <input type="text" class="add-input" autofocus="autofocus" placeholder="接下来要去做什么？" @keyup.enter="addTodo">
    <Item :todo="todo" v-for="todo in filteredTodos" :key="todo.id" @del="deleteTodo"></Item>
    <Tabs :filter="filter" :todos="filteredTodos" @toggle="toggleTabs" @clearAll="clearAll"></Tabs>
  </section>
</template>
<script>
import Item from '@/components/Item'
import Tabs from '@/components/Tabs'
let id = 0
export default {
  components: {
    Item,
    Tabs
  },
  data () {
    return {
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filteredTodos  () {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo => todo.completed === completed)
    }
  },
  methods: {
    addTodo (e) {
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false
      })
      e.target.value = ''
    },
    deleteTodo (id) {
      this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
    },
    toggleTabs (state) {
      this.filter = state
    },
    clearAll () {
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}

</script>
<style lang="less" scoped>
.real-app {
  width: 90%;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 5px #666;
  .add-input {
    positon: relative;
    margin: 0px;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4rem;
    outline: none;
    color: #333;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0px rgba(0, 0, 0, 0);
    box-sizing: border-box;
    font-smoothing: antialiased;
    padding: 16px 16px 16px 60px;
    border: none;
  }
}

</style>
