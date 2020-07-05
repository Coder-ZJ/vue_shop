// 商品参数
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告框 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="goodsCateList"
            :props="props"
            clearable
            @change="cascaderChanged"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab菜单 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsBtn">添加参数</el-button>
          <el-table :data="cateParamsList" border stripe ex>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeVals(scope.row, index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="参数名称" align="center" prop="attr_name"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamBtn(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamBtn(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamsBtn">静态属性</el-button>
          <el-table :data="cateParamsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeVals(scope.row, index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="参数名称" align="center" prop="attr_name"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamBtn(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamBtn(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加/编辑弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClosed">
      <el-form :model="paramsForm" :rules="paramsFormRule" ref="paramsFormRef">
        <el-form-item :label="labelText" prop="attr_name" label-width="100px">
          <el-input v-model="paramsForm.attr_name" :placeholder="'请输入' + labelText"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible =false">取消</el-button>
        <el-button type="primary" @click="dialogSureBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import net from '../../network/goodsNetRequest'

export default {
  name: 'GoodsParams',
  data() {
    return {
      goodsCateList: [],
      selectedKeys: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      cateParamsList: [],
      dialogVisible: false,
      paramsForm: {
        attr_name: ''
      },
      paramsFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ]
      },
      isAddorEdit: true, // 标记是添加还是编辑，默认添加
      attrId: '' // 属性id
    }
  },
  methods: {
    // 删除参数项
    removeVals(paramInfo, index) {
      paramInfo.attr_vals.splice(index, 1)
      this.updateVals(paramInfo)
    },
    handleInputConfirm(paramInfo) {
      if (paramInfo.inputValue.trim().length === 0) {
        paramInfo.inputVisible = false
        paramInfo.inputValue = ''
        return
      }
      paramInfo.attr_vals.push(paramInfo.inputValue.trim())
      this.updateVals(paramInfo)
    },
    showInput(paramInfo) {
      paramInfo.inputVisible = true
      // 当页面上元素被重新渲染之后，才会回调函数$nextTick
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 编辑
    editParamBtn(paramsInfo) {
      this.paramsForm.attr_name = paramsInfo.attr_name
      this.attrId = paramsInfo.attr_id
      this.isAddorEdit = false
      this.dialogVisible = true
    },
    // 删除
    removeParamBtn(id) {
      this.attrId = id
      this.$confirm('此操作将永久删除该属性，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.removeParams()
        })
        .catch(() => {})
    },
    // 添加动态参数/添加静态属性
    addParamsBtn() {
      this.isAddorEdit = true
      this.dialogVisible = true
    },
    dialogSureBtn() {
      this.$refs.paramsFormRef.validate(valid => {
        if (valid) {
          if (this.isAddorEdit) {
            this.addParams()
          } else {
            this.editParams()
          }
        } else {
          this.$message.error('请正确填写信息')
        }
      })
    },
    dialogClosed() {
      this.$refs.paramsFormRef.resetFields()
      this.paramsForm.attr_name = ''
    },
    // 级联选择器事件
    cascaderChanged() {
      // 如果选择的不是三级分类，就无法选中
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.cateParamsList = []
        // return
      } else {
        this.getCateParamsLsit()
      }
    },
    // tab菜单
    handleTabClick() {
      if (this.selectedKeys.length !== 0) {
        this.getCateParamsLsit()
      }
    },
    // 网络请求
    // 获取商品分类
    getGoodsCateList() {
      net
        .getGoodsCateList()
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.goodsCateList = data
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 获取分类参数列表
    getCateParamsLsit() {
      net
        .getCateParamsList(this.cateId, this.activeName)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            // 将 item.attr_vals 字符串处理为数组
            data.forEach(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              item.inputVisible = false
              item.inputValue = ''
            })
            this.cateParamsList = data
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => this.$message.error(err))
    },
    // 添加动态参数或静态属性
    addParams() {
      net
        .addParams(this.cateId, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 201) {
            this.dialogVisible = false
            this.getCateParamsLsit()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 编辑动态参数或静态属性
    editParams() {
      net
        .editParams(this.cateId, this.attrId, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.getCateParamsLsit()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 删除动态参数或静态属性
    removeParams() {
      net
        .removeParams(this.cateId, this.attrId)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('删除成功')
            this.getCateParamsLsit()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 修改参数项
    updateVals(paramInfo) {
      net
        .editParams(paramInfo.cat_id, paramInfo.attr_id, {
          attr_name: paramInfo.attr_name,
          attr_sel: paramInfo.attr_sel,
          attr_vals: paramInfo.attr_vals.join(' ')
        })
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('参数项修改成功')
            paramInfo.inputValue = ''
            paramInfo.inputVisible = false
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      } else {
        return null
      }
    },
    dialogTitle() {
      if (this.isAddorEdit) {
        if (this.activeName === 'many') {
          return '添加动态参数'
        } else {
          return '添加静态属性'
        }
      } else {
        if (this.activeName === 'many') {
          return '修改动态参数'
        } else {
          return '修改静态属性'
        }
      }
    },
    labelText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  mounted() {
    this.getGoodsCateList()
  }
}
</script>
<style scoped>
.cat-opt {
  margin: 15px 0;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 90px;
  margin-left: 7px;
}
.button-new-tag {
  margin-left: 7px;
}
</style>