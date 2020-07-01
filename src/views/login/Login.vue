<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/logo.png" />
      </div>
      <el-form class="login_form" :model="userForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="userForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="userForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary" @click="loginBtn">登录</el-button>
          <el-button type="info" @click="resetFormBtn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import net from '../../network/userNetRequest'

export default {
  name: 'Login',
  data() {
    return {
      userForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetFormBtn() {
      // 重置表单。获取表单实例：this.$refs.loginFormRef
      this.$refs.loginFormRef.resetFields()
    },
    loginBtn() {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          this.login()
        } else {
          this.$message.error('请填写正确的信息!')
        }
      })
    },
    login() {
      net
        .login(this.userForm.username, this.userForm.password)
        .then(res => {
          const { data, meta } = res.data
          if (meta.status !== 200) {
            this.$message.error(meta.msg)
          } else {
            this.$message.success(meta.msg)
            // 保存token
            sessionStorage.token = data.token
            // 页面跳转
            this.$router.push('/home')
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  }
}
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  /* 居中 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
}
.avatar_box img {
  widows: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.login_btns {
  display: flex;
  justify-content: flex-end;
}
</style>
