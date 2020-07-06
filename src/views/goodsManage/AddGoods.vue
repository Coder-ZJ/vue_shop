// 添加商品
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="stepsActiveIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="stepsActiveIndex"
          tab-position="left"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number" placeholder="请输入商品价格"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number" placeholder="请输入商品重量"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number" placeholder="请输入商品数量"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsCateList"
                :props="props"
                @change="handleCascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyParamsListData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyParamsListData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" @click="addGoodsBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img :src="imgUrl" />
    </el-dialog>
  </div>
</template>
<script>
import net from '../../network/goodsNetRequest'
import _ from 'lodash'

export default {
  name: 'AddGoods',
  data() {
    return {
      stepsActiveIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        goods_introduce: '',
        attrs: [],
        pics: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      goodsCateList: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyParamsListData: [], // 动态参数列表数据
      onlyParamsListData: [], // 静态属性列表数据
      headerObj: {
        Authorization: sessionStorage.token
      },
      imgUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // 添加商品
    addGoodsBtn() {
      this.$refs.addGoodsFormRef.validate(valid => {
        if (valid) {
          // 使用了 lodash 进行深拷贝
          const goodsForm = _.cloneDeep(this.addGoodsForm)
          goodsForm.goods_cat = goodsForm.goods_cat.join(',')
          // 处理动态参数
          this.manyParamsListData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addGoodsForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyParamsListData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addGoodsForm.attrs.push(newInfo)
          })
          goodsForm.attrs = this.addGoodsForm.attrs
          this.addGoods(goodsForm)
        } else {
          this.$message.error('请填写必填的表单项')
        }
      })
    },
    // 图片上传相关事件
    handleRemove(file) {
      // 要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(
        item => item.pic === filePath
      )
      this.addGoodsForm.pics.splice(index, 1)
    },
    handlePreview(file) {
      this.imgUrl = file.response.data.url
      this.dialogVisible = true
    },
    handleSuccess(response) {
      const { data, meta } = response
      if (meta.status === 200) {
        const picInfo = { pic: data.tmp_path }
        this.addGoodsForm.pics.push(picInfo)
        console.log(this.addGoodsForm.pics)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // tabs 事件
    beforeTabsLeave(activeName, oldActiveName) {
      if (!this.addGoodsForm.goods_cat.length && oldActiveName === '0') {
        this.$message.error('请选择商品分类')
        return false
      } else {
        return true
      }
    },
    tabClicked() {
      if (this.stepsActiveIndex === '1') {
        // 选中商品参数
        this.getCateParamsList('many')
      } else if (this.stepsActiveIndex === '2') {
        this.getCateParamsList('only')
      }
    },
    // 级联选择器事件
    handleCascaderChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        return
      }
      console.log(this.addGoodsForm.goods_cat)
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
        .catch(err => this.$message.error(err))
    },
    // 获取参数列表
    getCateParamsList(sel) {
      net
        .getCateParamsList(this.cateId, sel)
        .then(res => {
          console.log(res.data.data)
          const { data, meta } = res.data
          if (meta.status === 200) {
            if (sel === 'many') {
              // 动态参数数据处理
              data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              })
              this.manyParamsListData = data
            } else {
              // 静态属性
              this.onlyParamsListData = data
            }
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => this.$message.error(err))
    },
    // 添加商品
    addGoods(params) {
      net
        .addGoods(params)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 201) {
            this.$message.success('商品添加成功')
            this.$router.push('/goods')
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => this.$message.error(err))
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  mounted() {
    this.getGoodsCateList()
  }
}
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 7px;
}
.el-dialog img {
  width: 100%;
}
.quill-editor {
  margin-bottom: 15px;
}
</style>