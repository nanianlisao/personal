<template>
  <el-row class="wrap">
    <!-- 顶部面包屑导航 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>菜系管理</el-breadcrumb-item>
        <el-breadcrumb-item>关于我们</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!-- 主体页面 -->
    <el-col :span="24" class="wrap-main">
      这是关于我们
    </el-col>
  </el-row>
</template>
<script>
// import { quillEditor } from 'vue-quill-editor' // 调用编辑器
export default {}

</script>
<style lang="less">
.wrap-main {
  margin-top: 20px;
}

</style>
