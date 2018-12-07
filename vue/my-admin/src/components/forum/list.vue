<template>
  <el-row class="wrap">
    <!-- 顶部面包屑导航 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>菜系管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜系列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!-- 主体页面 -->
    <el-col :span="24" class="wrap-main">
      <!-- 顶部列表操作 -->
      <el-form ref="form" :inline="true" :model="form" label-width="80px">
        <el-form-item>
          <el-input v-model="form.name" placeholder="菜系名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.isShow" placeholder="请选择" clearable class="condition-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 删除按钮和排序按钮 -->
      <div class="table-action">
        <el-button type="primary" icon="el-icon-document" @click="confirmSort">确认排序</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="delList" :disabled="checkedList.length===0">删除</el-button>
      </div>
      <!-- 列表内容 -->
      <el-table ref="multipleTable" :data="listData" tooltip-effect="dark" style="width: 100%" stripe @selection-change="handleSelectionChange" border v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="index" label="序号" width="120" sortable align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.index" controls-position="right" :min="1" class="table-input-number"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="shows" label="是否显示" align="center" :filters="filters" :filter-method="filterTag" width="120" filter-placement="bottom-end">
          <template slot-scope="scope"><i class="el-icon-success" v-if="scope.row.status===1"></i><i class="el-icon-error" v-else></i> </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next, total" background :total="totalCount" class="table-el-pagination" @current-change="changeListData">
      </el-pagination>
      <!-- 添加菜系dialog -->
      <el-dialog title="添加菜系" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="add">
          <el-form-item label="菜系名称" :label-width="formLabelWidth">
            <el-input v-model="add.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" :label-width="formLabelWidth">
            <el-switch v-model="add.status" active-value='1' inactive-value='2'>
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAndSubmit" icon="el-icon-document">保存并提交审核</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import subjectSever from '@/api/api'
// import axios from 'axios'
// import qs from 'qs'
export default {
  data() {
    return {
      add: { // 新添的表单数据
        name: '',
        status: '1'
      },
      loading: false,
      formLabelWidth: '120px',
      checkedList: [], // 做删除时的列表
      dialogFormVisible: false, // 控制新增弹出框的隐藏
      filters: [{
        text: '显示',
        value: 1
      }, {
        text: '不显示',
        value: 2
      }],
      form: {
        name: '',
        isShow: ''
      },
      listData: [],
      options: [{
        value: true,
        label: '显示'
      }, {
        value: false,
        label: '不显示'
      }],
      currentPage: 1,
      status: '',
      totalCount: 0
    }
  },
  methods: {
    handleSearch() {},
    handleSelectionChange(arr) {
      console.log(arr)
      this.checkedList = arr
    },
    // 添加菜系
    saveAndSubmit() {
      if (this.add.name.trim()) {
        this.listData.push({
          name: this.add.name,
          indexs: this.listData.length + 1,
          id: this.listData.length + 1,
          status: this.add.status,
          sequence: this.listData.length + 1
        })
        // 新添的表单数据
        this.add = {
          name: '',
          status: 1
        }
        this.dialogFormVisible = false
      } else {
        this.$message.error('请输入菜系名称')
      }
    },
    // 删除列表
    delList() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listData = this.listData.filter(x => !this.checkedList.some(y => y.id === x.id))
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.$refs.multipleTable.clearSelection()
      })
    },
    // 确认排序
    confirmSort() {
      this.listData.map(x => { x.sequence = x.index })
      this.$message({
        message: '排序成功',
        showClose: true,
        type: 'success'
      })
    },
    filterTag(value, row) {
      return value === row.status
    },
    // 获取菜系列表
    async _getCategoryList() {
      this.loading = true
      let res = await subjectSever.subjectSever.subjectCategoryList({
        status: this.status
      }, this.currentPage)
      console.log(res)
      this.totalCount = res.page.totalRows
      this.listData = res.resultObj
      this.listData.map((x) => {
        x.index = x.sequence
      })
      this.loading = false
    },
    changeListData(index) {
      this.currentPage = index
      this._getCategoryList()
    }
  },
  async created() {
    this._getCategoryList()
  },
  // 路由守卫
  beforeRouteLeave(to, from, next) {
    if (this.checkedList.length === 0) {
      next()
    } else {
      this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？',
          '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃修改'
          })
        .then(() => {
          this.$message({
            type: 'info',
            message: '保存修改'
          })
          next()
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel' ?
              '放弃保存并离开页面' : '停留在当前页面'
          })
          next()
        })
    }
  }
}

</script>
<style lang="less">
.wrap-main {
  margin-top: 20px;
  .table-action {
    margin: 10px 0;
  }
  .condition-select {
    width: 100px;
  }
  .table-input-number {
    width: 100px;
  }
  .table-el-pagination {
    margin: 20px 0;
    text-align: right;
  }
}

</style>
