// 数据报表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 800px;height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import net from '../../network/dataNetRequest'
import _ from 'lodash'

export default {
  name: 'DataReport',
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: [{ boundaryGap: false }]
      }
    }
  },
  methods: {
    loadReport(data) {
      var myChart = echarts.init(document.getElementById('main'))
      const result = _.merge(this.option, data)
      myChart.setOption(result)
    },
    // 获取报表数据
    getReportData() {
      net
        .getReportData()
        .then(res => {
          console.log(res)
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.loadReport(data)
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => this.$message.error(err))
    }
  },
  mounted() {
    this.getReportData()
  }
}
</script>
<style scoped>
</style>