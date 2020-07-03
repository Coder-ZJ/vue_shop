// 商品分类
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addGoodCateBtn">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格视图 -->
      <tree-table
        class="tree-table"
        :data="goodsCateList"
        :columns="columns"
        :show-index="true"
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <template slot="isValid" scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:green"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="operate" scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editGoodsCateBtn(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeGoodsCateBtn(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addGoodsCateDialogVisible"
      width="50%"
      @close="addGoodCateDialogClosed"
    >
      <el-form :model="addGoodsCateForm" ref="addGoodsCateFormRef" :rules="addGoodsCateRule">
        <el-form-item label="分类名称：" label-width="100px" prop="cat_name">
          <el-input v-model="addGoodsCateForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" label-width="100px">
          <el-cascader
            v-model="selectedKeys"
            :options="parentGoodsCateList"
            :props="props"
            clearable
            @change="cascaderChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addGoodsCateDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addGoodsCateSureBtn">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类弹框 -->
    <el-dialog title="修改分类" :visible.sync="editGoodsCateDialogVisible" width="50%">
      <el-form :model="editGoodsCateForm" :rules="addGoodsCateRule">
        <el-form-item label="分类名称" prop="cat_name" label-width="100px">
          <el-input v-model="editGoodsCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editGoodsCateDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editGoodsCateSureBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import net from '../../network/goodsNetRequest'

export default {
  name: 'GoogdsCate',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsCateList: [],
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isValid' }, // template: 'isValid'指定模板名称
        { label: '排序', type: 'template', template: 'sort' },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
          width: '200px'
        }
      ],
      addGoodsCateDialogVisible: false,
      addGoodsCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addGoodsCateRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentGoodsCateList: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      selectedKeys: [],
      editGoodsCateForm: {
        cat_name: '',
        cat_id: ''
      },
      editGoodsCateDialogVisible: false
    }
  },
  methods: {
    // 编辑分类名
    editGoodsCateBtn(goodsCateInfo) {
      this.editGoodsCateDialogVisible = true
      this.editGoodsCateForm.cat_name = goodsCateInfo.cat_name
      this.editGoodsCateForm.cat_id = goodsCateInfo.cat_id
    },
    editGoodsCateSureBtn() {
      this.editGoodsCate()
    },
    // 删除分类
    removeGoodsCateBtn(id) {
      this.$confirm('此操作将永久删除该分类，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => this.removeGoodsCate(id))
    },
    // 添加分类
    addGoodCateBtn() {
      this.getParentGoodsCateList()
    },
    addGoodsCateSureBtn() {
      this.$refs.addGoodsCateFormRef.validate(valid => {
        if (valid) {
          this.addGoodsCate()
        } else {
          this.$message.error('请输入分类名称')
        }
      })
    },
    addGoodCateDialogClosed() {
      // 关闭弹框重置数据
      this.$refs.addGoodsCateFormRef.resetFields()
      this.addGoodsCateForm.cat_level = 0
      this.addGoodsCateForm.cat_pid = 0
      this.selectedKeys = []
    },
    cascaderChanged() {
      // 当级联选择框发生变化时，cat_pid、cat_level作相应处理
      if (this.selectedKeys.length > 0) {
        this.addGoodsCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addGoodsCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addGoodsCateForm.cat_pid = 0
        this.addGoodsCateForm.cat_level = 0
      }
    },
    // 分页事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCateList()
    },
    // 网络请求
    // 获取商品分类列表
    getGoodsCateList() {
      net
        .getGoodsCateList(this.queryInfo)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.goodsCateList = data.result
            this.total = data.total
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 获取父级分类列表
    getParentGoodsCateList() {
      net
        .getGoodsCateList({ type: 2 })
        .then(res => {
          console.log(res)
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.parentGoodsCateList = data
            this.addGoodsCateDialogVisible = true
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 添加分类
    addGoodsCate() {
      net
        .addGoodsCate(this.addGoodsCateForm)
        .then(res => {
          const { meta } = res.data
          if (meta.status === 201) {
            this.$message.success('分类添加成功')
            this.addGoodsCateDialogVisible = false
            this.getGoodsCateList()
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 编辑分类
    editGoodsCate() {
      net
        .editGoodsCate(
          this.editGoodsCateForm.cat_id,
          this.editGoodsCateForm.cat_name
        )
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('分类修改成功')
            this.editGoodsCateDialogVisible = false
            this.getGoodsCateList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 删除分类
    removeGoodsCate(id) {
      net
        .removeGoodsCate(parseInt(id))
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('删除成功')
            this.getGoodsCateList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  mounted() {
    this.getGoodsCateList()
  }
}
</script>
<style scoped>
.tree-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>