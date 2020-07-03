<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入姓名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="switchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserBtn(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserBtn(scope.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoleBtn(scope.row)"
              ></el-button>
            </el-tooltip>
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
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="dialogClosed('addUserFormRef')"
    >
      <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="addUserForm.password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="mobile">
          <el-input v-model="addUserForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSureBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="dialogClosed('editUserFormRef')"
    >
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱号" v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSureBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <el-dialog title="分配角色" :visible.sync="setUserRoleDialogVisible" width="50%">
      <div>
        <p>当前用户名：{{setRoleUserInfo.username}}</p>
        <p>当前角色：{{setRoleUserInfo.role_name}}</p>
      </div>
      <div>
        <span>分配新角色：</span>
        <el-select v-model="selectedRoleId">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="setUserRoleDialogVisible =false">取消</el-button>
        <el-button type="primary" @click="setRoleSureBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import net from '../../network/userNetRequest'

export default {
  name: 'UserList',
  data() {
    // 自定义邮箱校验规则
    const validateEmail = (rule, value, callback) => {
      // 邮箱匹配正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z])+/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    // 自定义手机号校验规则
    const validateMobile = (rule, value, callback) => {
      // 手机号匹配正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      addUserDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },

      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      editUserDialogVisible: false,
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      setUserRoleDialogVisible: false,
      rolesList: [],
      selectedRoleId: '', // 选择的角色id
      setRoleUserInfo: '' // 需分配角色的用户信息
    }
  },
  methods: {
    // 分配角色
    setRoleBtn(userInfo) {
      this.setRoleUserInfo = userInfo
      this.getRolesList()
    },
    setRoleSureBtn() {
      this.setUserRole()
    },
    // 删除用户
    deleteUserBtn(id) {
      this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => this.deleteUser(id))
        .catch(() => {})
    },
    deleteUserSureBtn() {},
    // 编辑用户
    editUserBtn(userInfo) {
      const { username, email, mobile, id } = userInfo
      this.editUserForm.username = username
      this.editUserForm.email = email
      this.editUserForm.mobile = mobile
      this.editUserForm.id = id
      this.editUserDialogVisible = true
    },
    editUserSureBtn() {
      this.$refs.editUserFormRef.validate(valid => {
        if (valid) {
          this.editUserInfo()
        } else {
          this.$message.error('请正确填写用户信息')
        }
      })
    },
    // 添加用户
    addUserSureBtn() {
      this.$refs.addUserFormRef.validate(valid => {
        if (valid) {
          this.addUser()
        } else {
          this.$message.error('请正确填写用户信息')
        }
      })
    },
    dialogClosed(name) {
      // 关闭弹窗，重置表单
      this.$refs[name].resetFields()
    },
    // 状态修改
    switchChange(userInfo) {
      this.updateUserState(userInfo)
    },
    // 分页事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 获取用户列表及用户查询
    getUserList() {
      net
        .getUserList(this.queryInfo)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            const { total, users } = data
            this.userList = users
            this.total = total
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 修改用户状态
    updateUserState(userInfo) {
      net
        .updateUserState(parseInt(userInfo.id), userInfo.mg_state)
        .then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            this.$message.success(meta.msg)
          } else {
            this.$message.error(meta.msg)
            // 修改失败，将状态复原
            userInfo.mg_state = !userInfo.ms_state
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 新增用户
    addUser() {
      net
        .addUser(this.addUserForm)
        .then(res => {
          const { meta } = res.data
          if (meta.status === 201) {
            this.$message.success('添加用户成功')
            this.addUserDialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 编辑用户信息
    editUserInfo() {
      net
        .editUserInfo(this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        .then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            this.$message.success('修改成功')
            this.editUserDialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 删除用户
    deleteUser(id) {
      net
        .deleteUser(id)
        .then(res => {
          const { status, msg } = res.data.meta
          if (status === 200) {
            this.$message.success('删除成功')
            this.getUserList()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 获取角色列表
    getRolesList() {
      net
        .getRoleList()
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.rolesList = data
            this.setUserRoleDialogVisible = true
          } else {
            this.$message.error(meta.msg)
          }
          console.log(res)
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 分配角色
    setUserRole() {
      net
        .setUserRole(this.setRoleUserInfo.id, this.selectedRoleId)
        .then(res => {
          const { msg, status } = res.data.meta
          if (status === 200) {
            this.$message.success('设置角色成功')
            this.setUserRoleDialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(msg)
          }
          console.log(res)
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  mounted() {
    this.getUserList()
  }
}
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
</style>
