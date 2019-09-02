<template>
  <div class="todo">
    <Header></Header>
    <TodoList></TodoList>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from '../components/Header'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'
export default {
  components: {
    Header,
    Footer,
    TodoList
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.todo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

</style>
