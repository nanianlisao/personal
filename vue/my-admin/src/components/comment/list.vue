<template>
  <el-row class="wrap">
    <!-- 顶部面包屑导航 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评价管理</el-breadcrumb-item>
        <el-breadcrumb-item>评价列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!-- 主体页面 -->
    <el-col :span="24" class="wrap-main">
      <!-- 顶部列表操作 -->
      <el-form ref="form" :inline="true" :model="form" label-width="80px">
        <el-form-item>
          <el-input v-model="form.name" placeholder="商品名称" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="el-form-texts">状态：</span>
          <el-select v-model="form.isShow" placeholder="选择状态" clearable class="condition-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="el-form-texts">评价时间：</span>
          <el-date-picker v-model="valueDate" type="datetimerange" :picker-options="pickerOptions1" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜评价</el-button>
        </el-form-item>
      </el-form>
      <!-- 删除按钮和排序按钮 -->
      <div class="table-action">
        <el-button type="primary" icon="el-icon-delete" @click="delList" :disabled="checkedList.length===0">删除</el-button>
      </div>
      <!-- 列表内容 -->
      <el-table ref="multipleTable" :data="listData" tooltip-effect="dark" style="width: 100%" stripe @selection-change="handleSelectionChange" border v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="index" label="序号" width="100" sortable align="center">
        </el-table-column>
        <el-table-column prop="objectName" label="商品名称" align="center">
        </el-table-column>
        <el-table-column prop="openImg" label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.openImg" alt="" class="avator">
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="时间" align="center">
        </el-table-column>
        <el-table-column label="回复" align="center" width="100">
          <template slot-scope="scope"><i class="el-icon-edit hovers" @click="test(scope.row)"></i></template>
        </el-table-column>
        <el-table-column label="删除" align="center" width="100">
          <template slot-scope="scope"><i class="el-icon-delete hovers"></i></template>
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
import commentSever from '@/api/api'
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
        value: 1,
        label: '未评价'
      }, {
        value: 2,
        label: '追评'
      }],
      currentPage: 1,
      status: '',
      totalCount: 0,
      valueDate: '',
      pickerOptions1: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    handleSearch() {},
    handleSelectionChange(arr) {
      console.log(arr)
      this.checkedList = arr
    },
    test(e) {
      console.log(e)
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
    filterTag(value, row) {
      return value === row.status
    },
    // 获取菜系列表
    async _getCategoryList() {
      this.loading = true
      let res = await commentSever.commentSever.queryCommentList({
        status: this.status
      }, this.currentPage)
      this.totalCount = res.page.totalRows
      res.resultObj = res.resultObj.map(x => x = JSON.parse(x))
      console.log(res)
      this.listData = res.resultObj
      this.listData.map((x, index) => {
        x.index = index + 1
        x.createTime = new Date(x.createTime).Format('yyyy-MM-dd hh:mm:ss')
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
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
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
}

</style>
