<template>
  <el-container class="home-container">
    <el-header>
      <div class="logo-box">
        <img src="../../assets/logo.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutBtn">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleBtn">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="menuActivePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="menuItemClick('/' + childItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import net from '../../network/userNetRequest'

export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-user1',
        103: 'iconfont icon-tx-lft-t',
        145: 'iconfont icon-baobiao',
        101: 'iconfont icon-shangpingouwudai2',
        102: 'iconfont icon-dingdandanjuwenjian-'
      },
      isCollapse: false,
      menuActivePath: '/users' // 记录左侧菜单的选中状态
    }
  },
  methods: {
    logoutBtn() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleBtn() {
      this.isCollapse = !this.isCollapse
    },
    menuItemClick(activePath) {
      // 保存左侧菜单选中的状态
      sessionStorage.menuActivePath = activePath
    },
    // 获取菜单列表
    getMenuList() {
      net
        .getMenus()
        .then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.menuList = data
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
    this.getMenuList()
    this.menuActivePath = sessionStorage.menuActivePath
      ? sessionStorage.menuActivePath
      : this.menuActivePath
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}

.el-header .logo-box {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 22px;
}
.logo-box img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.el-aside {
  background-color: #333744;
}
.toggle-btn {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  font-size: 10px;
  line-height: 24px;
  cursor: pointer;
}
.el-menu {
  border-right: 0;
}
.iconfont {
  margin-right: 10px;
}
.el-main {
  background: #eaedf1;
}
</style>
