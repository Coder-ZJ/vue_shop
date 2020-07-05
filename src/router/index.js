import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'
import UserList from '../views/userManager/UserList.vue'
import Rights from '../views/permissionsManage/Rights.vue'
import Roles from '../views/permissionsManage/Roles.vue'
import GoodsCate from '../views/goodsManage/GoodsCate.vue'
import GoodsParams from '../views/goodsManage/GoodsParams.vue'

Vue.use(VueRouter)

// 解决重复点击路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush
    .call(this, location)
    .catch(err => err)
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [
      { path: '/users', component: UserList },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: GoodsCate },
      { path: '/params', component: GoodsParams }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载前置路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !sessionStorage.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
