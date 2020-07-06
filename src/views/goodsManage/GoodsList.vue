// 商品列表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入商品名称" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsBtn">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" align="center" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" align="center" width="70px"></el-table-column>
        <el-table-column label="创建时间" align="center" width="170px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsBtn"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsBtn(scope.row.goods_id)"
            ></el-button>
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
  </div>
</template>
<script>
import net from '../../network/goodsNetRequest'

export default {
  name: 'GoodsList',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsList: []
    }
  },
  methods: {
    // 添加商品
    addGoodsBtn() {
      this.$router.push('goods/add')
    },
    //  删除商品
    removeGoodsBtn(id) {
      this.$confirm('此操作将永久删除该商品，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => this.removeGoods(id))
        .catch(err => err)
    },
    // 编辑商品
    editGoodsBtn() {
      this.$message.info('暂未实现')
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 网络请求
    // 获取商品列表
    getGoodsList() {
      net
        .getGoodsList(this.queryInfo)
        .then(res => {
          console.log(res)
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.goodsList = data.goods
            this.total = data.total
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.message.$error(err)
        })
    },
    // 删除商品
    removeGoods(id) {
      net
        .removeGoods(id)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('删除成功')
            this.getGoodsList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => this.$message.error(err))
    }
  },
  mounted() {
    this.getGoodsList()
  }
}
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
</style>