// 角色列表
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table border :data="rolesList" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              :class="['rowbottom', index === 0 ? 'rowtop' : '']"
              v-for="(item,index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRoleById(scope.row, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[index === 0 ? '' : 'rowtop']"
                  v-for="(childItem,index) in item.children"
                  :key="childItem.id"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleById(scope.row, childItem.id)"
                    >{{childItem.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="14">
                    <el-tag
                      v-for="childItem1 in childItem.children"
                      :key="childItem1.id"
                      type="warning"
                      closable
                      @close="removeRoleById(scope.row, childItem1.id)"
                    >{{childItem1.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleBtn(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleBtn(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRoleRightsBtn(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="dialogClosed('addRoleFormRef')"
    >
      <el-form
        :model="addRoleForm"
        label-width="100px"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="addRoleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addRoleDialogVisible =false">取消</el-button>
        <el-button type="primary" @click="addRoleSureBtn">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRoleRightsDialogVisible"
      width="50%"
      @close="setRoleRightsDialogClosed"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="treeRef"
        highlight-current
        :props="treeProps"
        :default-checked-keys="defaultCheckedKeys"
      ></el-tree>
      <div slot="footer">
        <el-button @click="setRoleRightsDialogVisible =false">取消</el-button>
        <el-button type="primary" @click="setRoleRightsSureBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import net from '../../network/userNetRequest'
import network from '../../network/rightsNetRequest'

export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      roleId: '', // 角色id
      removeRoleRightsId: '', // 需删除的权限id
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      roleOperate: '', // 标记是添加或编辑角色操作
      dialogTitle: '',
      setRoleRightsDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defaultCheckedKeys: [] // 默认选中的节点
    }
  },
  methods: {
    // 分配权限
    setRoleRightsBtn(role) {
      this.roleId = role.id
      this.getLeafKeys(role, this.defaultCheckedKeys)
      this.getRightsList()
    },
    setRoleRightsSureBtn() {
      // 选中节点的id数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      this.setRights(keys.join(','))
    },
    // 递归获取三级权限的所有id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => this.getLeafKeys(item, arr))
      }
    },
    setRoleRightsDialogClosed() {
      // 关闭弹框重置默认选中数据
      this.defaultCheckedKeys = []
    },
    // 删除角色
    removeRoleBtn(roleId) {
      this.roleId = roleId
      this.$confirm('此操作将永久删除该角色，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.removeRole()
        })
        .catch(() => {})
    },
    // 编辑角色
    editRoleBtn(roleInfo) {
      const { roleName, roleDesc, id } = roleInfo
      this.addRoleForm.roleName = roleName
      this.addRoleForm.roleDesc = roleDesc
      this.roleId = id
      this.roleOperate = 'editRole'
      this.dialogTitle = '修改角色'
      this.addRoleDialogVisible = true
    },
    // 添加角色
    addRoleBtn() {
      this.roleOperate = 'addRole'
      this.dialogTitle = '添加角色'
      this.addRoleDialogVisible = true
    },
    addRoleSureBtn() {
      this.$refs.addRoleFormRef.validate(valid => {
        if (valid) {
          this.roleOperate === 'addRole' ? this.addRole() : this.editRole()
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    dialogClosed(name) {
      this.$refs[name].resetFields()
    },

    // 网络请求
    // 删除权限
    removeRoleById(role, rightsId) {
      this.$confirm('此操作将永久删除该权限，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.removeRoleRights(role, rightsId)
        })
        .catch(() => {})
    },
    // 获取角色列表
    getRolesList() {
      net
        .getRoleList()
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.rolesList = data
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 删除权限
    removeRoleRights(role, rightsId) {
      network
        .removeRoleRights(role.id, rightsId)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.$message.success('权限删除成功')
            role.children = data
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 添加角色
    addRole() {
      network
        .addRole(this.addRoleForm)
        .then(res => {
          console.log(res.data)
          const { msg, status } = res.data.meta
          if (status === 201) {
            this.addRoleDialogVisible = false
            this.$message.success('角色添加成功')
            this.getRoleList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 编辑角色
    editRole() {
      network
        .editRole(this.roleId, this.addRoleForm)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('角色修改成功')
            this.addRoleDialogVisible = false
            this.getRolesList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 删除橘色
    removeRole() {
      network
        .removeRole(this.roleId)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('删除角色成功')
            this.getRolesList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 获取权限列表
    getRightsList() {
      network
        .getRightsList('tree')
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.rightsList = data
            this.setRoleRightsDialogVisible = true
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 分配权限
    setRights(rightsId) {
      network
        .setRights(this.roleId, rightsId)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('权限分配成功')
            this.setRoleRightsDialogVisible = false
            this.getRolesList()
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
    this.getRolesList()
  }
}
</script>
<style scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.rowtop {
  border-top: 1px solid #eee;
}
.rowbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>