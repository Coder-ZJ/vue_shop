// 权限列表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
        <el-table-column prop="path" label="路径" align="center"></el-table-column>
        <el-table-column label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import net from '../../network/rightsNetRequest'

export default {
  name: 'Rights',
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    getRightsList() {
      net
        .getRightsList('list')
        .then(res => {
          console.log(res)
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.rightsList = data
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  mounted() {
    this.getRightsList()
  }
}
</script>

<style scoped>
</style>