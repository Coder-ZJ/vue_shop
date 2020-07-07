// 订单列表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入订单号" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderListData" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80px"></el-table-column>
        <el-table-column label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status !== '0'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80px"></el-table-column>
        <el-table-column label="下单时间" width="170px">
          <template slot-scope="scope">{{scope.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="locationBtn"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 展示物流信息弹框 -->
    <el-dialog title="物流信息" :visible.sync="dialogVisible">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logisticsInfoData"
          :key="index"
          :timestamp="item.time"
          placement="top"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import net from '../../network/orderNetRequest'

export default {
  name: 'OrderList',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderListData: [],
      logisticsInfoData: [],
      dialogVisible: false
    }
  },
  methods: {
    locationBtn() {
      this.getLogisticsInfo()
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 网络请求
    // 获取订单列表数据
    getOrderList() {
      net
        .getOrderList(this.queryInfo)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.orderListData = data.goods
            this.total = data.total
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => this.$message.error(err))
    },
    // 获取物流信息
    getLogisticsInfo() {
      net
        .getLogisticsInfo()
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.logisticsInfoData = data
            this.dialogVisible = true
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => this.$message.error(err))
    }
  },
  mounted() {
    this.getOrderList()
  }
}
</script>
<style scoped>
.el-table {
  margin: 15px 0;
}
</style>