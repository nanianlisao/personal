<template>
  <el-row class="wrap">
    <!-- 顶部面包屑导航 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!-- 主体页面 -->
    <el-col :span="24" class="wrap-main">
      <div class="info-wrapper">
        <el-card shadow="hover" class="info-item">
          <div class="info-title">累计访问<span class="cash">23652</span>人</div>
          <div class="info-des">
            <div class="des-item">昨日增长<span class="cash">220</span>人</div>
            <div class="des-item">今日新增<span class="cash">110</span>人</div>
          </div>
        </el-card>
        <el-card shadow="hover" class="info-item">
          <div class="info-title">当月订单<span class="cash">2223</span>单</div>
          <div class="info-des">
            <div class="des-item">昨日增长<span class="cash">220</span>单</div>
            <div class="des-item">今日新增<span class="cash">30</span>单</div>
          </div>
        </el-card>
      </div>
      <!-- 图表 -->
      <el-row :span="24" class="echarts-list" v-loading="loading" element-loading-text="加载中，请稍后...">
        <el-col :span="12">
          <div id="chartColumn" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartBar" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartLine" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartPie" style="width:100%; height:400px;"></div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
// let echarts = require('echarts/lib/echarts')
import echarts from 'echarts'
// 引入柱状图组件
// require('echarts/lib/chart/bar')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
export default {
  name: 'hello',
  data() {
    return {
      loading: false,
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      datas: [],
      timer: true
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.datas = require('@/assets/datas.js')
      this._initEcharts()
      this.loading = false
    }, 1000)
    let that = this
    window.onresize = function() {
      if (that.timer) {
        that.timer = false
        that.loading = true
        setTimeout(() => {
          // 清空_echarts_instance_属性 重新渲染echarts  会影响性能
          document.getElementById('chartColumn').setAttribute('_echarts_instance_', '')
          document.getElementById('chartBar').setAttribute('_echarts_instance_', '')
          document.getElementById('chartLine').setAttribute('_echarts_instance_', '')
          document.getElementById('chartPie').setAttribute('_echarts_instance_', '')
          that._initEcharts()
          that.timer = true
          that.loading = false
        }, 400)
      }
    }
  },
  methods: {
    _initEcharts() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartBar = echarts.init(document.getElementById('chartBar'))
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      this.chartPie = echarts.init(document.getElementById('chartPie'))
      let sevenData = { ...this.datas.sevenData }
      let sevenSeries = sevenData.datas.map((item, index) => item = {
        index: index,
        type: 'bar',
        name: item.name,
        data: item.data
      })
      this.chartColumn.setOption({
        title: { text: sevenData.name },
        tooltip: {},
        xAxis: {
          data: sevenData.date
        },
        yAxis: {},
        series: sevenSeries
      })

      this.chartBar.setOption({
        title: {
          text: 'Bar Chart',

          subtext: '数据来自网络'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2011年', '2012年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [{
          name: '2011年',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230]
        }, {
          name: '2012年',
          type: 'bar',
          data: [19325, 23438, 31000, 121594, 134141, 681807]
        }]
      })

      this.chartLine.setOption({
        title: {
          text: 'Line Chart'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        }, {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        }, {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }]
      })

      this.chartPie.setOption({
        title: {
          text: 'Pie Chart',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      })
    }
  }
}

</script>
<style lang="less">
.wrap-main {
  margin-top: 20px;
  .info-wrapper {
    display: flex;
    .info-item {
      width: 300px;
      box-sizing: border-box;
      background-color: #eee;
      &:first-child {
        margin-right: 40px;
      }
      .el-card__body {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cash {
          color: red;
          padding: 0 5px;
        }
        .info-title {
          font-size: 24px;
          width: 130px;
          line-height: 36px;
          color: #333;
        }
        .info-des {
          .des-item {
            font-size: 14px;
            color: #666;
            line-height: 28px;
          }
        }
      }
    }
  }
  .echarts-list {
    margin-top: 40px;
  }
}

</style>
